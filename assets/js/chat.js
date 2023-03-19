const messages = document.querySelector(`.msg`);


function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

document.addEventListener(`DOMContentLoaded`, scrollToBottom)