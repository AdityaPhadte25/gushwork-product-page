/*
=====================================================
Gushwork Assignment – JavaScript Functionality
Author: Aditya Phadte

This file handles all interactive behavior on the page:

1. Sticky header on scroll
2. Mobile hamburger navigation
3. Image carousel with autoplay and thumbnails
4. Image zoom preview on hover
5. Process stepper interaction
6. Industries card carousel
7. FAQ accordion
8. Modal open/close functionality
9. Scroll reveal animations

All code uses vanilla JavaScript with no external libraries.
=====================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* HAMBURGER MENU */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  /* IMAGE CAROUSEL WITH ZOOM */
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel__slide');
  const thumbs = document.querySelectorAll('.carousel__thumb');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  let current = 0;
  let autoplay;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  thumbs.forEach(t => t.addEventListener('click', () => { goTo(+t.dataset.index); resetAuto(); }));

  // Touch swipe
  let tx = 0;
  track?.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  }, { passive: true });

  function startAuto() { autoplay = setInterval(() => goTo(current + 1), 4500); }
  function resetAuto() { clearInterval(autoplay); startAuto(); }
  startAuto();

  track?.addEventListener('mouseenter', () => clearInterval(autoplay));
  track?.addEventListener('mouseleave', () => startAuto());

  // Zoom
  document.querySelectorAll('.carousel__img-wrap').forEach(wrap => {

    const lens = wrap.querySelector('.zoom-lens');
    const overlay = wrap.querySelector('.zoom-overlay');
    const zoomImg = overlay.querySelector('img');

    wrap.addEventListener('mousemove', (e) => {

      const rect = wrap.getBoundingClientRect();

      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      const lensW = lens.offsetWidth;
      const lensH = lens.offsetHeight;

      x = Math.max(lensW / 2, Math.min(x, rect.width - lensW / 2));
      y = Math.max(lensH / 2, Math.min(y, rect.height - lensH / 2));

      lens.style.left = (x - lensW / 2) + "px";
      lens.style.top = (y - lensH / 2) + "px";

      const xPercent = x / rect.width;
      const yPercent = y / rect.height;

      zoomImg.style.transform =
        `translate(-${xPercent * 100}%, -${yPercent * 100}%) scale(2)`;

      const overlayWidth = 380;

      let overlayX = e.clientX + 24;
      let overlayY = e.clientY - 140;

      if (overlayX + overlayWidth > window.innerWidth) {
        overlayX = e.clientX - overlayWidth - 24;
      }

      overlay.style.left = overlayX + "px";
      overlay.style.top = overlayY + "px";

    });

  });

  /*PROCESS STEPPER */
  const tabs = document.querySelectorAll('.process-tab');
  const processTitle = document.getElementById('processTitle');
  const processDesc = document.getElementById('processDesc');
  const processPoints = document.getElementById('processPoints');
  const processImg = document.getElementById('processImg');
  const processPrev = document.getElementById('processPrev');
  const processNext = document.getElementById('processNext');

  const steps = [
    { title: 'High-Grade Raw Material Selection', desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.', points: ['PE100 grade material', 'Optimal molecular weight distribution'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=340&fit=crop' },
    { title: 'Precision Extrusion Process', desc: 'Our state-of-the-art extruders process HDPE granules into uniform pipe profiles with precise diameter control and consistent wall thickness.', points: ['High-torque single-screw extruder', 'Temperature-controlled barrel zones'], img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=340&fit=crop' },
    { title: 'Controlled Water Cooling', desc: 'Rapid and uniform cooling achieved in water-spray troughs ensures the pipe retains its shape and dimensional accuracy.', points: ['Water spray cooling troughs', 'Uniform shrinkage control'], img: 'https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=500&h=340&fit=crop' },
    { title: 'Vacuum Sizing Calibration', desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.', points: ['Vacuum calibration sleeves', 'Real-time OD measurement'], img: 'https://images.unsplash.com/photo-1565793979108-76c25ff82b1e?w=500&h=340&fit=crop' },
    { title: 'Rigorous Quality Inspection', desc: 'Each pipe undergoes comprehensive quality checks including dimensional verification, pressure testing, and visual inspection.', points: ['Dimensional accuracy testing', 'Hydrostatic pressure test'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=340&fit=crop' },
    { title: 'Permanent Identification Marking', desc: 'Pipes are marked with product specifications and certification logos using inkjet printing for permanent traceability.', points: ['Product specification marking', 'BIS/ISO certification marks'], img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=340&fit=crop' },
    { title: 'Precision Length Cutting', desc: 'Automated cutting systems produce consistent pipe lengths with clean, square ends ready for installation.', points: ['Automated cut-off saw', 'Length accuracy ±5mm'], img: 'https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=500&h=340&fit=crop' },
    { title: 'Secure Packaging & Dispatch', desc: 'Finished pipes are bundled, wrapped and labelled for protection during transport. Coils are wound for easy handling.', points: ['Bundle strapping for straight pipes', 'Moisture-proof wrapping'], img: 'https://images.unsplash.com/photo-1565793979108-76c25ff82b1e?w=500&h=340&fit=crop' },
  ];

  let stepIndex = 0;

  function showStep(i) {
    if (i < 0) i = 0;
    if (i >= steps.length) i = steps.length - 1;
    stepIndex = i;
    const s = steps[i];
    tabs.forEach((t, ti) => t.classList.toggle('active', ti === i));
    if (processTitle) processTitle.textContent = s.title;
    if (processDesc) processDesc.textContent = s.desc;
    if (processPoints) processPoints.innerHTML = s.points.map(p => `<li><span class="check-blue">✔</span> ${p}</li>`).join('');
    if (processImg) {
      processImg.style.opacity = '0';
      setTimeout(() => { processImg.src = s.img; processImg.style.opacity = '1'; }, 150);
    }
  }

  if (processImg) processImg.style.transition = 'opacity 0.25s';

  tabs.forEach((tab, i) => tab.addEventListener('click', () => showStep(i)));
  processPrev?.addEventListener('click', () => showStep(stepIndex - 1));
  processNext?.addEventListener('click', () => showStep(stepIndex + 1));

  /*INDUSTRIES CAROUSEL*/
  const indCarousel = document.getElementById('industriesCarousel');
  const indPrev = document.getElementById('indPrev');
  const indNext = document.getElementById('indNext');
  let indOffset = 0;

  function getIndCardWidth() {
    const card = indCarousel?.querySelector('.industry-card');
    if (!card) return 260;
    return card.offsetWidth + 20;
  }

  function slideIndustries(dir) {
    const cardW = getIndCardWidth();
    const totalCards = indCarousel?.querySelectorAll('.industry-card').length || 0;
    const visibleCount = Math.floor(indCarousel.parentElement.offsetWidth / cardW);
    const maxOffset = Math.max(0, totalCards - visibleCount);
    indOffset = Math.max(0, Math.min(indOffset + dir, maxOffset));
    indCarousel.style.transform = `translateX(-${indOffset * cardW}px)`;
  }

  indPrev?.addEventListener('click', () => slideIndustries(-1));
  indNext?.addEventListener('click', () => slideIndustries(1));

  // Touch swipe for industries
  let indTx = 0;
  indCarousel?.addEventListener('touchstart', e => { indTx = e.touches[0].clientX; }, { passive: true });
  indCarousel?.addEventListener('touchend', e => {
    const diff = indTx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) slideIndustries(diff > 0 ? 1 : -1);
  }, { passive: true });

  /*FAQ*/
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /*MODALS*/
  function openModal(id) {
    document.getElementById(id)?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById(id)?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('openQuoteModal')?.addEventListener('click', () => openModal('quoteModal'));
  document.getElementById('openQuoteModal2')?.addEventListener('click', () => openModal('quoteModal'));
  document.getElementById('openQuoteModal3')?.addEventListener('click', () => openModal('quoteModal'));
  document.getElementById('headerCTA')?.addEventListener('click', () => openModal('quoteModal'));
  document.getElementById('openDatasheetModal')?.addEventListener('click', () => openModal('datasheetModal'));
  document.getElementById('openSpecsModal')?.addEventListener('click', () => openModal('specsModal'));

  document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
  });
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) { ov.classList.remove('open'); document.body.style.overflow = ''; } });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    }
  });

  // Form submit feedback
  document.querySelectorAll('.modal-form, #contactForm').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✓ Sent!';
      btn.style.background = '#28a745';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        const overlay = form.closest('.modal-overlay');
        if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
        form.reset();
      }, 2200);
    });
  });

  /*SCROLL REVEAL*/
  const revealEls = document.querySelectorAll(
    '.feature-card, .portfolio-card, .testimonial-card, .industry-card, ' +
    '.resource-row, .faq-item, .specs-table-wrap, .process-box, .didnt-find, ' +
    '.catalogue-box, .why-card'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement?.querySelectorAll('.reveal') || []);
        const delay = Math.min(siblings.indexOf(entry.target) * 70, 350);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  revealEls.forEach(el => observer.observe(el));

  const stickyBar = document.getElementById("productSticky");

  window.addEventListener("scroll", () => {

    const scrollPosition = window.scrollY;

    if (scrollPosition > 500) {
      stickyBar.classList.add("show");
    }
    else {
      stickyBar.classList.remove("show");
    }

  });
});
