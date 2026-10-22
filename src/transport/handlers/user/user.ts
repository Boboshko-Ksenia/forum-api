import "dotenv/config";
import type { UserServiceContract } from "../../../services/user/user.types";
import type { UserHandlerContract } from "./user.types";

export function createUserHandler(
  service: UserServiceContract
): UserHandlerContract {
  return {
    async register(req, res) {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          res.status(422).json({ message: "Validation Error!" });
          return;
        }

        const user = await service.register({ email, password });
        res.status(201).json(user);
      } catch (error: any) {
        if (
          error instanceof Error &&
          (error.message.includes("already used") ||
           error.message.includes("unique constraint"))
        ) {
          res.status(409).json({ message: "Email is already used!" });
          return;
        }

        res.status(500).json({ message: "Internal server error" });
      }
    },

    async login(req, res) {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          res.status(422).json({ message: "Validation Error!" });
          return;
        }

        const result = await service.login({ email, password });

        res.cookie("accessToken", result.token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 15 * 60 * 1000,
          path: "/",
        });

        res.status(200).json(result.user);
      } catch (error: any) {
        if (
            error instanceof Error &&
            (error.message.includes("INVALID CREDENTIALS") ||
            error.message.includes("Invalid") ||
            error.message.includes("not found") ||
            error.message.includes("credentials"))
        ) {
          res.status(401).json({ message: "Invalid email or password!" });
          return;
        }

        res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}