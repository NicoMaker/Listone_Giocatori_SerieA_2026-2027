// ============================================================
//  TOAST — notifiche a comparsa
// ============================================================

// ============================================================
//  TOAST
// ============================================================
function showToast(message, icon = "fa-check-circle") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("show"), 3000);
}

