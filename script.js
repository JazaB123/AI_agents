document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebarNav = document.querySelector(".sidebar nav");

  if (hamburger && sidebarNav) {
    hamburger.addEventListener("click", () => {
      console.log("Hamburger clicked!"); // debug helper
      sidebarNav.classList.toggle("show");
    });
  }
});