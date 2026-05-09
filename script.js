/* ============================================
   MAYITO — script.js
   ============================================ */

// ============================================================
// TEXTOS DE LAS TARJETAS — edita aquí fácilmente
// ============================================================

const CARD_TEXTS = {

  // TARJETA 1 — bienvenida (texto fijo)
  card1: `ola crayola.

ESTOY totalmente seguro q no imaginabas una página así, es una sorpresaaaaaa (cmo cuando fue tu hermano), así. 

pero bueno, esta página va a ser como el museo de todos los mensajes que se me ocurran para ponerte y q te pongas roja así como este personaje:`,

  // CAMBIAR TEXTO TARJETA 2
  card2: `esta introducción estará siempre q entres.

así q voy a aprovechar para molestarteeeeee KAJSJKAJKAKJAJKA

con un hechizo del repertorio del CAMPEÓN INVICTO. 🌹`,

  // CAMBIAR TEXTO TARJETA 3
  card3: `así q aquí también servirá de recordatorio para q siempre lo tengas presente.

y aprovecho para agradecerle a PARRILLA por patrocinar este proyecto...

mayito. 🌸`,

  // CAMBIAR TEXTO TARJETA 4
  card4: `así que, ola @alebr_ijes

la cantidad de cosas que han pasado nos han traido hasta acá

yo confío en que será de esas historias q darán mucha risa después (how I met your mother parrilla edition deluxe pro)`

};

// ============================================================
// FECHA OBJETIVO DEL CONTADOR — 27 de agosto de este año
// ============================================================
// CAMBIAR FECHA: modifica día, mes (0-indexado) y año si es necesario
const TARGET_DATE = new Date(new Date().getFullYear(), 7, 27, 0, 0, 0); // 27 agosto

// ============================================================
// CONTROL DE ESCENAS — qué animación usa cada escena
// ============================================================
const SCENE_ANIMATIONS = {
  'scene-1':      'anim-scaleIn',
  'scene-2':      'anim-slideLeft',
  'scene-3':      'anim-slideRight',
  'scene-4':      'anim-rotateIn',
  'scene-garden': 'anim-fadeIn',
  'scene-final':  'anim-fadeUp',
};

// ============================================================
// VARIABLES GLOBALES
// ============================================================
let musicPlaying = false;
let countdownInterval = null;
let typewriterTimeouts = [];

// ============================================================
// PARTÍCULAS DE FONDO
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.05,
      color: Math.random() > 0.6
        ? `rgba(212,168,103,`
        : `rgba(228,160,160,`
    };
  }

  function initParticleList() {
    const count = Math.min(80, Math.floor(W * H / 9000));
    particles = Array.from({ length: count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -5)  p.x = W + 5;
      if (p.x > W+5) p.x = -5;
      if (p.y < -5)  p.y = H + 5;
      if (p.y > H+5) p.y = -5;
    });
    requestAnimationFrame(draw);
  }

  resize();
  initParticleList();
  draw();
  window.addEventListener('resize', () => { resize(); initParticleList(); });
})();

// ============================================================
// PÉTALOS ANIMADOS
// ============================================================
function createPetals(active) {
  const container = document.getElementById('petals-container');
  container.innerHTML = '';
  if (!active) return;

  const petals = ['🌸', '🌺', '🌹', '🌷', '✿', '❀'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 8 + 7) + 's';
    el.style.animationDelay = (Math.random() * 10) + 's';
    el.style.fontSize = (Math.random() * 14 + 12) + 'px';
    container.appendChild(el);
  }
}

// ============================================================
// MÚSICA
// ============================================================
const audio = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicBtn = document.getElementById('music-toggle');

musicBtn.addEventListener('click', toggleMusic);

function toggleMusic() {
  if (musicPlaying) {
    audio.pause();
    musicIcon.textContent = '♪';
    musicBtn.style.opacity = '0.5';
    musicPlaying = false;
  } else {
    audio.play().catch(() => {});
    musicIcon.textContent = '♫';
    musicBtn.style.opacity = '1';
    musicPlaying = true;
  }
}

function tryPlayMusic() {
  audio.volume = 0;
  audio.play().then(() => {
    musicPlaying = true;
    musicIcon.textContent = '♫';
    // Fade in
    let vol = 0;
    const fade = setInterval(() => {
      vol = Math.min(vol + 0.03, 0.75);
      audio.volume = vol;
      if (vol >= 0.75) clearInterval(fade);
    }, 120);
  }).catch(() => {
    // autoplay bloqueado; el usuario puede presionar el botón de música
  });
}

// ============================================================
// TYPEWRITER EFFECT
// ============================================================
function typewriterWrite(el, text, speed, onDone) {
  // Limpiar timeouts previos
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
      // Pausa ligeramente más larga en saltos de línea
      const delay = char === '\n' ? speed * 8 : speed;
      const t = setTimeout(tick, delay);
      typewriterTimeouts.push(t);
    } else {
      // Quitar cursor después de un momento
      const t = setTimeout(() => {
        cursor.remove();
        if (onDone) onDone();
      }, 800);
      typewriterTimeouts.push(t);
    }
  }
  tick();
}

// ============================================================
// SISTEMA DE ESCENAS
// ============================================================
const sceneOrder = ['scene-1', 'scene-2', 'scene-garden', 'scene-3', 'scene-4', 'scene-final'];

function showScene(sceneId) {
  // Ocultar todas
  document.querySelectorAll('.card-scene').forEach(s => {
    s.classList.add('hidden');
    s.classList.remove(...Object.values(SCENE_ANIMATIONS));
  });

  const scene = document.getElementById(sceneId);
  if (!scene) return;

  scene.classList.remove('hidden');
  const anim = SCENE_ANIMATIONS[sceneId] || 'anim-fadeUp';

  // Aplicar animación al hijo principal
  const target = scene.querySelector('.card, .garden-scene, .final-scene');
  if (target) {
    target.classList.remove(anim);
    // Force reflow
    void target.offsetWidth;
    target.classList.add(anim);
  }

  // Typewriter para tarjetas

  // Ocultar imagen de la card 1 al cambiar de escena
const characterBox = document.getElementById('character-box-1');

if (characterBox) {
  characterBox.classList.add('hidden');
}
if (sceneId === 'scene-1') {

  // Ocultar imagen al entrar nuevamente
  const characterBox = document.getElementById('character-box-1');

  if (characterBox) {
    characterBox.classList.add('hidden');
  }

  setTimeout(() => typewriterWrite(
    document.getElementById('typewriter-1'),
    CARD_TEXTS.card1,
    28,
    () => {

      // Mostrar imagen SOLO en la tarjeta 1
      if (characterBox) {
        characterBox.classList.remove('hidden');
      }

    }
  ), 300);

  } else if (sceneId === 'scene-2') {
    setTimeout(() => typewriterWrite(
      document.getElementById('typewriter-2'), CARD_TEXTS.card2, 30
    ), 300);
  } else if (sceneId === 'scene-3') {
    setTimeout(() => typewriterWrite(
      document.getElementById('typewriter-3'), CARD_TEXTS.card3, 30
    ), 300);
  } else if (sceneId === 'scene-4') {
    setTimeout(() => typewriterWrite(
      document.getElementById('typewriter-4'), CARD_TEXTS.card4, 30
    ), 300);
  } else if (sceneId === 'scene-final') {
    startCountdown();
  }

  // Scroll to top en mobile
  scene.scrollTop = 0;
}

// ============================================================
// NEXT SCENE
// ============================================================
window.nextScene = function(target) {
  if (target === 'final') {
    showScene('scene-final');
  } else if (target === 'garden') {
    showScene('scene-garden');
  } else {
    showScene('scene-' + target);
  }
};

// ============================================================
// COUNTER COUNTDOWN
// ============================================================
function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);

  function update() {
    const now = new Date();
    let diff = TARGET_DATE - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      clearInterval(countdownInterval);
      return;
    }

    const days  = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins  = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs  = Math.floor(diff / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// ============================================================
// INTRO → EXPERIENCIA PRINCIPAL (TELÓN)
// ============================================================
document.getElementById('enter-btn').addEventListener('click', enterExperience);

function enterExperience() {
  const btn = document.getElementById('enter-btn');
  btn.disabled = true;

  // Cerrar telones
  const cL = document.getElementById('curtain-left');
  const cR = document.getElementById('curtain-right');
  cL.classList.add('active');
  cR.classList.add('active');

  setTimeout(() => {
    // Ocultar intro
    const intro = document.getElementById('intro-screen');
    intro.style.opacity = '0';
    intro.style.pointerEvents = 'none';

    // Mostrar experiencia
    const main = document.getElementById('main-experience');
    main.classList.remove('hidden');
    main.style.opacity = '0';

    // Iniciar pétalos
    createPetals(true);

    // Abrir telones
    cL.classList.remove('active');
    cL.classList.add('open');
    cR.classList.remove('active');
    cR.classList.add('open');

    // Fade in experience
    requestAnimationFrame(() => {
      main.style.transition = 'opacity 1s ease 0.3s';
      main.style.opacity = '1';
    });

    // Mostrar primera tarjeta
    setTimeout(() => {
      showScene('scene-1');
    }, 600);

    // Música
    tryPlayMusic();

    // Ocultar intro del DOM después
    setTimeout(() => {
      intro.style.display = 'none';
    }, 1200);

  }, 750);
}

// ============================================================
// INTERACCIÓN INTRO — efecto hover en las flores
// ============================================================
document.querySelectorAll('.intro-flowers span').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.opacity = '0.8';
    el.style.transform = 'scale(1.3)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.opacity = '';
    el.style.transform = '';
  });
});
