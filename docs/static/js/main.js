document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLazyGifs();
  initCopyBibtex();
});

/* ---- Tab Switching ---- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabBar => {
    const group = tabBar.dataset.tabGroup;
    const panelContainer = document.querySelector(
      `.tab-panels[data-tab-group="${group}"]`
    );
    if (!panelContainer) return;

    tabBar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        panelContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = panelContainer.querySelector(`[data-panel="${target}"]`);
        if (panel) {
          panel.classList.add('active');
          loadVisibleGifs(panel);
        }
      });
    });
  });
}

/* ---- Lazy Loading GIFs ---- */
function initLazyGifs() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadGif(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('.lazy-gif').forEach(img => {
      observer.observe(img);
    });
  } else {
    document.querySelectorAll('.lazy-gif').forEach(loadGif);
  }
}

function loadGif(img) {
  const src = img.dataset.src;
  if (src && !img.src) {
    img.src = src;
  }
}

function loadVisibleGifs(panel) {
  panel.querySelectorAll('.lazy-gif').forEach(img => {
    if (!img.src && img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
}

/* ---- Copy BibTeX ---- */
function initCopyBibtex() {
  const btn = document.getElementById('copy-bibtex');
  const code = document.getElementById('bibtex-code');
  if (!btn || !code) return;

  btn.addEventListener('click', () => {
    const text = code.textContent;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.querySelector('span').textContent = 'Copy';
      }, 2000);
    });
  });
}
