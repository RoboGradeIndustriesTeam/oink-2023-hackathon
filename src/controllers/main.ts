import { Request, Response, Router } from "express";
import { authMiddleware, notNeedAuthMiddleware } from "../middlewares/authMiddleware";
import { ELevel, Levels, levelToLI } from "../dtos";
import multer from "multer";
import { compare, genSalt, hash } from "bcryptjs";
import { roleMiddleware } from "../middlewares/roleMiddleware";

class mainController {
    public static async index(req: Request, res: Response) {
        let p = await req.db.posters.findMany({
            include: {
                image: true
            }
        });
        const news = await req.db.news.findMany({});
        const lst3news = news.slice(Math.max(news.length - 3, 0))
        res.render("index", {
            posters: p,
            postersX: p.slice(1),
            news: lst3news
        })
    }

    public static async profile(req: Request, res: Response) {
        if (!req.user) return res.render("fbdn")
        res.render("profile", { ulevel: Levels[req.user.level as ELevel] })
    }

    public static async logout(req: Request, res: Response) {
        req.session.userId = undefined;
        res.redirect("/")
    }

    public static async postProfile(req: Request, res: Response) {

        if (!req.user) return res.render("fbdn")
        const action = req.body.action;
        if (action === "change-avatar") {
            if (req.files) {

                await req.db.user.update({
                    where: {
                        id: req.user?.id
                    },
                    data: {
                        avatar: {
                            connectOrCreate: {
                                create: {
                                    // @ts-ignore
                                    uid: req.files[0].filename

                                },
                                where: {
                                    // @ts-ignore
                                    uid: req.files[0].filename // оно всегда будет создаваться т.к никогда не совпадёт uid
                                }
                            }
                        }
                    }
                })
            }
        }
        else if (action === "change-pass") {
            const { old, new1, new2 } = req.body;

            if (new1 !== new2) {
                if (!req.user) return res.render("fbdn")
                return res.render("profile", { ulevel: Levels[req.user.level as ELevel], changePassError: "пароли не совпдают" })
            }
            if (!await compare(old, req.user.password)) {
                if (!req.user) return res.render("fbdn")
                return res.render("profile", { ulevel: Levels[req.user.level as ELevel], changePassError: "не верный пароль" })
            }

            await req.db.user.update({
                where: {
                    id: req.user.id
                },
                data: {
                    password: {
                        set: await hash(new1, await genSalt())
                    }
                }
            })

            await new Promise((rs, rj) => req.session.destroy(rs))

            return res.redirect("/")
        }
        return res.redirect("/profile")

    }

    public static async anotherProfile(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        if (!userId) return res.render("fbdn")

        const c = await req.db.user.findUnique({where: {id: userId}, include: {otdel: true}})

        if (!c) return res.render("fbdn");
        if (!req.user) return res.render("fbdn")

        if (levelToLI(req.user.level as ELevel) < levelToLI(c.level as ELevel)) {
            return res.render("fbdn")
        }

        return res.render("profile-another",  { ulevel: Levels[c.level as ELevel], auser: c })
    }
}

const r = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './media/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.originalname.split(".")[file.originalname.split(".").length - 1])
    }
})

const u = multer({
    storage: storage
})

r.get("/", notNeedAuthMiddleware, mainController.index);
r.get("/profile", authMiddleware, mainController.profile);
r.post("/profile", authMiddleware, u.any(), mainController.postProfile)
r.get("/profile/:id", authMiddleware, mainController.anotherProfile)
r.get("/logout", authMiddleware, mainController.logout);


export default r;