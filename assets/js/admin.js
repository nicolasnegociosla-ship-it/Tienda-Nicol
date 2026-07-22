/* ==========================================================================
   OBSIDIANA — Panel de administración
   Login + subir foto / precio / descripción. Todo desde el navegador.
   Requiere Supabase configurado en assets/js/config.js
   ========================================================================== */

(function () {
  var CFG = window.OBSIDIANA_CONFIG || {};
  var BUCKET = "product-images";
  var supa = null;
  var editing = null; // id que se está editando, o null (nuevo)

  function $(id) { return document.getElementById(id); }
  function fmt(n) { try { return new Intl.NumberFormat(CFG.locale||"es-CL",{style:"currency",currency:CFG.currency||"CLP",maximumFractionDigits:0}).format(n); } catch(e){ return "$"+n; } }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }

  /* ---------- Init ---------- */
  function init() {
    if (!CFG.hasSupabase) { showSetupNeeded(); return; }
    if (!window.supabase) { showError("No se pudo cargar Supabase. Revisa tu conexión."); return; }
    supa = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    supa.auth.getSession().then(function (res) {
      if (res.data && res.data.session) showDashboard();
      else showLogin();
    });
  }

  /* ---------- Vistas ---------- */
  function hideAll() { ["view-setup","view-login","view-dashboard"].forEach(function(v){ if($(v)) $(v).classList.add("hidden"); }); }

  function showSetupNeeded() {
    hideAll(); $("view-setup").classList.remove("hidden");
  }
  function showError(msg) { showSetupNeeded(); var e=$("setup-extra"); if(e) e.textContent = msg; }

  function showLogin() {
    hideAll(); $("view-login").classList.remove("hidden");
  }

  function login() {
    var email = $("login-email").value.trim();
    var pass = $("login-pass").value;
    var btn = $("login-btn"); btn.textContent = "Ingresando…"; btn.disabled = true;
    supa.auth.signInWithPassword({ email: email, password: pass }).then(function (res) {
      btn.textContent = "Ingresar"; btn.disabled = false;
      if (res.error) { $("login-error").textContent = "Correo o contraseña incorrectos."; return; }
      showDashboard();
    });
  }

  function logout() { supa.auth.signOut().then(showLogin); }

  function showDashboard() { hideAll(); $("view-dashboard").classList.remove("hidden"); loadList(); }

  /* ---------- Productos ---------- */
  function loadList() {
    var wrap = $("admin-list");
    wrap.innerHTML = '<div class="a-empty">Cargando…</div>';
    supa.from("products").select("*").order("created_at",{ascending:false}).then(function (res) {
      if (res.error) { wrap.innerHTML = '<div class="a-empty">Error al cargar: '+esc(res.error.message)+'</div>'; return; }
      var list = res.data || [];
      $("admin-count").textContent = list.length + " producto" + (list.length===1?"":"s");
      if (!list.length) { wrap.innerHTML = '<div class="a-empty">Aún no hay productos. Toca “+ Nuevo producto”.</div>'; return; }
      wrap.innerHTML = list.map(rowHTML).join("");
    });
  }

  function rowHTML(p) {
    var img = p.image ? '<img src="'+esc(p.image)+'" alt="">' : '<span>sin foto</span>';
    var tag = p.is_new ? '<span class="a-badge a-'+(p.accent||'silver')+'">'+esc(p.collection||'Nuevo')+'</span>' : '';
    return '<div class="a-row">' +
      '<div class="a-thumb">'+img+'</div>' +
      '<div class="a-info"><div class="a-name">'+esc(p.name)+' '+tag+'</div>' +
        '<div class="a-meta">'+esc(p.category||'')+' · '+fmt(p.price)+'</div></div>' +
      '<div class="a-actions">' +
        '<button class="a-btn" onclick="ADMIN.edit(\''+esc(p.id)+'\')">Editar</button>' +
        '<button class="a-btn a-danger" onclick="ADMIN.remove(\''+esc(p.id)+'\')">Eliminar</button>' +
      '</div></div>';
  }

  function openForm() { $("form-modal").classList.add("open"); }
  function closeForm() { $("form-modal").classList.remove("open"); }

  function newProduct() {
    editing = null;
    $("form-title").textContent = "Nuevo producto";
    ["f-name","f-price","f-collection","f-sizes","f-desc"].forEach(function(i){ $(i).value=""; });
    $("f-category").value = "ropa"; $("f-accent").value = "none"; $("f-new").checked = false;
    $("f-image").value = ""; $("f-image-url").value = "";
    $("f-preview").style.backgroundImage = ""; $("f-preview").classList.add("empty");
    openForm();
  }

  function edit(id) {
    supa.from("products").select("*").eq("id",id).single().then(function (res) {
      if (res.error) return;
      var p = res.data; editing = id;
      $("form-title").textContent = "Editar producto";
      $("f-name").value = p.name||""; $("f-price").value = p.price||"";
      $("f-category").value = p.category||"ropa"; $("f-collection").value = p.collection||"";
      $("f-accent").value = p.accent||"none"; $("f-new").checked = !!p.is_new;
      $("f-sizes").value = Array.isArray(p.sizes)?p.sizes.join(", "):(p.sizes||"");
      $("f-desc").value = p.description||"";
      $("f-image-url").value = p.image||"";
      if (p.image){ $("f-preview").style.backgroundImage = "url("+p.image+")"; $("f-preview").classList.remove("empty"); }
      else { $("f-preview").style.backgroundImage=""; $("f-preview").classList.add("empty"); }
      openForm();
    });
  }

  function onImagePick(input) {
    var file = input.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e){ $("f-preview").style.backgroundImage = "url("+e.target.result+")"; $("f-preview").classList.remove("empty"); };
    reader.readAsDataURL(file);
  }

  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,40) || ("p-"+Date.now());
  }

  function save() {
    var name = $("f-name").value.trim();
    var price = parseInt($("f-price").value, 10);
    if (!name) { alert("Ponle un nombre al producto."); return; }
    if (!price || price < 0) { alert("Ingresa un precio válido."); return; }

    var btn = $("save-btn"); btn.textContent = "Guardando…"; btn.disabled = true;

    var record = {
      name: name, price: price,
      category: $("f-category").value,
      collection: $("f-collection").value.trim(),
      accent: $("f-accent").value,
      is_new: $("f-new").checked,
      sizes: $("f-sizes").value.split(",").map(function(s){return s.trim();}).filter(Boolean),
      description: $("f-desc").value.trim(),
      image: $("f-image-url").value
    };

    var file = $("f-image").files[0];
    var step = file ? uploadImage(file).then(function(url){ record.image = url; }) : Promise.resolve();

    step.then(function () {
      if (editing) {
        return supa.from("products").update(record).eq("id", editing);
      } else {
        record.id = slug(name) + "-" + Math.random().toString(36).slice(2,6);
        return supa.from("products").insert(record);
      }
    }).then(function (res) {
      btn.textContent = "Guardar producto"; btn.disabled = false;
      if (res && res.error) { alert("Error al guardar: " + res.error.message); return; }
      closeForm(); loadList();
    }).catch(function (e) {
      btn.textContent = "Guardar producto"; btn.disabled = false;
      alert("Error: " + (e.message || e));
    });
  }

  function uploadImage(file) {
    var ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    var path = "productos/" + Date.now() + "-" + Math.random().toString(36).slice(2,7) + "." + ext;
    return supa.storage.from(BUCKET).upload(path, file, { upsert: true, cacheControl: "3600" })
      .then(function (res) {
        if (res.error) throw res.error;
        return supa.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      });
  }

  function remove(id) {
    if (!confirm("¿Eliminar este producto? No se puede deshacer.")) return;
    supa.from("products").delete().eq("id", id).then(function (res) {
      if (res.error) { alert("Error: " + res.error.message); return; }
      loadList();
    });
  }

  window.ADMIN = {
    login: login, logout: logout, newProduct: newProduct, edit: edit,
    save: save, remove: remove, closeForm: closeForm, onImagePick: onImagePick
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
