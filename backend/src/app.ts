import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Config } from "./config";
import { createContainer } from "./container";
import { ROUTES } from "./shared/constants/routes";

export function createApp(config: Config) {
	const { routers } = createContainer(config);
	const app = express();

	app.use(
		cors({
			origin: config.corsOrigin,
			credentials: true,
		}),
	);
	app.use(express.json());
	app.use(cookieParser());

	app.use(ROUTES.CATEGORY, routers.categoryRouter);
	app.use(ROUTES.POSTS, routers.postRouter);
	app.use(ROUTES.USER, routers.userRouter);

	return app;
}