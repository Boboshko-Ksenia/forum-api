import "dotenv/config";
import type { UserServiceContract, UserTokens } from "../../../services/user/user.types";
import type { UserHandlerContract } from "./user.types";
import type { Response } from "express"

function setUserTokens(
    res: Response,
    tokens: UserTokens
){
    res.cookie("accessToken", tokens.accessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 15 * 60 * 1000,
                    path: "/"
    })
    res.cookie("refreshToken", tokens.refreshToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path: "/"
    })
}

export function createUserHandler(
  service: UserServiceContract
): UserHandlerContract & {
  refresh: UserHandlerContract["login"];
  me: UserHandlerContract["login"];
} {
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
        setUserTokens(res, {
          accessToken: result.accessToken, 
          refreshToken: result.refreshToken 
        })
        // res.cookie("accessToken", result.token, {
        //   httpOnly: true,
        //   sameSite: "lax",
        //   secure: process.env.NODE_ENV === "production",
        //   maxAge: 15 * 60 * 1000,
        //   path: "/",
        // });

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
    async refresh(req, res){
            const refreshToken = (req as any).cookies?.refreshToken
            console.log(refreshToken)
            if (typeof refreshToken !== 'string'){
                res.status(401).json({message: 'Unathorized'})
                return
            }
            try{
                const tokens = await service.refresh(refreshToken)
                setUserTokens(res, tokens)
                res.status(200).json({message: 'tokens update'})
            }
            catch(error){
                console.log(error)
                res.status(500).json({message: 'Internal Server Error'})
            }
        },

        async me(req, res) {
            try {
                const userId = (res as any).locals.userId
                const user = await service.me(userId);

                (res as any).status(200).json(user)
            }

            catch(error) {
                (res as any).status(500).json({message: "Internal server error!"})
            }
        }
            
    }
}