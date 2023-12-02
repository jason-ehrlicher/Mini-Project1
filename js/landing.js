// Modal

// Modal Open
document
  .getElementById("signup-link")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector(".login-modal").style.display = "flex";
  });

// Modal Close
document.querySelector(".modal-close").addEventListener("click", function () {
  document.querySelector(".login-modal").style.display = "none";
});
