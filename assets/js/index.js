let footer = document.querySelector(`#footer`)
let banFooter = document.querySelector(`#ban-footer`)

banFooter.addEventListener(`click`, function(){
    footer.classList.add(`d-none`)
})