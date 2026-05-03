/* ═══════ CART — localStorage ═══════ */
let cart = JSON.parse(localStorage.getItem("cartoleria_cart") || "[]");

function saveCart() {
  localStorage.setItem("cartoleria_cart", JSON.stringify(cart));
  updateBadge();
}

function updateBadge() {
  const b = document.getElementById("cart-badge");
  if (b) b.textContent = cart.length;
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  renderCart();
  showToast(name + " added to cart ✅");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total-price");
  if (!list) return;
  list.innerHTML = "";
  let total = 0;
  cart.forEach(function (item, index) {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML =
      "<span>" + item.name + " — ₹" + item.price + "</span>" +
      '<button onclick="removeFromCart(' + index + ')">✕</button>';
    list.appendChild(li);
  });
  if (totalEl) totalEl.textContent = "₹" + total;
}

function toggleCart() {
  var sidebar = document.getElementById("cart-sidebar");
  var overlay = document.getElementById("cart-overlay");
  if (sidebar) sidebar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty ❌");
    return;
  }
  var method = document.getElementById("delivery-method");
  var deliveryType = method ? method.value : "pickup";

  // Save order to history
  var orders = JSON.parse(localStorage.getItem("cartoleria_orders") || "[]");
  var total = cart.reduce(function (s, i) { return s + i.price; }, 0);
  if (deliveryType === "delivery") total += 50;
  orders.push({
    id: "ORD-" + Date.now(),
    items: cart.slice(),
    total: total,
    delivery: deliveryType,
    date: new Date().toLocaleString(),
    status: "Processing"
  });
  localStorage.setItem("cartoleria_orders", JSON.stringify(orders));

  showToast("Order placed! ✅ (" + (deliveryType === "delivery" ? "Home Delivery" : "Shop Pickup") + ")");
  cart = [];
  saveCart();
  renderCart();
  toggleCart();
}

/* ═══════ TOAST ═══════ */
function showToast(message) {
  var container = document.getElementById("toastContainer");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(function () { toast.classList.add("show"); }, 50);
  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () { toast.remove(); }, 400);
  }, 3000);
}

/* ═══════ MOBILE MENU ═══════ */
function toggleMenu() {
  var links = document.getElementById("navLinks");
  if (links) links.classList.toggle("active");
}

/* ═══════ NAVBAR SCROLL ═══════ */
window.addEventListener("scroll", function () {
  var nav = document.getElementById("navbar");
  if (nav) {
    if (window.scrollY > 50) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
});

/* ═══════ SCROLL REVEAL ═══════ */
function initReveal() {
  var cards = document.querySelectorAll(".reveal-card");
  if (!cards.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.getAttribute("data-delay") || "0");
        setTimeout(function () { entry.target.classList.add("visible"); }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(function (c) { observer.observe(c); });
}

/* ═══════ TYPEWRITER ═══════ */
function typewriter(el, text, speed) {
  var i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

/* ═══════ STAT COUNTER ═══════ */
function initCounters() {
  var stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var target = parseInt(entry.target.getAttribute("data-target"));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(function (s) { observer.observe(s); });
}

function animateCounter(el, target) {
  var current = 0;
  var step = Math.ceil(target / 60);
  var timer = setInterval(function () {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 30);
}

/* ═══════ PRODUCT FILTERS ═══════ */
function initFilters() {
  var filterBtns = document.querySelectorAll(".filter-btn");
  var products = document.querySelectorAll(".products-grid .product");
  
  if (!filterBtns.length || !products.length) return;

  filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      // Remove active class from all
      filterBtns.forEach(function(b) { b.classList.remove("active"); });
      // Add active to clicked
      this.classList.add("active");
      
      var filterValue = this.getAttribute("data-filter");
      
      products.forEach(function(product) {
        // First hide it to allow animation to re-trigger if needed
        product.style.display = "none";
        product.classList.remove("visible");
        
        if (filterValue === "all" || product.getAttribute("data-category") === filterValue) {
          product.style.display = "block";
          // Small delay to allow display:block to apply before animating opacity/transform
          setTimeout(function() {
            product.classList.add("visible");
          }, 50);
        }
      });
    });
  });
}

/* ═══════ CONTACT FORM ═══════ */
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Message sent! We'll get back to you ✉️");
  e.target.reset();
}

/* ═══════ ORDER HISTORY ═══════ */
function showOrderHistory() {
  var overlay = document.getElementById("order-modal-overlay");
  var list = document.getElementById("order-history-list");
  if (!overlay || !list) return;
  var orders = JSON.parse(localStorage.getItem("cartoleria_orders") || "[]");
  list.innerHTML = "";
  if (orders.length === 0) {
    list.innerHTML = '<p style="color:#888;font-size:13px">No orders yet.</p>';
  } else {
    orders.reverse().forEach(function (o) {
      var div = document.createElement("div");
      div.className = "order-item";
      var itemNames = o.items.map(function (i) { return i.name; }).join(", ");
      div.innerHTML = "<strong>" + o.id + " — " + o.date + "</strong>" +
        itemNames + "<br>Total: ₹" + o.total + " | " +
        (o.delivery === "delivery" ? "Home Delivery" : "Shop Pickup") +
        " | Status: " + o.status;
      list.appendChild(div);
    });
  }
  overlay.classList.add("active");
}

function closeOrderModal() {
  var overlay = document.getElementById("order-modal-overlay");
  if (overlay) overlay.classList.remove("active");
}

/* ═══════ THEME (dark / light) ═══════ */
function applyTheme(theme) {
  var isLight = theme === "light";
  document.body.classList.toggle("theme-light", isLight);
  try { localStorage.setItem("cartoleria_theme", isLight ? "light" : "dark"); } catch (e) {}

  var btns = document.querySelectorAll("#theme-toggle-btn");
  btns.forEach(function (b) {
    b.setAttribute("aria-pressed", isLight ? "true" : "false");
  });
}

function initTheme() {
  var saved = "dark";
  try { saved = localStorage.getItem("cartoleria_theme") || "dark"; } catch (e) {}
  applyTheme(saved);

  var btns = document.querySelectorAll("#theme-toggle-btn");
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var next = document.body.classList.contains("theme-light") ? "dark" : "light";
      applyTheme(next);
    });
  });
}

function initHeroLogo() {
  var hero = document.getElementById("hero-section");
  var logo = document.getElementById("hero-logo");
  if (!hero || !logo) return;
  var letters = logo.querySelectorAll(".hero-letter");
  if (!letters.length) return;

  var raf = 0;
  var lastX = 0;
  var lastY = 0;

  function reset() {
    letters.forEach(function (span) {
      span.style.setProperty("--s", "1");
      span.style.setProperty("--y", "0px");
    });
  }

  function applyAt(clientX, clientY) {
    letters.forEach(function (span) {
      var r = span.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var d = Math.hypot(clientX - cx, clientY - cy);
      var t = Math.max(0, 1 - d / 190);
      span.style.setProperty("--s", String(1 + t * 0.28));
      span.style.setProperty("--y", String(-t * 7) + "px");
    });
  }

  hero.addEventListener(
    "mousemove",
    function (e) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        raf = 0;
        applyAt(lastX, lastY);
      });
    },
    { passive: true }
  );
  hero.addEventListener("mouseleave", function () {
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    reset();
  });
}

/* ═══════ INIT ═══════ */
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initHeroLogo();
  updateBadge();
  renderCart();
  initReveal();
  initCounters();
  initFilters();

  var tw = document.getElementById("typewriter");
  if (tw) {
    // We handle the text directly in HTML now, so no need for typewriter on the main text 
    // unless we want it. The user said: "i want like Welcome to CARTOLERIA — where everyday... this and sm cool animations"
    // Let's type it out!
    var textToType = "Welcome to CARTOLERIA — where everyday quality stationery meets next-gen printing where you pick up at your stop.";
    tw.textContent = "";
    typewriter(tw, textToType, 40);
  }
});