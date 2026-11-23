import type { Request, RequestHandler, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { UserCredentialsBody } from "../../dto/user/requests.js";

export interface UserHandlerContract {
	[x: string]: RequestHandler<
		ParamsDictionary,
		any,
		any,
		ParsedQs,
		Record<string, any>
	>;
	refresh: RequestHandler<
		ParamsDictionary,
		any,
		any,
		ParsedQs,
		Record<string, any>
	>;
	me: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
	register: (
		req: Request<{}, {}, UserCredentialsBody>,
		res: Response,
	) => Promise<void>;
	login: (
		req: Request<{}, {}, UserCredentialsBody>,
		res: Response,
	) => Promise<void>;
	logout: (
		req: Request<{}, {}, UserCredentialsBody>,
		res: Response,
	) => Promise<void>;
}
