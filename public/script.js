// Dark Mode Toggle
const toggleButton = document.querySelector('#toggleButton');
const body = document.body;

toggleButton.addEventListener('click', () => {
  toggleButton.classList.toggle('active');
  toggleButton.innerHTML = toggleButton.classList.contains('active')
    ? '<i class="fa-regular fa-sun text-sun"></i>'
    : '<i class="fa-solid fa-moon text-dark"></i>';
  body.classList.toggle('dark-mode');
});
