/* ==========================================================================
   OBSIDIANA — Logo (pieza independiente y reutilizable)
   Murciélago gótico cruzando una luna creciente de plata.

   Uso:
     <span data-logo="mark"></span>   -> logo pequeño (header/footer)
     <div  data-logo="hero"></div>    -> logo grande animado (portada)
   Se inyecta solo al cargar la página. También expone window.obsidianaLogo().
   ========================================================================== */

(function () {
  function svg(variant) {
    var floating = variant === "hero";
    var uid = variant + "-" + Math.random().toString(36).slice(2, 7);
    return (
'<span class="obs-logo ' + (variant === "mark" ? "obs-mark" : "") + '">' +
  '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Obsidiana">' +
    '<defs>' +
      '<mask id="obs-cres-' + uid + '">' +
        '<rect width="200" height="150" fill="black"/>' +
        '<circle cx="118" cy="56" r="36" fill="white"/>' +
        '<circle cx="133" cy="47" r="33" fill="black"/>' +
      '</mask>' +
      '<clipPath id="obs-lit-' + uid + '"><circle cx="118" cy="56" r="36"/></clipPath>' +
    '</defs>' +
    '<circle cx="118" cy="56" r="45" class="m-halo"/>' +
    '<circle cx="118" cy="56" r="40" class="m-halo" style="opacity:.16"/>' +
    '<g class="' + (floating ? "float2" : "") + '">' +
      '<circle cx="118" cy="56" r="36" class="m-fill" mask="url(#obs-cres-' + uid + ')"/>' +
      '<g mask="url(#obs-cres-' + uid + ')" clip-path="url(#obs-lit-' + uid + ')">' +
        '<circle cx="104" cy="50" r="4.2" class="crater"/>' +
        '<circle cx="99" cy="64" r="3" class="crater"/>' +
        '<circle cx="109" cy="70" r="2.4" class="crater"/>' +
        '<circle cx="96" cy="52" r="2" class="crater" style="opacity:.22"/>' +
      '</g>' +
      '<circle cx="118" cy="56" r="36" class="m-edge" mask="url(#obs-cres-' + uid + ')"/>' +
    '</g>' +
    (floating ?
      '<path class="star t1" d="M60 34 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6 Z"/>' +
      '<path class="star t2" d="M164 40 l1.1 3 3 1.1 -3 1.1 -1.1 3 -1.1 -3 -3 -1.1 3 -1.1 Z"/>' +
      '<path class="star t3" d="M158 92 l.9 2.6 2.6 .9 -2.6 .9 -.9 2.6 -.9 -2.6 -2.6 -.9 2.6 -.9 Z"/>' +
      '<path class="star t4" d="M46 74 l.8 2.2 2.2 .8 -2.2 .8 -.8 2.2 -.8 -2.2 -2.2 -.8 2.2 -.8 Z"/>'
      : '') +
    '<g class="flap2">' +
      '<g class="bat2">' +
        '<path d="M100,92 C104,85 111,83 117,87 C115,80 120,76 125,77 C123,82 126,85 130,86 C141,79 152,78 160,77 C150,83 143,85 143,93 Q139,87 136,93 Q132,87 129,94 Q124,89 119,95 Q110,90 100,96 Z"/>' +
        '<path transform="translate(200,0) scale(-1,1)" d="M100,92 C104,85 111,83 117,87 C115,80 120,76 125,77 C123,82 126,85 130,86 C141,79 152,78 160,77 C150,83 143,85 143,93 Q139,87 136,93 Q132,87 129,94 Q124,89 119,95 Q110,90 100,96 Z"/>' +
        '<path class="bat-body" d="M100,79 C97.5,79 96,81.5 96,85 C96,90 98,95 100,98 C102,95 104,90 104,85 C104,81.5 102.5,79 100,79 Z"/>' +
        '<path class="bat-body" d="M96.5,80 C95,76 94.2,73.5 94.8,72 C96,73.4 97.2,75.6 97.8,78.4 Z"/>' +
        '<path class="bat-body" d="M103.5,80 C105,76 105.8,73.5 105.2,72 C104,73.4 102.8,75.6 102.2,78.4 Z"/>' +
      '</g>' +
    '</g>' +
  '</svg>' +
'</span>'
    );
  }

  window.obsidianaLogo = svg;

  function render() {
    document.querySelectorAll("[data-logo]").forEach(function (el) {
      if (el.dataset.rendered) return;
      el.innerHTML = svg(el.getAttribute("data-logo") || "mark");
      el.dataset.rendered = "1";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
