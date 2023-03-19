import { NextFunction, Response, Request } from "express";
import { ELevel, levelToLI } from "../dtos";

const roleMiddleware = (role: ELevel) =>  (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        if (!req.user) {
            console.error("ты забыл authMiddleware")
            throw new Error("")
        }

        if (levelToLI(role) > levelToLI(req.user.level as ELevel)) {
            res.render("fbdn.handlebars")

            throw new Error("ok")
        }

    })().then(next).catch(() => {})
}

export {
    roleMiddleware
}