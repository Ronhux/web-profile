// script.js
// Vanilla JS for: mobile menu toggle, smooth scrolling, reveal-on-scroll and Download CV button

// Mobile menu toggle — toggles `nav.active` (CSS shows/hides the mobile menu)
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

// Smooth scrolling for same-page anchors and closing mobile nav when a link is clicked
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      const el = document.querySelector(targetId);
      if (el) {
        e.preventDefault();
        if (nav && nav.classList.contains('active')) nav.classList.remove('active');
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Simple reveal-on-scroll using IntersectionObserver — adds `.visible` to section elements
// Typed text effect (replaces the previous CSS-only typing)
// enable JS mode (remove CSS-only fallback)
document.body.classList.remove('no-js');
document.body.classList.add('js');

const typingEl = document.querySelector('.typing-text span');
const cursorEl = document.createElement('span');
cursorEl.className = 'cursor';
if (typingEl) typingEl.parentNode.appendChild(cursorEl);

// Read words from data-words attribute on the typing span (semicolon-separated)
let words = ['Web Developer','Front-End Developer','Web Designer','Youtuber','Script Writer'];
if (typingEl && typingEl.dataset.words) {
  words = typingEl.dataset.words.split(';').map(s => s.trim()).filter(Boolean);
}
let wIndex = 0, charIndex = 0, deleting = false;
const typeSpeed = 80;

function typeLoop() {
  const current = words[wIndex];
  if (!deleting) {
    typingEl.textContent = current.slice(0, charIndex + 1);
    // small visual press to mimic a keypress
    typingEl.classList.add('press');
    setTimeout(() => typingEl.classList.remove('press'), 70);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      wIndex = (wIndex + 1) % words.length;
    }
  }
  // add slight randomness to typing delay to feel more like a keyboard
  const base = deleting ? Math.max(20, Math.floor(typeSpeed / 2)) : typeSpeed;
  const jitter = Math.floor(Math.random() * 80) - 40; // -40..+39
  const nextDelay = Math.max(20, base + jitter);
  setTimeout(typeLoop, nextDelay);
}
if (typingEl) setTimeout(typeLoop, 500);

// Add a small visual pop/fade whenever the word completes (after the typing finishes)
function triggerTypingPop() {
  if (!typingEl) return;
  // wrap the span briefly with a helper class that has animation; use inner wrapper
  typingEl.classList.remove('pop');
  // force reflow to restart animation
  void typingEl.offsetWidth;
  typingEl.classList.add('pop');
}

// Hook into the typing loop: when a whole word finishes typing, trigger pop.
// We modify typeLoop slightly by wrapping the completion detection.
// To avoid rewriting huge logic, observe character changes via a MutationObserver.
if (typingEl) {
  let prevText = typingEl.textContent;
  const mo = new MutationObserver(() => {
    const cur = typingEl.textContent || '';
    // when previously shorter and now equal to a full word from words list -> pop
    if (cur.length > prevText.length) {
      // check if cur matches any full word (case-sensitive)
      if (words.includes(cur)) {
        triggerTypingPop();
      }
    }
    prevText = cur;
  });
  mo.observe(typingEl, { characterData: true, subtree: true, childList: true });
}

// Reveal-on-scroll with stagger using data-delay attributes
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Auto-assign staggered delays to elements that should animate
const staggerElements = Array.from(document.querySelectorAll('.skill-card, .ach-card, .contact-item, .more-skill'));
staggerElements.forEach((el, i) => {
  // default delay step: 120ms per item
  el.dataset.delay = String(i * 120);
});

// Observe elements that should animate: skills, achievement cards, contact items, and the main sections
document.querySelectorAll('.skill, .ach-card, .contact-item, .home-content, .home-img, .about, .skills, .achievements, .contact').forEach(el => {
  // ensure there's a numeric data-delay for observer
  if (!el.dataset.delay) el.dataset.delay = '0';
  observer.observe(el);
});

// Also observe the dynamic-data container if present so it reveals on scroll
const dyn = document.getElementById('dynamic-data');
if (dyn) {
  if (!dyn.dataset.delay) dyn.dataset.delay = '1080';
  observer.observe(dyn);
}

// ---------- Fetch local JSON (demonstrates async fetch + DOM manipulation) ----------
function renderDynamicData(json) {
  const container = document.getElementById('dynamic-data');
  if (!container) return;
  container.innerHTML = '';

  const title = document.createElement('h3');
  title.textContent = 'Loaded profile & data';
  container.appendChild(title);

  // profile summary
  if (json.profile) {
    const p = document.createElement('p');
    p.style.color = 'var(--muted)';
    p.textContent = `${json.profile.name} — ${json.profile.role} • ${json.profile.location}`;
    container.appendChild(p);
  }

  // skills list
  if (Array.isArray(json.skills)) {
    const ul = document.createElement('ul');
    json.skills.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  // projects (if any)
  if (Array.isArray(json.projects)) {
    const h4 = document.createElement('h4');
    h4.textContent = 'Projects';
    h4.style.color = '#fff';
    container.appendChild(h4);
    const p = document.createElement('p');
    p.style.color = 'var(--muted)';
    p.textContent = json.projects.map(pr => pr.name).join(' • ');
    container.appendChild(p);
  }
}

// fetch local JSON file (relative path)
fetch('./data.json', { cache: 'no-store' })
  .then(resp => {
    if (!resp.ok) throw new Error('Network response was not ok');
    return resp.json();
  })
  .then(json => {
    renderDynamicData(json);
  })
  .catch(err => {
    const container = document.getElementById('dynamic-data');
    if (container) {
      container.innerHTML = `<h3>Could not load data</h3><p style="color:var(--muted)">${err.message}</p>`;
    }
    console.error('Failed to load data.json', err);
  });

// Back to top button behavior
const backBtn = document.getElementById('backToTop');
if (backBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backBtn.classList.add('show'); else backBtn.classList.remove('show');
  });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
