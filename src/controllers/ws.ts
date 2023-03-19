import { Media, PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { Server, Socket } from "socket.io";
let chats: Record<number, Socket[]> = {

}

let users: Record<string, number> = {

}
export const ws = (server: Server, db: PrismaClient) => {
    server.on("connection", (sck) => {
        console.log("New user connected");
        sck.on("setChat", ({ chatId }) => {
            console.log("kavy");

            // @ts-ignore
            sck.request.session.chatId = +chatId;
            if (!chats[+chatId]) chats[+chatId] = [];
            chats[+chatId].push(sck);

            // @ts-ignore
            console.log("я убил негра", sck.request.user)

            // @ts-ignore // типы потом сделаю если время
            users[sck.id] = sck.request.user.id

            sck.emit("setChat", {
                // @ts-ignore
                user: sck.request.user
            })
        })

        sck.on("newMessage", async ({ text, files }) => {
            let medias: Media[] = [];
            await Promise.all(files.map(async (file: { fileName: string, buffer: Buffer }) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                const uid = file.fileName
                    + '-' +
                    uniqueSuffix +
                    file.fileName.split(".")[file.fileName.split(".").length - 1];
                await writeFile(
                    "./media/" + uid, file.buffer);

                const media = await db.media.create({
                    data: {
                        uid: uid
                    }
                })

                medias.push(media);
            }));

            // @ts-ignore
            if (sck.request.user.level === "l2") medias = []

            let msg = await db.message.create({
                data: {
                    text,
                    // @ts-ignore
                    chatId: +sck.request.session.chatId,
                    userId: users[sck.id],
                },
                include: {
                    chat: true,
                    user: true
                }
            })
            let msg2 = await db.message.update({
                where: {
                    id: msg.id
                },
                data: {
                    media: {
                        set: medias
                    }
                },
                include: {
                    chat: true,
                    media: true,
                    user: true
                }
            })
            // @ts-ignore
            chats[+sck.request.session.chatId].forEach(x => {
                x.emit("newMessage", msg2)
            })
        })
    })
}