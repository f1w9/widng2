/* =========================================================
   دعوة زفاف - Script
   يقرأ بيانات الدعوة من data-* في #invitation-data ويملأ بها
   كل عناصر الصفحة، بالإضافة إلى العد التنازلي والتأثيرات.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Read invitation data ---------------- */
  const dataEl = document.getElementById('invitation-data');
  const info = {
    groomName: dataEl.dataset.groomName,
    dayName:   dataEl.dataset.dayName,
    dateDisplay: dataEl.dataset.dateDisplay,
    dateIso:   dataEl.dataset.dateIso,
    hallName:  dataEl.dataset.hallName,
    city:      dataEl.dataset.city,
    mapsUrl:   dataEl.dataset.mapsUrl,
    phone:     dataEl.dataset.phone,
    whatsapp:  dataEl.dataset.whatsapp,
  };

  /* ---------------- Fill placeholders ---------------- */
  document.querySelectorAll('.js-groom-name, .js-groom-name-holder').forEach(el => {
    el.textContent = info.groomName;
  });
  document.querySelectorAll('.js-day-name').forEach(el => el.textContent = info.dayName);
  document.querySelectorAll('.js-date-display').forEach(el => el.textContent = info.dateDisplay);
  document.querySelectorAll('.js-hall-name').forEach(el => el.textContent = info.hallName);
  document.querySelectorAll('.js-city').forEach(el => el.textContent = info.city);
  document.querySelectorAll('.js-phone').forEach(el => el.textContent = formatPhoneDisplay(info.phone));
  document.querySelectorAll('.js-whatsapp').forEach(el => el.textContent = formatPhoneDisplay(info.whatsapp));

  const mapsLink = document.getElementById('maps-link');
  if (mapsLink) mapsLink.href = info.mapsUrl;

  const callLink = document.getElementById('call-link');
  if (callLink) callLink.href = 'tel:' + toIntlPhone(info.phone);

  const whatsappLink = document.getElementById('whatsapp-link');
  if (whatsappLink) whatsappLink.href = 'https://wa.me/' + toIntlPhone(info.whatsapp).replace('+', '');

  function toIntlPhone(local) {
    // Converts a Saudi local number like 0537405026 to +966537405026
    const digits = local.replace(/\D/g, '');
    if (digits.startsWith('966')) return '+' + digits;
    if (digits.startsWith('0')) return '+966' + digits.slice(1);
    return '+966' + digits;
  }
  function formatPhoneDisplay(local) {
    return local; // shown exactly as entered in the data attribute
  }

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('loaded'), 350);
  });

  /* ---------------- Scroll progress + back to top ---------------- */
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    backToTop.classList.toggle('show', y > 500);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Reveal on scroll ---------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------------- Countdown timer ---------------- */
  const targetDate = new Date(info.dateIso);
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const noteEl = document.getElementById('countdown-note');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (isNaN(targetDate.getTime())) {
      noteEl.textContent = '';
      return;
    }

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      noteEl.textContent = 'بارك الله لهما وبارك عليهما، حان موعد الفرحة!';
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(d);
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
    noteEl.textContent = 'بانتظار لحظات الفرح المنتظرة';
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
