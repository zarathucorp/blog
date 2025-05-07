document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  let index = 0;
  const totalSlides = slides.length;

  function showSlide(i) {
    track.style.transform = `translateX(-${i * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % totalSlides;
    showSlide(index);
  }

  setInterval(nextSlide, 5000); // Change slide every 5 seconds
});
