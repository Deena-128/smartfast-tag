// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
});

// ── COUNT UP ANIMATION ──
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.nextElementSibling?.classList.contains('stat-suffix')
    ? el.nextElementSibling.textContent : '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('en-IN');
    if (current >= target) clearInterval(timer);
  }, 16);
}
const counters = document.querySelectorAll('.stat-num[data-target]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

// ── AOS (scroll reveal) ──
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
aosEls.forEach(el => aosObs.observe(el));

// ── TOAST ──
function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    const text = document.createElement('span');
    text.className = 'toast-text';
    toast.append(icon, text);
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-icon').textContent = type === 'success' ? '✅' : '❌';
  toast.querySelector('.toast-text').textContent = msg;
  toast.className = `show ${type}`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}
window.showToast = showToast;

// ── RECHARGE MODAL (recharge page) ──
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}
window.openModal = openModal;
window.closeModal = closeModal;

// ── FORM VALIDATION (register/login pages) ──
function validateForm(formId, rules) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    rules.forEach(({ field, test, msg }) => {
      const el = form.querySelector(`[name="${field}"]`);
      const err = form.querySelector(`[data-err="${field}"]`);
      if (!el) return;
      const ok = test(el.value.trim());
      if (err) { err.textContent = ok ? '' : msg; err.style.color = '#F87171'; }
      if (!ok) valid = false;
    });
    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Processing…'; }
      setTimeout(() => {
        showToast('Action completed successfully!');
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Submit'; }
      }, 1200);
    }
  });
}
window.validateForm = validateForm;

// ── ACTIVE NAV LINK ──
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href').split('/').pop();
  if (href === currentPage) a.classList.add('active');
});

// ── CHARTS (dashboard/admin) ──
window.renderLineChart = function(canvasId, labels, datasets, opts = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94A3B8', font: { family: 'DM Sans' } } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748B' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748B' } },
      },
      ...opts
    }
  });
};
window.renderBarChart = function(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94A3B8' } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748B' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748B' } },
      }
    }
  });
};
window.renderDoughnutChart = function(canvasId, labels, data, colors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 0 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', padding: 16 } } },
      cutout: '70%',
    }
  });
};
