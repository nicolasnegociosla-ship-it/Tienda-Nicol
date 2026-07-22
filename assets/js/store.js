/* ==========================================================================
   OBSIDIANA — Lógica de tienda (datos, carrito, WhatsApp, render)
   Vanilla JS. Sin build. Usa Supabase si está configurado; si no, el seed.
   ========================================================================== */

window.OBSIDIANA = (function () {
  var CFG = window.OBSIDIANA_CONFIG || {};
  var CART_KEY = "obsidiana_cart";
  var _supa = null;
  var _products = null;

  /* ---------- Supabase (opcional) ---------- */
  function supa() {
    if (_supa) return _supa;
    if (CFG.hasSupabase && window.supabase && window.supabase.createClient) {
      _supa = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    }
    return _supa;
  }

  /* ---------- Formato de dinero ---------- */
  function fmt(n) {
    try {
      return new Intl.NumberFormat(CFG.locale || "es-CL", {
        style: "currency", currency: CFG.currency || "CLP", maximumFractionDigits: 0
      }).format(n);
    } catch (e) { return "$" + Math.round(n).toLocaleString("es-CL"); }
  }

  /* ---------- Productos ---------- */
  function loadProducts() {
    if (_products) return Promise.resolve(_products);
    var client = supa();
    if (client) {
      return client.from("products").select("*").order("created_at", { ascending: false })
        .then(function (res) {
          if (res.error || !res.data || !res.data.length) {
            _products = (window.OBSIDIANA_SEED || []).slice();
          } else {
            _products = res.data.map(normalize);
          }
          return _products;
        })
        .catch(function () {
          _products = (window.OBSIDIANA_SEED || []).slice();
          return _products;
        });
    }
    _products = (window.OBSIDIANA_SEED || []).slice();
    return Promise.resolve(_products);
  }

  function normalize(p) {
    return {
      id: p.id, name: p.name, price: Number(p.price) || 0,
      category: p.category || "otros", collection: p.collection || "",
      is_new: !!p.is_new, accent: p.accent || "none",
      sizes: Array.isArray(p.sizes) ? p.sizes : (p.sizes ? String(p.sizes).split(",") : ["Única"]),
      description: p.description || "", image: p.image || ""
    };
  }

  function findProduct(id) {
    return (_products || []).filter(function (p) { return String(p.id) === String(id); })[0];
  }

  /* ---------- Carrito ---------- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); renderCartCount(); renderDrawer(); }
  function cartCount() { return getCart().reduce(function (s, i) { return s + i.qty; }, 0); }
  function cartTotal() { return getCart().reduce(function (s, i) { return s + i.price * i.qty; }, 0); }

  function addToCart(p, size, qty) {
    qty = qty || 1; size = size || (p.sizes && p.sizes[0]) || "Única";
    var cart = getCart();
    var key = p.id + "|" + size;
    var line = cart.filter(function (i) { return i.key === key; })[0];
    if (line) { line.qty += qty; }
    else {
      cart.push({ key: key, id: p.id, name: p.name, price: p.price, size: size,
        qty: qty, image: p.image || "", collection: p.collection || "" });
    }
    saveCart(cart);
    toast("Agregado al carrito");
    openCart();
  }
  function removeLine(key) { saveCart(getCart().filter(function (i) { return i.key !== key; })); }
  function changeQty(key, d) {
    var cart = getCart();
    cart.forEach(function (i) { if (i.key === key) i.qty = Math.max(1, i.qty + d); });
    saveCart(cart);
  }

  /* ---------- WhatsApp checkout ---------- */
  function checkout() {
    var cart = getCart();
    if (!cart.length) { toast("Tu carrito está vacío"); return; }
    var lines = cart.map(function (i) {
      return "• " + i.name + " (" + i.size + ") x" + i.qty + " — " + fmt(i.price * i.qty);
    }).join("\n");
    var msg = "Hola OBSIDIANA 🌙 quiero confirmar mi pedido:\n\n" + lines +
      "\n\nTotal: " + fmt(cartTotal()) + "\n\n¿Me confirman disponibilidad y envío?";
    var num = (CFG.whatsapp || "").replace(/[^0-9]/g, "");
    var url = "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  }

  /* ---------- UI: drawer + toast (se inyectan una vez) ---------- */
  function ensureUI() {
    if (document.getElementById("obs-drawer")) return;
    var el = document.createElement("div");
    el.innerHTML =
      '<div class="overlay" id="obs-overlay" onclick="OBSIDIANA.closeCart()"></div>' +
      '<aside class="drawer" id="obs-drawer" aria-label="Carrito">' +
        '<div class="drawer-head"><h3>Carrito</h3>' +
          '<button class="drawer-close" onclick="OBSIDIANA.closeCart()" aria-label="Cerrar">✕</button></div>' +
        '<div class="drawer-body" id="obs-cart-body"></div>' +
        '<div class="drawer-foot">' +
          '<div class="cart-total"><span class="l">Total</span><span class="v" id="obs-cart-total">$0</span></div>' +
          '<p class="cart-note">Al finalizar te llevamos a WhatsApp para coordinar pago y envío con la dueña.</p>' +
          '<button class="btn-wa" onclick="OBSIDIANA.checkout()">✆ Finalizar por WhatsApp</button>' +
        '</div>' +
      '</aside>' +
      '<nav class="mnav">' +
        '<a href="index.html"><i>⌂</i>Inicio</a>' +
        '<a href="catalogo.html"><i>❈</i>Catálogo</a>' +
        '<button onclick="OBSIDIANA.openCart()"><i>⛨</i>Carrito<span class="cart-count" data-cart-count style="display:none">0</span></button>' +
        '<a href="admin.html"><i>☾</i>Cuenta</a>' +
      '</nav>' +
      '<div class="toast" id="obs-toast"></div>';
    document.body.appendChild(el);
  }

  function openCart() { ensureUI(); renderDrawer(); document.getElementById("obs-overlay").classList.add("open"); document.getElementById("obs-drawer").classList.add("open"); }
  function closeCart() { document.getElementById("obs-overlay").classList.remove("open"); document.getElementById("obs-drawer").classList.remove("open"); }

  var _tmr;
  function toast(m) {
    ensureUI();
    var t = document.getElementById("obs-toast");
    t.textContent = m; t.classList.add("show");
    clearTimeout(_tmr); _tmr = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function renderCartCount() {
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      var n = cartCount(); el.textContent = n; el.style.display = n ? "flex" : "none";
    });
  }

  function thumb(i) {
    return i.image ? '<div class="cart-thumb"><img src="' + i.image + '" alt="' + esc(i.name) + '"></div>'
                   : '<div class="cart-thumb">' + esc(i.name) + '</div>';
  }

  function renderDrawer() {
    var body = document.getElementById("obs-cart-body");
    if (!body) return;
    var cart = getCart();
    if (!cart.length) { body.innerHTML = '<div class="cart-empty">Tu carrito está vacío.<br>La oscuridad espera.</div>'; }
    else {
      body.innerHTML = cart.map(function (i) {
        return '<div class="cart-line">' + thumb(i) +
          '<div class="cart-line-info">' +
            '<span class="n">' + esc(i.name) + '</span>' +
            '<span class="m">Talla ' + esc(i.size) + '</span>' +
            '<div class="qty">' +
              '<button onclick="OBSIDIANA.changeQty(\'' + i.key + '\',-1)">−</button>' +
              '<span>' + i.qty + '</span>' +
              '<button onclick="OBSIDIANA.changeQty(\'' + i.key + '\',1)">+</button>' +
            '</div>' +
            '<span class="p">' + fmt(i.price * i.qty) + '</span>' +
            '<button class="cart-remove" onclick="OBSIDIANA.removeLine(\'' + i.key + '\')">Quitar</button>' +
          '</div></div>';
      }).join("");
    }
    var tot = document.getElementById("obs-cart-total");
    if (tot) tot.textContent = fmt(cartTotal());
  }

  /* ---------- Render de productos ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function media(p) {
    var badge = "";
    if (p.is_new) {
      var cls = p.accent === "red" ? "badge-red" : p.accent === "purple" ? "badge-purple" : "badge-silver";
      badge = '<span class="badge ' + cls + '">' + esc(p.collection || "Nuevo") + '</span>';
    }
    var img = p.image ? '<img src="' + p.image + '" alt="' + esc(p.name) + '">'
                      : '<div class="card-ph">' + esc(p.name) + '</div>';
    return '<div class="card-media">' + badge +
      '<button class="wish" title="Favorito" onclick="event.stopPropagation()">♡</button>' + img + '</div>';
  }

  function cardHTML(p) {
    return '<article class="card" onclick="location.href=\'producto.html?id=' + encodeURIComponent(p.id) + '\'">' +
      media(p) +
      (p.collection ? '<div class="card-collection">' + esc(p.collection) + '</div>' : '') +
      '<div class="card-name">' + esc(p.name) + '</div>' +
      '<div class="card-price">' + fmt(p.price) + '</div>' +
      '<button class="card-add" onclick="event.stopPropagation();OBSIDIANA.quickAdd(\'' + esc(p.id) + '\')">Agregar al carrito</button>' +
      '</article>';
  }

  function quickAdd(id) { var p = findProduct(id); if (p) addToCart(p, (p.sizes && p.sizes[0]), 1); }

  function renderGrid(target, list) {
    var el = typeof target === "string" ? document.getElementById(target) : target;
    if (!el) return;
    if (!list.length) { el.innerHTML = '<div class="empty-state">No hay piezas en esta categoría… todavía.</div>'; return; }
    el.innerHTML = list.map(cardHTML).join("");
  }

  /* ---------- Init común ---------- */
  function init() { ensureUI(); renderCartCount(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    fmt: fmt, loadProducts: loadProducts, findProduct: findProduct,
    getCart: getCart, addToCart: addToCart, removeLine: removeLine, changeQty: changeQty,
    quickAdd: quickAdd, checkout: checkout,
    openCart: openCart, closeCart: closeCart, toast: toast,
    renderGrid: renderGrid, cardHTML: cardHTML, esc: esc, media: media
  };
})();
