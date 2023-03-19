import express from "express";
import { create } from "express-handlebars";
import { registerHelper } from "handlebars"
import cookieParser from "cookie-parser";
import session from "express-session";
import authController from "./controllers/auth";
import mainController from "./controllers/main";
import chatController from "./controllers/chat";
import { PrismaClient } from "@prisma/client";
import { ws } from "./controllers/ws";
import { createServer } from "https";
import { Server } from "socket.io"
import { authMiddleware, sIOauthMiddleware } from "./middlewares/authMiddleware";
import cors from "cors";
import fs from "fs";

var privateKey = fs.readFileSync( "/etc/letsencrypt/live/oink.ban.su/privkey.pem" );
var certificate = fs.readFileSync( "/etc/letsencrypt/live/oink.ban.su/fullchain.pem" );

const app = express();
const server = createServer({
    key: privateKey,
    cert: certificate
}, app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8 / 5,
    cors: {
        credentials: true,
        origin: ["*"]
    }
});
const hbs = create({
    extname: ".handlebars"
});


const db = new PrismaClient();

const sess = session({
    secret: "SECRET",
    resave: false,
  saveUninitialized: false
})

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['*'],
    methods: ['GET','POST'],
    credentials: true // enable set cookie
}));
app.use(sess);
app.use((req, res, next) => {
    req.db = db;
    res.header("X-Content-Type-Options", "nosniff")
    next();
})
app.use("/static/", express.static("static/"))
app.use("/assets/", express.static("assets/"))
app.use("/media/", express.static("media/"))

app.use('/', authController);
app.use('/', mainController);
app.use('/', chatController);

io.use((socket, next) => {
    // @ts-ignore
    socket.db = db;
    next();
})

// @ts-ignore // тайпскрипт жалуется из-за кастомного типа req, res
io.engine.use(sess);

// @ts-ignore
io.engine.use(sIOauthMiddleware(db))
async function main() {
    await db.$connect();
    ws(io, db);
    server.listen(443, () => {
        console.log('listening on :443')
    })
}
main();

