// Sidebar Toggle

let sidebarOpen = false;
let sidebar = document.getElementById("sidebar");

// Sidebar Open
function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add("sidebar-responsive");
    sidebarOpen = true;
  }
}

// Sidebar Close
function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove("sidebar-responsive");
    sidebarOpen = false;
  }
}

// Modal

// Modal Open 
document.getElementById("signup-link").addEventListener('click', function(event) {
  event.preventDefault();
document.querySelector(".login-modal").style.display = 'flex';
})

// Modal Close
document.querySelector('.modal-close').addEventListener('click',
function() {
  document.querySelector('.login-modal').style.display = 'none'
});