import type { Request, RequestHandler, Response } from "express"
import type { UserCredentialsBody } from "../../dto/user/requests.js"
import type { ParamsDictionary } from "express-serve-static-core"
import type { ParsedQs } from "qs"

export interface UserHandlerContract{
    refresh(arg0: string, refresh: any): unknown
    me(arg0: string, requireAuth: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, me: any): unknown
    register: (
        req: Request<{}, {}, UserCredentialsBody>,
        res: Response,
    ) => Promise<void>
    login: (
        req: Request<{}, {}, UserCredentialsBody>,
        res: Response,
    ) => Promise<void>
}