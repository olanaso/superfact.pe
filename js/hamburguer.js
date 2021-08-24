const hamburger_container = document.querySelector(".hamburger_container")
const menu_close = document.querySelector(".menu_close")
const menu_container = document.querySelector(".menu_container")
const menu_container_active = document.querySelector(".menu_container_active")

hamburger_container.addEventListener("click", () =>{
    menu_container.classList.toggle("menu_container_active")
})

menu_close.addEventListener("click", () =>{
    menu_container.classList.remove("menu_container_active")
})