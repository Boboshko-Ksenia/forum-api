// import { Temporal } from "@js-temporal/polyfill";
// if (!(globalThis as any).Temporal) {
//   (globalThis as any).Temporal = Temporal;
// }

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {createTokenHasher} from "./lib/jwt.js";
import { createPasswordHasher } from "./lib/password.js";
import { db } from "./prisma/db.js";
import { createCategoryRepository } from "./repositories/category.js";
import { createPostRepository } from "./repositories/post.js";
import { createRefreshSessionRepository } from "./repositories/refresh-session.js";
import { createUserRepository } from "./repositories/user.js";
import { createCategoryService } from "./services/category/category.js";
import { createPostService } from "./services/post/post.js";
import { createUserService } from "./services/user/user.js";
import { createCategoryHandlers } from "./transport/handlers/category/category.js";
import { createPostHandlers } from "./transport/handlers/post/post.js";
import { createUserHandler } from "./transport/handlers/user/user.js";
import { createRequireAuth } from "./transport/middlewares/require-auth.js";
import { createCategoryRouter } from "./transport/routers/category.js";
import { createPostRouter } from "./transport/routers/post.js";
import { createUserRouter } from "./transport/routers/user.js";
import { ROUTES } from "./shared/constants/routes.js";
import { config } from "./config.js";
const app = express();
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);

const PORT = 8000;
const HOST = "localhost";

app.use(express.json());
app.use(cookieParser());
const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandlers = createPostHandlers(postService);
const postRouter = createPostRouter(postHandlers);

app.use(ROUTES.POSTS, postRouter);

const categoryRepository = createCategoryRepository(db);
const categoryService = createCategoryService(categoryRepository);
const categoryHandlers = createCategoryHandlers(categoryService);
const categoryRouter = createCategoryRouter(categoryHandlers);

const userRepository = createUserRepository(db);
const refreshSessionRepository = createRefreshSessionRepository(db);

const passwordHasher = createPasswordHasher(config.passwordPepper);
const tokenHasher = createTokenHasher(config.jwtAccessSecret, config.jwtRefreshSecret);
app.use(ROUTES.CATEGORY, categoryRouter);

const userService = createUserService(
	{
		repository: userRepository,
		refreshSessionRepository,
		passwordHasher,
		tokenHasher
    }
);
const userHandlers = createUserHandler(userService);
const requireAuth = createRequireAuth(tokenHasher.verifyAccessToken);

const userRouter = createUserRouter(userHandlers, requireAuth);

app.use(ROUTES.USER, userRouter);

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
function verifyAccessToken(token: string): number {
    throw new Error("Function not implemented.");
}

