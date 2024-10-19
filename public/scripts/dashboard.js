const nav = document.querySelector(".nav-links");
const burger = document.querySelector(".burger");
const links = nav.querySelectorAll("a");
const overlay = document.querySelector(".overlay");

burger.addEventListener("click", (e) => {
  overlay.style.display = "block";
  nav.style.display = "flex";
});

overlay.addEventListener("click", closeModal);

function closeModal() {
  overlay.style.display = "none";
  nav.style.display = "none";
}

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    const item = e.target.parentElement.parentElement;
    if (item.id == "nav-links") {
      closeModal();
    } else {
      overlay.style.display = "block";
      nav.style.display = "flex";
    }
  });
});

$(document).ready(() => {
  $("#testimonial .cards").slick({
    dots: true,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
  });
});

var rule = CSSRulePlugin.getRule("span:after");
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.from(".anime1", { y: -50, stagger: 0.6, opacity: 0 }).to(
  "rule",
  { duration: 1.8, cssRule: { scaleY: 0 } },
  "+=2.2"
);