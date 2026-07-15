/* ============================================
   MAYITO — CAPÍTULO DOS
   capitulo2.js
   ============================================ */

// ============================================================
// FRAGMENTOS DE LA CARTA — edita SOLO este arreglo.
//
// Cada elemento es una tarjeta/pantalla nueva con su propio botón
// "seguir". Agrega o quita tantos objetos como necesites: los
// puntos de progreso y la navegación se ajustan solos.
//
// Campos de cada fragmento:
//   text       -> el texto de esa parte de la carta (los saltos
//                 de línea que dejes se respetan tal cual).
//   mediaSlot  -> true / false. Si es true, esa tarjeta muestra
//                 un cuadro abajo del texto para una imagen,
//                 sticker o algo gracioso.
//   mediaSrc   -> déjalo en null mientras no tengas el archivo
//                 (se ve un cuadro punteado de "aquí va tu imagen").
//                 Cuando tengas la imagen/sticker, sube el archivo
//                 junto a estos archivos y escribe aquí su nombre,
//                 ej: "sticker1.png" — el cuadro punteado se
//                 reemplaza solo por tu imagen real.
// ============================================================
const LETTER_FRAGMENTS = [
  {
    text: `OÑAAAAA corazón, ola crayola, ola mi preciosa, te quiero mucho, mi rojito.

una vez más, estando aquí escribiendo un pensar para ti, pero en tu página, porque sí, te recuerdo que tú tienes una página JKJAJAJKAJAKAJ.`,
    mediaSlot: false,
    mediaSrc: null
  },
  {
    text: `aquí haré un disclaimer, corazón. te extraño mucho, y ahora sí me siento como el perrito ese, el pug, porque, te extraño mucho,
    mucho, mucho, mucho, mucho, mucho. ya quiero verte, abrazarte, darte besito, oler y ver esos rizos que tanto me gustan al igual q tus ojitos, y de verdad me gustan tanto, me encantan, me encantan tanto que...`,
    mediaSlot: true,
    mediaSrc: "perrito.png"
  },
  {
    text: `en verdad no miento cuando digo que te quiero tanto. sigo y seguiré sin encontrar palabras para poder describir lo feliz y tranquilo que me siento estando contigo.

es curioso porque muchas veces yo, a lo largo del tiempo, he insistido en que la tranquilidad siempre tiene que estar con uno. y creo que es algo que has sabido de mí. pero algo que disfruto plenamente, y con lo que hoy me despierto y vivo los días sabiendo que es bonito, es poder compartir esa tranquilidad con alguien.

me hace feliz saber que estás ahí. y, más allá de eso, que eres tú.

y, por si fuera poco, saber que quizá no estaba tan errónea la idea que en algún momento tuve. si bien las cosas, como lo has mencionado tú también, no han salido al cien por ciento, me da gusto que haya habido, y que siga habiendo, el tiempo de reflexionar, querernos, abrazarnos, tenernos.

gracias por darme un pedacito de tu corazón y por dejarme estar en las buenas, en las no tan buenas, cuando estás feliz, triste, enojada o molesta. gracias por permitirme estar. gracias por quererme.

y no por el hecho de simplemente querer, sino porque me has hecho entender que, a veces, aunque no entendamos ciertas cosas, dentro de nosotros existe mucho amor.`,
    mediaSlot: false,
    mediaSrc: null
  },
  {
    text: `[ fragmento 4 — aquí puedes contar otro recuerdo o pensamiento ]`,
    mediaSlot: true,
    mediaSrc: null
  },
  {
    text: `[ fragmento 5 — este arreglo puede crecer todo lo que quieras ]`,
    mediaSlot: false,
    mediaSrc: null
  },
  {
    text: `[ fragmento 6 — el último antes de llegar al dibujo final ]`,
    mediaSlot: true,
    mediaSrc: null
  }
];

// ============================================================
// MÚSICA DE FONDO
// CAMBIAR: sube tu archivo de audio junto a estos archivos y
// pon aquí su nombre exacto (ej. "desde-que.mp3").
// ============================================================
const MUSIC_FILE = "music2.mp3";

// ============================================================
// VARIABLES GLOBALES
// ============================================================
let typewriterTimeouts = [];
let currentIndex = -1; // -1 = intro
let musicPlaying = false;
const TRANSITION_MS = 550; // duración del fundido entre tarjetas

// ============================================================
// PÉTALOS: TULIPANES Y LIRIOS CAYENDO SUAVEMENTE
// ============================================================
function createPetals() {
  const container = document.getElementById('petals-container');
  container.innerHTML = '';
  const flowers = ['🌷', '🤍', '✿', '🌷', '❀', '🌸'];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'petal2';
    el.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 12 + 14) + 'px';
    el.style.animationDuration = (Math.random() * 12 + 14) + 's';
    el.style.animationDelay = (Math.random() * 16) + 's';
    container.appendChild(el);
  }
}

// ============================================================
// LUCES CÁLIDAS QUE VUELAN HACIA ARRIBA — "el vuelo del amor"
// (mientras las flores caen, estas luces suben; dos movimientos
// suaves y opuestos que se sienten como un solo fluir)
// ============================================================
function createLoveLights() {
  const container = document.getElementById('love-lights');
  container.innerHTML = '';
  const count = 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'love-light';
    const size = Math.random() * 10 + 6;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 14 + 16) + 's';
    el.style.animationDelay = (Math.random() * 18) + 's';
    container.appendChild(el);
  }
}

// ============================================================
// TYPEWRITER EFFECT
// ============================================================
function typewriterWrite(el, text, speed, onDone) {
  typewriterTimeouts.forEach(t => clearTimeout(t));
  typewriterTimeouts = [];

  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  el.appendChild(cursor);

  let i = 0;
  function tick() {
    if (i < text.length) {
      const char = text[i];
      const node = document.createTextNode(char);
      el.insertBefore(node, cursor);
      i++;
      const delay = char === '\n' ? speed * 8 : speed;
      const t = setTimeout(tick, delay);
      typewriterTimeouts.push(t);
    } else {
      const t = setTimeout(() => {
        cursor.remove();
        if (onDone) onDone();
      }, 700);
      typewriterTimeouts.push(t);
    }
  }
  tick();
}

// ============================================================
// CONSTRUIR ESCENAS DE FRAGMENTOS (dinámico, según el arreglo)
// ============================================================
function buildFragmentScenes() {
  const root = document.getElementById('fragments-root');

  LETTER_FRAGMENTS.forEach((frag, i) => {
    const scene = document.createElement('div');
    scene.className = 'letter-scene hidden';
    scene.id = 'frag-' + i;

    const isLast = i === LETTER_FRAGMENTS.length - 1;

    const mediaHTML = frag.mediaSlot
      ? (frag.mediaSrc
          ? `<div class="mini-media"><img src="${frag.mediaSrc}" alt="" class="mini-media-img"></div>`
          : `<div class="mini-media mini-media-placeholder">
               <span class="mini-media-icon">✦</span>
               <span class="mini-media-hint">imagen / sticker</span>
             </div>`)
      : '';

    scene.innerHTML = `
      <div class="letter-card">
        <div class="card-deco top-deco">🤍 ✦ 🤍</div>
        <div class="card-text" id="tw-frag-${i}"></div>
        ${mediaHTML}
        <button class="continue-btn" data-goto="${isLast ? 'drawing' : i + 1}">
          seguir <span class="btn-arrow">→</span>
        </button>
        <div class="card-deco bottom-deco">🌷</div>
      </div>
    `;

    root.appendChild(scene);
  });

  // Delegar clics de todos los botones "seguir"
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-goto]');
    if (!btn) return;
    const target = btn.getAttribute('data-goto');
    if (target === 'drawing') {
      goToDrawing();
    } else {
      goToFragment(parseInt(target, 10));
    }
  });
}

// ============================================================
// PUNTOS DE PROGRESO
// ============================================================
function buildProgressDots() {
  const wrap = document.getElementById('progress-dots');
  wrap.innerHTML = '';
  LETTER_FRAGMENTS.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.id = 'dot-' + i;
    wrap.appendChild(dot);
  });
}

function updateProgressDots(index) {
  const wrap = document.getElementById('progress-dots');
  wrap.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

// ============================================================
// NAVEGACIÓN ENTRE FRAGMENTOS — con fundido suave (crossfade)
// ============================================================
function getVisibleScene() {
  return document.querySelector('.letter-scene:not(.hidden)');
}

function transitionTo(showFn) {
  const current = getVisibleScene();

  if (!current) {
    showFn();
    return;
  }

  current.classList.add('scene-leave');
  setTimeout(() => {
    current.classList.add('hidden');
    current.classList.remove('scene-leave', 'anim-fadeUp2');
    const inner = current.querySelector('.letter-card, .drawing-wrap');
    if (inner) inner.classList.remove('anim-fadeUp2');
    showFn();
  }, TRANSITION_MS);
}

function goToFragment(index) {
  transitionTo(() => {
    currentIndex = index;
    const scene = document.getElementById('frag-' + index);
    if (!scene) return;

    scene.classList.remove('hidden');
    void scene.offsetWidth; // reflow para reiniciar animación
    const card = scene.querySelector('.letter-card');
    if (card) card.classList.add('anim-fadeUp2');

    document.getElementById('progress-dots').classList.remove('hidden');
    updateProgressDots(index);

    setTimeout(() => typewriterWrite(
      document.getElementById('tw-frag-' + index),
      LETTER_FRAGMENTS[index].text,
      30
    ), 300);

    scene.scrollTop = 0;
  });
}

function goToDrawing() {
  transitionTo(() => {
    document.getElementById('progress-dots').classList.add('hidden');

    const scene = document.getElementById('scene-drawing');
    scene.classList.remove('hidden');
    void scene.offsetWidth;
    scene.querySelector('.drawing-wrap').classList.add('anim-fadeUp2');
  });
}

// ============================================================
// MÚSICA
// ============================================================
function setupMusic() {
  const audio = document.getElementById('bg-music-2');
  const btn = document.getElementById('music-toggle-2');
  const icon = document.getElementById('music-icon-2');
  if (!audio || !btn) return;

  audio.src = MUSIC_FILE;

  btn.addEventListener('click', () => {
    if (musicPlaying) {
      audio.pause();
      icon.textContent = '♪';
      btn.style.opacity = '0.5';
      musicPlaying = false;
    } else {
      audio.play().catch(() => {});
      icon.textContent = '♫';
      btn.style.opacity = '1';
      musicPlaying = true;
    }
  });
}

function tryPlayMusic() {
  const audio = document.getElementById('bg-music-2');
  const icon = document.getElementById('music-icon-2');
  const btn = document.getElementById('music-toggle-2');
  if (!audio) return;

  audio.volume = 0;
  audio.play().then(() => {
    musicPlaying = true;
    icon.textContent = '♫';
    btn.style.opacity = '1';
    let vol = 0;
    const fade = setInterval(() => {
      vol = Math.min(vol + 0.025, 0.6);
      audio.volume = vol;
      if (vol >= 0.6) clearInterval(fade);
    }, 150);
  }).catch(() => {
    // autoplay bloqueado; el usuario puede presionar el botón de música
  });
}

// ============================================================
// ENTRADA A LA EXPERIENCIA
// ============================================================
document.getElementById('enter-btn').addEventListener('click', () => {
  const intro = document.getElementById('intro-screen');
  intro.style.transition = 'opacity 0.7s ease';
  intro.style.opacity = '0';
  intro.style.pointerEvents = 'none';

  setTimeout(() => {
    intro.style.display = 'none';
    document.getElementById('experience').classList.remove('hidden');
    goToFragment(0);
    tryPlayMusic();
  }, 650);
});

// ============================================================
// INICIALIZACIÓN
// ============================================================
createPetals();
createLoveLights();
buildFragmentScenes();
buildProgressDots();
setupMusic();
