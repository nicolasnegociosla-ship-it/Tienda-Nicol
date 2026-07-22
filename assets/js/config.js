/* ==========================================================================
   OBSIDIANA — Configuración
   Edita SOLO este archivo para conectar WhatsApp y Supabase.
   ========================================================================== */

window.OBSIDIANA_CONFIG = {

  /* --- WhatsApp de la dueña ---
     Formato internacional SIN + ni espacios. Chile = 56 + número.
     Ej: +56 9 1234 5678  ->  "56912345678"                                   */
  whatsapp: "56963841888",

  /* --- Supabase (gratis) ---
     Cuando crees tu proyecto en supabase.com, pega aquí la URL y la anon key
     (Project Settings -> API). Mientras estén vacías, la tienda usa el
     catálogo de ejemplo (seed) para que igual se vea todo funcionando.       */
  supabaseUrl: "",
  supabaseAnonKey: "",

  /* Moneda / país */
  currency: "CLP",
  locale: "es-CL",

  /* Marca */
  brand: "OBSIDIANA",
  slogan: "Haz relucir tu oscuridad"
};

/* ¿Supabase configurado? */
window.OBSIDIANA_CONFIG.hasSupabase =
  !!(window.OBSIDIANA_CONFIG.supabaseUrl && window.OBSIDIANA_CONFIG.supabaseAnonKey);
