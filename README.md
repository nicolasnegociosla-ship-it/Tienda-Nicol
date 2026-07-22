# 🌙 OBSIDIANA

Tienda online de moda oscura atemporal. Sitio estático (HTML/CSS/JS, sin build) +
Supabase para que la dueña suba fotos, precios y descripciones desde su propio panel.

**Slogan:** _Haz relucir tu oscuridad_
**Checkout:** el carrito lleva directo a WhatsApp para cerrar la venta.

---

## 📁 Qué hay en el proyecto

```
index.html          Portada (logo animado + destacados)
catalogo.html       Catálogo con filtros y orden
producto.html       Ficha de producto (talla, descripción, comprar)
admin.html          Panel de la dueña (login + subir/editar productos)
assets/
  css/styles.css    Todo el diseño
  js/config.js      ← AQUÍ pones tu WhatsApp y tus llaves de Supabase
  js/logo.js        El logo (murciélago + luna), pieza independiente
  js/store.js       Carrito, datos y checkout por WhatsApp
  js/admin.js       Lógica del panel
  data/seed-products.js  Catálogo de ejemplo (mientras no conectas Supabase)
supabase/setup.sql  El SQL para crear la base de datos (copiar y pegar)
vercel.json         Config de Vercel
```

---

## 1️⃣ Poner tu número de WhatsApp (obligatorio)

Abre `assets/js/config.js` y cambia el número por el de la dueña,
en formato internacional **sin + ni espacios** (Chile = `56` + número):

```js
whatsapp: "56912345678",
```

> Con solo esto, la tienda ya funciona con el catálogo de ejemplo. El resto (Supabase)
> lo puedes hacer después.

---

## 2️⃣ Subir a GitHub

1. Crea una cuenta en [github.com](https://github.com) (gratis).
2. Botón **New repository** → nombre `obsidiana` → **Create repository**.
3. En la pantalla que aparece, elige **“uploading an existing file”**.
4. Arrastra **todo el contenido de esta carpeta** (no la carpeta, su contenido).
5. **Commit changes**.

---

## 3️⃣ Desplegar en Vercel (gratis)

1. Entra a [vercel.com](https://vercel.com) y regístrate **con tu cuenta de GitHub**.
2. **Add New… → Project**.
3. Elige el repo `obsidiana` → **Import**.
4. No cambies nada (es un sitio estático) → **Deploy**.
5. En ~1 minuto tendrás una URL tipo `https://obsidiana.vercel.app` 🎉

Cada vez que actualices el repo en GitHub, Vercel vuelve a publicar solo.

---

## 4️⃣ Conectar Supabase — para que la dueña edite todo sola (gratis)

Esto es lo que permite subir fotos/precios y que se vean al instante para todos.

**a) Crear el proyecto**
1. Entra a [supabase.com](https://supabase.com) → **Start your project** (gratis).
2. **New project**. Ponle nombre y una contraseña de base de datos (guárdala).
3. Espera ~2 min a que se cree.

**b) Crear la base de datos**
4. Menú izquierdo → **SQL Editor** → **New query**.
5. Abre el archivo `supabase/setup.sql`, copia **todo**, pégalo y presiona **Run**.
   (Crea la tabla de productos, el espacio de fotos y los permisos.)

**c) Copiar tus llaves**
6. Menú → **Project Settings** (engranaje) → **API**.
7. Copia **Project URL** y la llave **anon public**.
8. Pégalas en `assets/js/config.js`:

```js
supabaseUrl: "https://xxxxxxxx.supabase.co",
supabaseAnonKey: "eyJhbGci....(la llave larga)",
```

**d) Crear el usuario de la dueña**
9. Menú → **Authentication** → **Users** → **Add user**.
10. Escribe el correo y contraseña de la dueña y marca **Auto Confirm User**.

**e) Publicar el cambio**
11. Sube el `config.js` actualizado a GitHub (o edítalo ahí mismo con el lápiz ✏️).
    Vercel republica solo.

Listo. Entra a `tu-sitio.vercel.app/admin.html`, inicia sesión y empieza a cargar productos.

---

## 5️⃣ Cómo usa el panel la dueña (día a día)

1. Va a `tu-sitio.vercel.app/admin.html`.
2. Inicia sesión con su correo y contraseña.
3. **+ Nuevo producto** → escribe nombre, precio, descripción, tallas, elige la foto.
4. Si es de una colección nueva, marca la casilla y elige color (rojo o morado).
5. **Guardar**. Aparece al instante en la tienda. Puede **Editar** o **Eliminar** cuando quiera.

Nada de código. Nada de GitHub. Solo su panel.

---

## 🎨 Notas de diseño

- **Colores:** negro, plateado y blanco. Rojo/morado **solo** en colecciones nuevas (etiqueta).
- **Tipografía:** _Grenze Gotisch_ (gótica legible) para títulos + _Jost_ para el cuerpo.
- **Logo:** murciélago volando hacia una luna creciente. Animado, en `assets/js/logo.js`.
- **Responsive:** funciona en celular y computador.

## 💸 Costos

Todo en capa gratuita: **GitHub $0 · Vercel $0 · Supabase $0**.
Solo pagarías si el tráfico o las fotos superan los límites gratis (muy holgados para empezar).
