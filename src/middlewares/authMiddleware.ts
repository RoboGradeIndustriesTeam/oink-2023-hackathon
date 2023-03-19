import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { Socket } from "socket.io";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        // @ts-ignore
        console.log("auth middlesrtare", req.id);

        if (req.session.userId) {
            const c = await req.db.user.findUnique({
                where: {
                    id: req.session.userId
                },
                include: {
                    otdel: true,
                    avatar: true
                }
            });

            if (c) {
                res.locals.user = c;
                req.user = c;
            }
            else {
                res.render("fbdn.handlebars");

                throw new Error("ok")
            }
        }
        else {
            res.render("fbdn.handlebars")
            throw new Error("ok")
        }
    })().then(next).catch(r => { })
}

// not need подразумивает то что не обезателен вход
export const notNeedAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        if (req.session.userId) {
            const c = await req.db.user.findUnique({
                where: {
                    id: req.session.userId
                },
                include: {
                    otdel: true,
                    avatar: true
                }
            });

            if (c) {
                res.locals.user = c;
                req.user = c;
            }
        }
    })().then(next).catch(r => { })
}

// socket.io
export const sIOauthMiddleware = (db: PrismaClient) => (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        // @ts-ignore
        console.log("auth sdasd", req.session);

        if (req.session.userId) {
            const c = await db.user.findUnique({
                where: {
                    id: req.session.userId
                },
                include: {
                    otdel: true,
                    avatar: true
                }
            });

            if (c) {
                req.user = c;
            }
            else {

                throw new Error("ok")
            }
        }
        else {
            throw new Error("ok")
        }
    })().then(() => next()).catch(r => {
        console.error("sio", r);
        next(r)
    })
}