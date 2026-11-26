import type {
	UserServiceContract,
} from "../../../services/user/user.types";
import type { UserHandlerContract } from "./user.types";
import { clearUserTokens, readRefreshToken, setUserTokens } from "../../cookies/user";

export function createUserHandler(
	service: UserServiceContract,
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
			} catch (error) {
				res.status(500).json({ message: "Internal Server Error!" });
			}
		},

		async login(req, res) {
			try {
				const { email, password } = req.body;

				const result = await service.login({ email, password });

				setUserTokens(res, {
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
				});
				res.status(200).json(result.user);
			} catch (error) {
				res.status(500).json({ message: "Internal server error" });
			}
		},
		async refresh(req, res) {
			const refreshToken = readRefreshToken(req);

			console.log(refreshToken);
			if (typeof refreshToken !== "string") {
				res.status(401).json({ message: "Unathorized" });
				return;
			}
			try {
				const tokens = await service.refresh(refreshToken);
				setUserTokens(res, tokens);
				res.status(200).json({ message: "tokens update" });
			} catch (error) {
				console.log(error);
				res.status(500).json({ message: "Internal Server Error" });
			}
		},

		async me(req, res) {
			try {
				const userId = res.locals.userId;
				const user = await service.me(userId);

				res.status(200).json(user);
			} catch (error) {
				res.status(500).json({ message: "Internal server error!" });
			}
		},

		async logout(req, res) {
			try {
				const refreshToken = readRefreshToken(req);

				await service.logout(
					typeof refreshToken === "string" ? refreshToken : undefined,
				);
				clearUserTokens(res)
				res.status(200).json({ message: "Logged out" });
			} catch (error) {
				res.status(500).json({ message: "Internal server error!" });
			}
		},
	};
}