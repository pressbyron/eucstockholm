/* ============================================================
   EUC Stockholm – interactions
   ============================================================ */

// ----- Sticky nav -----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ----- Mobile burger -----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// ----- Mode tabs -----
const modeTabs = document.querySelectorAll('.mode-tab');
const bookingTypeInput = document.getElementById('bookingType');
const companyGroup = document.getElementById('companyGroup');
const participantsGroup = document.getElementById('participantsGroup');
const participantsSelect = document.getElementById('participants');
const submitBtn = document.getElementById('submitBtn');

function setMode(mode) {
  document.body.dataset.mode = mode;

  modeTabs.forEach(btn => {
    const active = btn.dataset.tab === mode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active);
  });

  bookingTypeInput.value = mode === 'privat' ? 'Privatlektioner' : 'Företagsevent';

  // Participants field is required only for company bookings
  if (participantsSelect) {
    participantsSelect.required = mode === 'foretag';
  }

  // Risk checkbox is required only for private bookings
  const riskCheckbox = document.getElementById('riskCheckbox');
  if (riskCheckbox) {
    riskCheckbox.required = mode === 'privat';
  }
}

modeTabs.forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.tab));
});

// Default: private lessons
setMode('privat');

// ----- Scroll fade-in -----
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll(
  '.feat-item, .visual-card, .faq__item, .gallery__item, .pricing__card, .pricing__aside, .honest-box'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ----- Contact form → Web3Forms -----
const CONTACT_EMAIL = 'peter.jaaskelainen@gmail.com';

const form       = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');
const modal      = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');

function openModal() {
  modal.hidden = false;
  modalClose.focus();
}
function closeModal() {
  modal.hidden = true;
}

modalClose.addEventListener('click', closeModal);
modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

form.addEventListener('submit', async e => {
  e.preventDefault();

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Skickar…';
  formResult.textContent = '';
  formResult.className   = 'form__result';

  const data = Object.fromEntries(new FormData(form));

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(data),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      form.reset();
      openModal();
    } else {
      throw new Error(json.message || 'Okänt fel');
    }
  } catch {
    formResult.textContent = `Något gick fel – maila oss direkt på ${CONTACT_EMAIL}`;
    formResult.classList.add('form__result--error');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Skicka bokningsförfrågan';
  }
});
