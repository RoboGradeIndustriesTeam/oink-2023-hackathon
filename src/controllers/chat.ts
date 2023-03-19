import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ELevel, levelToLA, levelToLI } from "../dtos";
import { Chat, Media, Message, Otdel, User } from "@prisma/client";

class chatController {
    public static async chatsMain(req: Request, res: Response) {
        if (!req.user) return res.render('fbdn')
        let userChats = await req.db.chat.findFirst({
            where: {

                OR: [
                    {
                        otdel: {
                            id: req.user.otdelId
                        },
                    },
                    {
                        user1: {
                            id: req.user.id
                        }
                    },
                    {
                        user2: {
                            id: req.user.id
                        }
                    }

                ]
            },
            include: {
                otdel: true,
                Message: {
                    where: {

                    }
                },
                avatar: true,
                user1: true,
                user2: true
            }
        })
        if (!userChats) return res.render('fbdn')
        return res.redirect(`/chat/${userChats.id}`)
    }

    public static async chat(req: Request, res: Response) {
        if (!req.user) return res.render('fbdn')
        const chatId = parseInt(req.params.id);

        if (isNaN(chatId)) {
            return res.render('fbdn')
        }
        let chatCandidate: Chat & any | null = null;
        if (chatId < 100000) {
            chatCandidate = await req.db.chat.findFirst({
                where: {
                    id: chatId
                },
                include: {
                    Message: {
                        where: {}
                    },
                    avatar: true,
                    otdel: true,
                    user1: true,
                    user2: true,

                }
            });
            console.log(chatCandidate);

            if (!chatCandidate) return res.render('fbdn')
            if (chatCandidate.type === "otdel-chat" && chatCandidate.otdelId !== req.user.otdelId) return res.render('fbdn')
        }
        else {
            let user2Id = chatId - 100000;
            const cc = await req.db.chat.findFirst({
                where: {
                    id: chatId
                }
            })
            if (!cc) {
                const userC = await req.db.user.findFirst({
                    where: {
                        id: user2Id
                    }
                });

                console.log(1);
                if (!userC) return res.render('fbdn');
                console.log(11);
                if (levelToLI(userC.level as ELevel) > levelToLI(req.user.level as ELevel)) return res.render('fbdn');
                console.log(1121);

                if (userC.otdelId != req.user.otdelId) return res.render('fbdn');

                const cChat = await req.db.chat.create({
                    data: {
                        id: chatId,

                        name: userC.fio,
                        desc: "",
                        type: "p2p",
                        mediaUid: (await req.db.media.findFirst())?.uid ?? "",
                        userId1: req.user.id,
                        userId2: user2Id
                    }
                })
                chatCandidate = cChat;
            }
            else {
                chatCandidate = cc;
                chatCandidate.name = (await req.db.user.findFirst({where: {id: cc.userId2 ?? 1}}))
            }

        }

        console.dir({
            chat: chatCandidate,
            user: req.user,
            u1id_eq_uid: chatCandidate.userId1 === req.user.id,
            u2id_eq_uid: chatCandidate.userId2 === req.user.id
        })

        //if (chatCandidate.type === "p2p" && (chatCandidate.userId1 !== req.user.id && chatCandidate.userId2 !== req.user.id)) return res.render('fbdn')
        const messages = await req.db.message.findMany({
            where: {
                chat: {
                    id: chatCandidate.id
                }
            },
            include: {
                chat: true,
                user: true,
                media: true
            }
        })
        console.log(messages);
        if (!req.user) return res.render('fbdn')

        const chatssss = (await req.db.chat.findMany({
            where: {

                OR: [
                    {
                        otdel: {
                            id: req.user.otdelId
                        },
                    },
                    {
                        user1: {
                            id: req.user.id
                        }
                    },
                    {
                        user2: {
                            id: req.user.id
                        }
                    }

                ]
            },
            include: {
                otdel: true,
                Message: {
                    where: {

                    }
                },
                avatar: true,
                user1: true,
                user2: true
            }
        })).map(i => {
            if (!req.user) return res.render('fbdn')

            if (i.type === "p2p") {
                if (req.user.id === i.userId1) {
                    return {
                        ...i, name: i.user2?.fio, avatar: {
                            ...i.avatar,
                            uid: i.user2?.mediaUid
                        }, mediaUid: i.user2?.mediaUid
                    }
                }
                else {
                    return {
                        ...i, name: i.user1?.fio, avatar: {
                            ...i.avatar,
                            uid: i.user1?.mediaUid
                        }, mediaUid: i.user1?.mediaUid
                    }
                }
            }
            return i
        });


        const users = await req.db.user.findMany({
            where: {
                otdelId: req.user.otdelId,
                level: {
                    in: levelToLA(req.user.level as ELevel)
                }
            }
        });
        console.log("zalupa", users, levelToLA(req.user.level as ELevel));


        const cChats: (Chat & { avatar: Media, user1: User | null, user2: User, Message: any[] })[] = [];

        await Promise.all(users.map(async i => {
            if (req.user === null) return res.render("fbdn")

            if (!(await req.db.chat.findFirst({
                where: {
                    OR: [
                        {
                            userId1: req.user.id,
                            userId2: i.id
                        },
                        {
                            userId2: req.user.id,
                            userId1: i.id
                        }
                    ]
                }
            })))
                cChats.push({
                    id: 100000 + i.id,
                    avatar: {
                        uid: i.mediaUid ?? ""
                    },
                    desc: "",
                    mediaUid: i.mediaUid ?? "",
                    userId1: req.user?.id ?? 0,
                    userId2: i.id,
                    user1: req.user ?? null,
                    user2: i,
                    name: i.fio,
                    type: "p2p",
                    otdelId: i.otdelId,
                    userId: null,
                    Message: []
                })
        }))



        return res.render("chat", {
            chats: [],
            chat: {
                ...chatCandidate,
                name:
                    chatCandidate.type === "p2p" ?
                        chatCandidate.userId1 === req.user.id ? chatCandidate.user2?.fio : chatCandidate.user1?.fio
                        : chatCandidate.name,
                title: chatCandidate.type === "p2p" ? `Диалог с ` : `Чат `,
                avatar: {
                    ...chatCandidate.avatar,
                    uid:
                        chatCandidate.type === "p2p" ?
                            chatCandidate.userId1 === req.user.id ? chatCandidate.user1?.mediaUid : chatCandidate.user2?.mediaUid
                            : chatCandidate.mediaUid,
                }

            },
            chatsJSON: encodeURIComponent(JSON.stringify(messages)),
            chatsSJSON: encodeURIComponent(JSON.stringify([...chatssss, ...cChats])),
        })
    }


}

const r = Router();

r.get("/chats", authMiddleware, chatController.chatsMain)
r.get("/chat/:id", authMiddleware, chatController.chat)

export default r;