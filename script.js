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

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

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
const submitBtn  = form.querySelector('[type="submit"]');
const formResult = document.getElementById('formResult');

form.addEventListener('submit', async e => {
  e.preventDefault();

  submitBtn.disabled     = true;
  submitBtn.textContent  = 'Skickar…';
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
      formResult.textContent = 'Tack! Vi hör av oss inom 24 timmar.';
      formResult.classList.add('form__result--success');
      form.reset();
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
