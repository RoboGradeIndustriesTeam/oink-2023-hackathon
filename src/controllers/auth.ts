import { Request, Response, Router } from "express";
import {hash, genSaltSync, genSalt, compare} from "bcryptjs"
import { authMiddleware } from "../middlewares/authMiddleware";

class AuthController {
    public static async login_get(req: Request, res: Response): Promise<void> {
        return res.render("login");
    }

    public static async login_post(req: Request, res: Response): Promise<void> {
        let errors: string[] = [],
            successes: string[] = [];

        const {
            login,
            password
        } = req.body;

        console.log(req.body);

        if (!login) errors.push("Почта не указана");
        if (!password) errors.push("Пароль не указан");
        else {
            if (password.length < 8) errors.push("Пароль должен состоять из 8 символов");
            if (password.toLowerCase() === password) {
                console.log(password.toLowerCase(), password, password.toLowerCase() !== password);

                errors.push("В пароле должна содержатся одна заглавная буква");
            }
            if (!(password.split('').some((i: string) => '123456789!@#$%^&*():/.;[]'.includes(i)))) errors.push("Пароль должен содержать одну цифру или спец символ")
        }


        const candidateByEmail = await req.db.user.findUnique({where: {login: login}});

        if (!candidateByEmail) errors.push("Пользователь с такой почтой не существует");

        if (errors.length === 0 && candidateByEmail) {
            if (await compare(password, candidateByEmail.password)) {
                req.session.userId = candidateByEmail.id;

                return res.redirect("/")

            }
            else {
                errors.push("Не верный пароль")
            }
        }

        return res.render("login", {errors, sucesses: successes});
    }
}

const router = Router();

router.get("/login", AuthController.login_get);
router.post("/login", AuthController.login_post);
export default router;