const newMessageButton = document.querySelector("#sendBtn");
const newMessageText = document.querySelector("#textMsg");
const newMessageMedia = document.querySelector("#upload-file");
const newMessageMediaBtn = document.querySelector("#newMessageMediaBtn");
const newMessageMount = document.querySelector("#msgMount");
const newChatsMount = document.querySelector("#chatMount");
const newChatsMount2 = document.querySelector("#chatMount2");
const fileListMount = document.querySelector("#mountfilelist");
const thisChatMount = document.querySelector("#thisChatMountImg")
const thisChatMountName = document.querySelector("#thisChatMountName");
const sck = io("/", {
    withCredentials: true,
    transports: ["websocket"],
});

newMessageMedia.value = "";

if (!/safari/i.test(navigator.userAgent)) {
    newMessageMedia.type = "";
    newMessageMedia.type = "file";
}

sck.on("error", console.log);

window.onvideoerror = (target, uid) => {
    console.log("video error", target, uid);
    const media = { uid };
    target.outerHTML = `В вашем бразуере воспроизведение данного файла не поддерживается, <a href="/media/${media.uid
        }" download="${media.uid
            .split("-")
            .slice(0, media.uid.split("-").length - 2)}">скачать видео</a>`;
};

const renderMsg = (msg) => {
    // newMessageMount.innerHTML += `<li>${msg.user.fio}: ${msg.text}\n${moment(msg.createdAt).format('lll')} `;
    // console.log(msg.media);

    // newMessageMount.innerHTML += `</li>`;
    /*
    <div class="msg">
        <div class="card chat-msg">
            <div class="card-body">
                <h5 class="card-title">Сообщение</h5>
                <p class="mb-0 chat-msg-time">ДД, ММ, ГГГГ&nbsp;ЧЧ:ММ</p>
            </div>
        </div>
    </div>
    <div class="text-end d-xl-flex justify-content-xl-end msg">
        <div class="card chat-msg-mslf">
            <div class="card-body"><a href="#">
                    <h5><i class="far fa-file"></i>&nbsp;document.docx</h5>
                </a>
                <p class="mb-0 chat-msg-time">ДД, ММ, ГГГГ&nbsp;ЧЧ:ММ</p>
            </div>
        </div>
    </div>
        */
    console.log(msg);
    let m = ``;

    msg.media.forEach((media) => {
        m += `<div style="display: flex; flex-direction: column; margin-bottom: 20px; border-radius: 15px">`;
        if (media.uid.includes(".jpg")) m += `<img src="/media/${media.uid}">`;
        else if (media.uid.includes(".png")) m += `<img src="/media/${media.uid}">`;
        else if (media.uid.includes(".mp4") || media.uid.includes(".mkv")) {
            m += `<video width="320" height="240" controls src="/media/${media.uid
                }" onerror="window.onvideoerror(this, '${media.uid}')">
                В вашем бразуере воспроизведение .mkv файлов не поддерживается, <a href="/media/${media.uid
                }" download="${media.uid
                    .split("-")
                    .slice(0, media.uid.split("-").length - 2)}">скачать видео</a>
                </video>`;
        } else {
            m += `икока файла ${media.uid
                .split("-")
                .slice(0, media.uid.split("-").length - 2)}`;
        }
        m += `<a href="/media/${media.uid}" download="${media.uid
            .split("-")
            .slice(0, media.uid.split("-").length - 2)}">${media.uid
                .split("-")
                .slice(0, media.uid.split("-").length - 2)}</a>`;

        m += `</div>`;
    });

    if (msg.userId === currentUser.id) {
        newMessageMount.innerHTML += `<div class="text-end d-xl-flex justify-content-xl-end msg">
        <div class="card chat-msg-mslf">
            <div class="card-body">
                <span>
                    ${m}
                </span>
                <h5>${msg.text}</h5>
                <p class="mb-0 chat-msg-time">${moment(msg.createdAt).format(
            "lll"
        )}</p>
            </div>
        </div>
    </div>`;
    } else {
        newMessageMount.innerHTML += `<div class="msg">
        <div class="card chat-msg">
            <div class="card-body">
                ${m}
                <h6>${msg.user.fio}: </h6>
                <h5 class="card-title">${msg.text}</h5>
                <p class="mb-0 chat-msg-time">${moment(msg.createdAt).format(
            "lll"
        )}</p>
            </div>
        </div>
    </div>`;
    }
    setTimeout(
        () =>
            newMessageMount.scroll({
                top: newMessageMount.scrollHeight,
                behavior: "smooth",
            }),
        700
    );
};
const renderChat = (chat) => {
    console.log(chat);
    if (chat.id === window.currentChatId) {
        thisChatMount.src = `/media/${chat.type === "p2p" ? chat.user1Id === window.currentUser.id ? chat.user2.mediaUid : chat.user2.mediaUid : chat.avatar.uid
            }`
        thisChatMountName.innerHTML = chat.name
        thisChatMountName.addEventListener("click", () => window.location.href = chat.type === "p2p" ?
            chat.user1Id === window.currentUser.id ?
                `/profile/${chat.user1.id}` :
                `/profile/${chat.user2.id}` : window.location.href
        )
    }
    newChatsMount.innerHTML += ` <div class="card chat-list-card" style="${chat.id === window.currentChatId ? 'background: lightblue' : ""}" onclick="window.location.href = '/chat/${chat.id
        }';">
    <div class="card-body row">
        <div class="col-2"><img class="rounded-circle" src="/media/${chat.type === "p2p" ? chat.user1Id === window.currentUser.id ? chat.user2.mediaUid : chat.user2.mediaUid : chat.avatar.uid
        }" width="50"
                height="50"></div>
        <div class="col-10">
            <h5>${chat.name}</h5>
            <p class="mb-0 chat-msglist-short-msg">${(
            chat.Message[chat.Message.length - 1] ?? {
                text: `Это начало чата "${chat.name}"`,
            }
        ).text
        }
        </div>
    </div>
</div>`;
newChatsMount2.innerHTML = newChatsMount.innerHTML;

};
sck.emit("setChat", {
    chatId: +window.location.toString().split("/").reverse()[0],
});
sck.on("setChat", ({ user }) => {
    console.log("logged in as", user);
    window.currentUser = user;

    if (user.level === "l2") {
        newMessageMedia.style = "display: none"
        newMessageMediaBtn.style = "display: none"
    }
    JSON.parse(decodeURIComponent(window.baseChats)).map(renderChat);

    JSON.parse(decodeURIComponent(window.baseMessages)).map(renderMsg);
});
const send = async () => {
    console.log("в жопу долбится");
    console.log(newMessageText.value);

    sck.emit("newMessage", {
        text: newMessageText.value,
        files: Array.from(newMessageMedia.files).map((el) => ({
            buffer: el,
            fileName: el.name,
        })),
    });
    newMessageText.value = "";
    newMessageMedia.value = "";

    if (!/safari/i.test(navigator.userAgent)) {
        newMessageMedia.type = "";
        newMessageMedia.type = "file";
    }
    rerendermedia();
};
newMessageButton.addEventListener("click", send);
newMessageText.addEventListener("keydown", (ev) => {
    if (ev.keyCode === 13) send();
});
sck.on("newMessage", (msg) => {
    renderMsg(msg);
});

const rerendermedia = () => {
    fileListMount.innerHTML = Array.from(newMessageMedia.files)
        .map(
            (file) => `
                    <li class="list-group-item" style="display: flex; flex-direction: row">
                        <div style="justify-content: flex-start; width: 100%">
                            <p>${file.name}</p>
                        </div>
                        <div style="justify-content: end; width: 100%; text-align: right;">
                        <button class="btn" onclick="removeFile('${file.name}')"><i class="fa-regular fa-circle-xmark"></i></button>
                        </div>

                    </li>
                    `
        )
        .join("");
};

const removeFile = (file) => {
    var attachments = newMessageMedia.files; // <-- reference your file input here
    var fileBuffer = new DataTransfer();

    for (let i = 0; i < attachments.length; i++) {
        if (
            i !==
            Array.from(newMessageMedia.files)
                .map((i) => i.name)
                .indexOf(file)
        )
            fileBuffer.items.add(attachments[i]);
    }

    newMessageMedia.files = fileBuffer.files; // <-- according to your file input reference
    rerendermedia();
};

newMessageMedia.addEventListener("change", rerendermedia);
