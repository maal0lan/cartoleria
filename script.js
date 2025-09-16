function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}



let cart = [];
function addToCart(name, price) {
  showToast(`${name} added to cart ✅`);
  cart.push({ name, price });
  renderCart();
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function renderCart() {
  const list = document.getElementById("cart-items");
  list.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ₹${item.price} 
      <button onclick="removeFromCart(${index})">x</button>`;
    list.appendChild(li);
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("active");
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty ❌");
    return;
  }
  showToast("Order placed successfully! ✅ (Cash on Delivery)");
  cart = [];
  renderCart();
  toggleCart();
}