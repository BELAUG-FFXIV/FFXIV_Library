/* BELAUG COPY PROTECT START */
(function () {
  const OWNER_KEY = 'belaugOwnerMode';

  const PROTECT_SELECTOR = '.copy-protect, .tab-panel:not(#panel-comments)';
  const EXCLUDE_SELECTOR = '#panel-comments, input, textarea, select, button, [contenteditable="true"], .giscus, .giscus-frame, iframe';

  function isOwnerMode() {
    return localStorage.getItem(OWNER_KEY) === 'true';
  }

  function syncOwnerModeAttr() {
    if (isOwnerMode()) {
      document.documentElement.setAttribute('data-belaug-owner', 'true');
    } else {
      document.documentElement.removeAttribute('data-belaug-owner');
    }
  }

  function getTargetEl(node) {
    if (!node) return null;
    return node.nodeType === 1 ? node : node.parentElement;
  }

  function isProtected(node) {
    if (isOwnerMode()) return false;

    const el = getTargetEl(node);
    if (!el) return false;

    if (el.closest(EXCLUDE_SELECTOR)) return false;
    return !!el.closest(PROTECT_SELECTOR);
  }

  syncOwnerModeAttr();

  document.addEventListener('contextmenu', function (e) {
    if (isProtected(e.target)) {
      e.preventDefault();
    }
  });

  document.addEventListener('copy', function (e) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    if (isProtected(sel.anchorNode) || isProtected(sel.focusNode)) {
      e.preventDefault();
    }
  });

  document.addEventListener('cut', function (e) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    if (isProtected(sel.anchorNode) || isProtected(sel.focusNode)) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', function (e) {
    if (isProtected(e.target)) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();

    if ((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'x' || key === 'a' || key === 's' || key === 'u')) {
      const sel = window.getSelection();

      if (
        isProtected(e.target) ||
        isProtected(sel?.anchorNode) ||
        isProtected(sel?.focusNode)
      ) {
        e.preventDefault();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.altKey && (e.code === 'KeyB' || key === 'b')) {
      e.preventDefault();
      const next = !isOwnerMode();
      localStorage.setItem(OWNER_KEY, String(next));
      syncOwnerModeAttr();
      alert(next ? 'BELAUG Owner Mode: ON' : 'BELAUG Owner Mode: OFF');
    }
  });
})();
/* BELAUG COPY PROTECT END */
