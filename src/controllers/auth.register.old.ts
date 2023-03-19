public static async register_get(req: Request, res: Response): Promise<void> {
    return res.render("register");
}

public static async register_post(req: Request, res: Response): Promise<void> {
    let errors: string[] = [], 
        successes: string[] = [];

    const {
        fio,
        login,
        password,
        password2
    } = req.body;

    console.log(req.body);
    
    if (!fio) errors.push("ФИО не указано");
    if (!login) errors.push("Почта не указана");
    if (!password) errors.push("Пароль не указан");
    else {
        if (password2 && password !== password2) errors.push("Пароли не совпадают");
        if (password.length < 8) errors.push("Пароль должен состоять из 8 символов");
        if (password.toLowerCase() === password) {
            console.log(password.toLowerCase(), password, password.toLowerCase() !== password);
            
            errors.push("В пароле должна содержатся одна заглавная буква");
        }
        if (!(password.split('').some((i: string) => '123456789!@#$%^&*():/.;[]'.includes(i)))) errors.push("Пароль должен содержать одну цифру или спец символ")
    }
    if (!password2) errors.push("Повтор пароля не указан");
    
    const candidateByEmail = await req.db.user.findUnique({where: {login: login}});
    const candidateByFIO = await req.db.user.findUnique({where: {fio: fio}});

    if (candidateByEmail) errors.push("Пользователь с такой почтой уже существует");
    if (candidateByFIO) errors.push("Пользователь с таким ФИО уже существует");

    if (errors.length === 0) {
        const user = await req.db.user.create({
            data: {
                login: login,
                fio: fio,
                password: await hash(password, await genSalt(12))
            }
        });

        req.session.userId = user.id;

        return res.redirect("/")
    }

    return res.render("register", {errors, sucesses: successes});
}