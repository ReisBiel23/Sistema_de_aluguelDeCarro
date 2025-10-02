// Menu toggle para mobile
const menuToggle = document.getElementById("menuToggle")
const nav = document.querySelector(".nav")

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active")
  })
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})
