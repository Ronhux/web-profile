
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
document.querySelectorAll('.skill, .ach-card, .contact-item, .home-content, .home-img, .about, .skills, .achievements, .contact, .works').forEach(el => {
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

// ----------------- My Works carousel + modal -----------------
function initWorksCarousel() {
  const carousel = document.querySelector('.works-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.work-slide'));
  const prevBtn = document.querySelector('.works-prev');
  const nextBtn = document.querySelector('.works-next');
  const interval = parseInt(carousel.dataset.interval || '4000', 10);
  const descBox = document.querySelector('.work-description');
  // start at -1 so calling show(0) will not early-return and will make the first slide visible
  let idx = -1;
  let timer = null;

  function show(i) {
  if (!slides.length) return;
  const prev = slides[idx];
  const nextSlide = slides[i];
  if (prev === nextSlide) return;

  // exit animation for previous
  if (prev) {
    prev.classList.remove('entering');
    prev.classList.add('exiting');
    prev.classList.remove('visible');
    setTimeout(() => {
      prev.classList.remove('exiting');
    }, 900);
  }

  // enter animation for next
  if (nextSlide) {
    nextSlide.classList.remove('exiting');
    nextSlide.classList.add('entering');
    nextSlide.classList.add('visible');
    setTimeout(() => {
      nextSlide.classList.remove('entering');
    }, 900);

    // ✨ update description text
    if (descBox) {
      descBox.classList.remove('show');
      setTimeout(() => {
        descBox.textContent = nextSlide.dataset.description || '';
        descBox.classList.add('show');
      }, 200); // slight delay for smoother effect
    }
  }

  idx = i;
}


  function goNext() { show((idx + 1) % slides.length); }
  function goPrev() { show((idx - 1 + slides.length) % slides.length); }

  // autoplay
  function start() { stop(); timer = setInterval(goNext, interval); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  // initialize images if slides use data-src (support both patterns)
  slides.forEach(s => {
    const img = s.querySelector('img');
    const dataSrc = s.dataset.src;
    if (!img && dataSrc) {
      const iEl = document.createElement('img');
      iEl.src = dataSrc;
      s.appendChild(iEl);
    }
  });

  // show first slide
  if (slides.length) show(0);

  // controls
  if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); stop(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); stop(); });

  // pause on hover
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  // click to open modal
  const modal = document.querySelector('.work-modal');
  const modalImg = modal ? modal.querySelector('.work-modal-media img') : null;
  const modalDesc = modal ? modal.querySelector('.work-modal-desc') : null;
  const modalClose = modal ? modal.querySelector('.work-modal-close') : null;

  slides.forEach((s, i) => {
    s.addEventListener('click', () => {
      if (!modal) return;
      const imgEl = s.querySelector('img');
      const src = imgEl ? imgEl.src : s.dataset.src || '';
      const desc = s.dataset.description || '';
      if (modalImg) { modalImg.src = src; modalImg.alt = s.querySelector('img') ? s.querySelector('img').alt || 'Work' : 'Work'; }
      if (modalDesc) modalDesc.textContent = desc;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) modalClose.addEventListener('click', () => {
    if (!modal) return;
    modal.hidden = true; document.body.style.overflow = '';
  });

  // close modal when clicking outside inner
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) { modal.hidden = true; document.body.style.overflow = ''; }
  });

  start();
}

// init on DOM ready
document.addEventListener('DOMContentLoaded', initWorksCarousel);

// ---------------- Certificate Popup (Gallery Style) ----------------
document.querySelectorAll('.ach-level').forEach(level => {
  level.addEventListener('click', () => {
    const certPopup = document.querySelector('.cert-popup');
    const gallery = document.querySelector('.cert-gallery');
    const certList = level.dataset.cert ? level.dataset.cert.split(',') : [];

    gallery.innerHTML = ''; // Clear previous images

    certList.forEach(src => {
      const img = document.createElement('img');
      img.src = src.trim();
      img.alt = 'Certificate';
      gallery.appendChild(img);
    });

    certPopup.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

const certPopup = document.querySelector('.cert-popup');
const certPopupClose = document.querySelector('.cert-popup-close');

certPopupClose.addEventListener('click', () => {
  certPopup.hidden = true;
  document.body.style.overflow = '';
});

certPopup.addEventListener('click', (e) => {
  if (e.target === certPopup) {
    certPopup.hidden = true;
    document.body.style.overflow = '';
  }
});

// ---------------- Fetch and Display Data ----------------
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("data-output");
    if (!container) return;

    const { profile, skills, hobbies, projects } = data;

    container.innerHTML = `
      <div class="profile-section">
        <h3>👤 Profile</h3>
        <p><strong>Name:</strong> ${profile.name}</p>
        <p><strong>Role:</strong> ${profile.role}</p>
        <p><strong>Location:</strong> ${profile.location}</p>
      </div>

      <div class="skills-section">
        <h3>🧠 Skills</h3>
        <ul>${skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
      </div>

      <div class="hobbies-section">
        <h3>🎯 Hobbies</h3>
        <ul>${hobbies.map(hobby => `<li>${hobby}</li>`).join("")}</ul>
      </div>

      <div class="projects-section">
        <h3>💼 Projects</h3>
        <ul>
          ${projects.map(project => `
            <li>
              <strong>${project.name}</strong> — ${project.description}
              <br><a href="${project.url}" target="_blank" style="color: var(--accent-red);">View Project</a>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  })
  .catch(error => {
    console.error("Error fetching data:", error);
    document.getElementById("data-output").textContent = "Failed to load data.";
  });

