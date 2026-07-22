/* ==========================================================================
   OBSIDIANA — Catálogo de ejemplo (fallback)
   Se usa SOLO mientras Supabase no esté configurado, para que la tienda se
   vea completa desde el primer despliegue. Cuando conectes Supabase, los
   productos vienen de ahí y este archivo deja de usarse.

   Campos:
     id, name, price (número en CLP), category, collection,
     is_new (true = colección nueva), accent ('red' | 'purple' | 'none'),
     sizes (array), description, image (URL; vacío = placeholder elegante)
   ========================================================================== */

window.OBSIDIANA_SEED = [
  { id:"vestido-lunar", name:"Vestido Lunar", price:45000, category:"ropa", collection:"Eternal", is_new:false, accent:"none",
    sizes:["XS","S","M","L"], image:"",
    description:"Vestido largo de líneas fluidas en negro absoluto. Corte a la cintura y caída ceremonial. Una prenda para desaparecer con elegancia." },

  { id:"corset-eclipse", name:"Corset Eclipse", price:55000, category:"ropa", collection:"Eclipse", is_new:true, accent:"red",
    sizes:["XS","S","M","L","XL"], image:"",
    description:"Corset estructurado con cordón trasero y detalle en tono vino profundo. La pieza central de la colección Eclipse." },

  { id:"collar-noctis", name:"Collar Noctis", price:28000, category:"joyas", collection:"Eternal", is_new:false, accent:"none",
    sizes:["Única"], image:"",
    description:"Collar de cadena fina en plata envejecida con dije de luna creciente. Sutil de día, magnético de noche." },

  { id:"botas-umbra", name:"Botas Umbra", price:72000, category:"calzado", collection:"Umbra", is_new:true, accent:"purple",
    sizes:["35","36","37","38","39","40"], image:"",
    description:"Botas altas de cuero mate con hebillas laterales y suela track. Silueta imponente, comodidad real." },

  { id:"capa-obsidiana", name:"Capa Obsidiana", price:85000, category:"ropa", collection:"Eternal", is_new:false, accent:"none",
    sizes:["Única"], image:"",
    description:"Capa larga con capucha amplia y cierre oculto. Lana pesada, forro suave. Drama atemporal." },

  { id:"choker-ritual", name:"Choker Ritual", price:19000, category:"accesorios", collection:"Eternal", is_new:false, accent:"none",
    sizes:["Única"], image:"",
    description:"Choker de terciopelo con anilla metálica central. Minimalismo con actitud." },

  { id:"anillo-eclipse", name:"Anillo Eclipse", price:24000, category:"joyas", collection:"Eclipse", is_new:true, accent:"red",
    sizes:["6","7","8","9"], image:"",
    description:"Anillo sello con piedra granate engastada. Peso justo, presencia total." },

  { id:"blusa-sombra", name:"Blusa Sombra", price:38000, category:"ropa", collection:"Eternal", is_new:false, accent:"none",
    sizes:["XS","S","M","L"], image:"",
    description:"Blusa translúcida de manga larga con puños abotonados. Capa perfecta bajo corset o sola." },

  { id:"guantes-umbra", name:"Guantes Umbra", price:21000, category:"accesorios", collection:"Umbra", is_new:true, accent:"purple",
    sizes:["S","M","L"], image:"",
    description:"Guantes largos de encaje con acabado semimate en violeta profundo. El detalle que lo cambia todo." },

  { id:"pantalon-eterno", name:"Pantalón Eterno", price:47000, category:"ropa", collection:"Eternal", is_new:false, accent:"none",
    sizes:["XS","S","M","L","XL"], image:"",
    description:"Pantalón de tiro alto y pierna recta en gabardina negra. La base de todo guardarropa oscuro." },

  { id:"aros-luna", name:"Aros Luna", price:16000, category:"joyas", collection:"Eternal", is_new:false, accent:"none",
    sizes:["Única"], image:"",
    description:"Aros colgantes con media luna en plata. Livianos, hipoalergénicos, para todos los días." },

  { id:"borcegos-noche", name:"Borceguíes Noche", price:64000, category:"calzado", collection:"Eternal", is_new:false, accent:"none",
    sizes:["35","36","37","38","39","40","41"], image:"",
    description:"Borceguíes de cuero con acordonado completo y suela reforzada. Clásicos que nunca fallan." }
];
