(() => {
  const seen = new Map(); // key -> last timestamp
  let promoSignalCount = 0;
  let lastRefresh = 0;
  const REFRESH_THRESHOLD = 3;
  const REFRESH_COOLDOWN_MS = 8000;

  const pageType = document.body.dataset.pageType || 'landing';
  const productHandle = document.body.dataset.productHandle || '';
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const parseTokens = (str = '') => (str || '')
    .split(/[\s,]+/)
    .map(s => s.trim())
    .filter(Boolean);

  // Click interactions
  document.addEventListener('click', (event) => {
    const special = event.target.closest('[data-lumina-tag], [data-lumina-goal]');
    const target = event.target.closest('.lumina-track');
    if (!special && !target) return;

    const el = special || target;

    const rawTags = special?.getAttribute('data-lumina-tag')
      || special?.getAttribute('data-lumina-tags')
      || target?.getAttribute('data-lumina-tags')
      || target?.getAttribute('data-lumina-tag')
      || '';
    const rawGoals = special?.getAttribute('data-lumina-goal')
      || special?.getAttribute('data-lumina-goals')
      || target?.getAttribute('data-lumina-goals')
      || target?.getAttribute('data-lumina-goal')
      || '';

    const tagsOverride = parseTokens(rawTags);
    const goalsOverride = parseTokens(rawGoals);

    console.log('[Lumina][click]', {
      source: special ? 'sub-element' : 'component',
      id: (target || special)?.dataset?.luminaId,
      rawTags,
      rawGoals,
      tags: tagsOverride,
      goals: goalsOverride
    });

    sendDelta(target || el, 0.3, tagsOverride, goalsOverride);
  });

  // Dynamic tagging for late-loaded promo/teaser elements (e.g., Klaviyo popup)
  const dynamicSelectors = [
    '.klaviyo-form',
    '[data-testid="klaviyo-form-Rvcmpc"]',
    '.needsclick.Teaser-pointer-Hn1zd.kl-private-reset-css-Xuajs1',
    '.needsclick.kl-teaser-QSGcAn.kl-private-reset-css-Xuajs1',
    '.needsclick.go300628013',
    '[data-testid="animated-teaser"]',
    '.kl-teaser-QSGcAn'
  ];

  const tagDynamic = (root) => {
    const doc = typeof document !== 'undefined' ? document : null;
    const base = root || doc;
    if (!base) return [];
    const nodes = root.querySelectorAll(dynamicSelectors.join(','));
    if (nodes.length) console.log('[Lumina][tagDynamic] tagged nodes:', nodes.length);
    nodes.forEach(node => {
      node.setAttribute('data-lumina-tag', 'promo,sale');
      node.setAttribute('data-lumina-goal', 'promo');
    });
  };

  if (typeof document !== 'undefined') {
    tagDynamic(document);
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(n => {
          if (!(n instanceof HTMLElement)) return;
          tagDynamic(n);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Dwell tracking
  const dwellStart = new WeakMap();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        dwellStart.set(el, performance.now());
      } else if (dwellStart.has(el)) {
        const elapsed = performance.now() - dwellStart.get(el);
        dwellStart.delete(el);
        if (elapsed > 2000) {
          const delta = clamp(elapsed / 8000, 0.1, 0.6);
          console.log('[Lumina][dwell]', {
            id: el.dataset.luminaId,
            ms: Math.round(elapsed),
            delta
          });
          sendDelta(el, delta);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.lumina-track').forEach((el) => observer.observe(el));

  function sendDelta(el, amount, overrideTags = null, overrideGoals = null) {
    const parseTokens = (str = '') => (str || '')
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const tags = (overrideTags && overrideTags.length)
      ? overrideTags
      : parseTokens(el.getAttribute('data-lumina-tags') || el.getAttribute('data-lumina-tag') || '');

    const goals = (overrideGoals && overrideGoals.length)
      ? overrideGoals
      : parseTokens(el.getAttribute('data-lumina-goals') || el.getAttribute('data-lumina-goal') || '');

    if (!tags.length && !goals.length) return;

    const key = (el.dataset.luminaId || 'unknown') + ':' + Math.round(amount * 10);
    const now = Date.now();
    const last = seen.get(key) || 0;

    // Always count toward refresh signals; throttle merge writes
    maybeSoftRefresh(tags);
    console.log('[Lumina][sendDelta] payload', { tags, goals, key });

    if (now - last < 2000) {
      return;
    }
    seen.set(key, now);

    const payload = { delta: { tag: {}, goal: {} } };
    tags.forEach((t) => {
      payload.delta.tag[t] = (payload.delta.tag[t] || 0) + amount;
    });
    goals.forEach((g) => {
      payload.delta.goal[g] = (payload.delta.goal[g] || 0) + amount;
    });

    fetch('/api/preferences/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json().catch(() => ({})))
      .then(data => console.log('[Lumina][merge][ok]', data))
      .catch(err => console.warn('[Lumina][merge][error]', err));
  }

  function maybeSoftRefresh(tags = []) {
    if (tags.some(t => t === 'promo' || t === 'sale')) {
      promoSignalCount += 1;
    }
    if (Date.now() - lastRefresh < REFRESH_COOLDOWN_MS) return;
    if (promoSignalCount >= REFRESH_THRESHOLD) {
      softRefresh();
      promoSignalCount = 0;
      lastRefresh = Date.now();
    }
  }

  async function softRefresh() {
    try {
      const params = new URLSearchParams();
      params.set('pageType', pageType);
      if (productHandle) params.set('productHandle', productHandle);
      const res = await fetch('/api/page-refresh?' + params.toString(), {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) return;
      const data = await res.json();
      (data.slots || []).forEach(replaceSlot);
    } catch (err) {
      console.warn('[Lumina][softRefresh][error]', err);
    }
  }

  function replaceSlot(slot) {
    const { slotId, html, variantId } = slot;
    const container = document.querySelector(`.lumina-slot[data-slot-id=\"${slotId}\"]`);
    if (!container || !html) return;
    if (variantId && container.dataset.variantId === variantId) return;

    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    const next = temp.firstElementChild;
    if (!next) return;
    next.classList.add('lumina-slot-fade');
    container.replaceWith(next);
    reexecuteScripts(next);
  }

  function reexecuteScripts(root) {
    const scripts = root.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = oldScript.async;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      if (oldScript.type) newScript.type = oldScript.type;
      document.body.appendChild(newScript);
      oldScript.remove();
    });
  }
})();
