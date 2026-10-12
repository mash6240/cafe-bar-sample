/* =====================================================
   夜カフェ＆バー 雫（架空）- 店舗サイト サンプル
   ===================================================== */
(() => {
  'use strict';

  const OPEN_HOUR = 19;   // 19:00 開店
  const CLOSE_HOUR = 2;   // 26:00（翌2:00）閉店
  const HOLIDAY = 2;      // 火曜定休（0=日曜）

  /* ----- 営業状況の表示 ----- */
  const statusEl = document.querySelector('[data-status]');
  const updateStatus = () => {
    if (!statusEl) return;
    const now = new Date();
    const h = now.getHours();
    const today = now.getDay();
    const yesterday = (today + 6) % 7;
    let text;
    let state = '';

    if (h >= OPEN_HOUR && today !== HOLIDAY) {
      text = 'ただいま営業中｜26:00まで';
      state = 'is-open';
    } else if (h < CLOSE_HOUR && yesterday !== HOLIDAY) {
      text = 'ただいま営業中｜26:00まで';
      state = 'is-open';
    } else if (today === HOLIDAY) {
      text = '本日は定休日です（火曜定休）';
      state = 'is-closed-day';
    } else {
      text = '本日 19:00 OPEN';
    }
    statusEl.classList.remove('is-open', 'is-closed-day');
    if (state) statusEl.classList.add(state);
    statusEl.querySelector('.js-status-text').textContent = text;
  };
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ----- ヘッダー ----- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- ハンバーガーメニュー（タブレット・SP） ----- */
  const hamburger = document.querySelector('.hamburger');
  const gnav = document.getElementById('gnav');
  const setMenu = (open) => {
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    gnav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  };
  hamburger.addEventListener('click', () => {
    setMenu(hamburger.getAttribute('aria-expanded') !== 'true');
  });
  gnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gnav.classList.contains('is-open')) {
      setMenu(false);
      hamburger.focus();
    }
  });
  // PC幅に戻ったらメニューを閉じる
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  /* ----- SP固定ボタン：ヒーローを過ぎたら表示、予約フォーム表示中は隠す ----- */
  const fixedCta = document.getElementById('fixedCta');
  const hero = document.querySelector('.hero');
  const reserve = document.getElementById('reserve');
  if ('IntersectionObserver' in window) {
    let heroVisible = true;
    let reserveVisible = false;
    const render = () => fixedCta.classList.toggle('is-show', !heroVisible && !reserveVisible);
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      render();
    }, { rootMargin: '0px 0px -50% 0px' }).observe(hero);
    new IntersectionObserver(([entry]) => {
      reserveVisible = entry.isIntersecting;
      render();
    }).observe(reserve);

    /* ----- フェードイン ----- */
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.js-fade').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.js-fade').forEach((el) => el.classList.add('is-visible'));
  }

  /* ----- メニューのタブ切り替え（キーボード操作対応） ----- */
  const tabs = [...document.querySelectorAll('.menu__tab')];
  const selectTab = (tab, focus = true) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab, false));
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        selectTab(tabs[(i + keys[e.key] + tabs.length) % tabs.length]);
      } else if (e.key === 'Home') {
        e.preventDefault();
        selectTab(tabs[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        selectTab(tabs[tabs.length - 1]);
      }
    });
  });

  /* ----- ギャラリーのライトボックス ----- */
  const lightbox = document.getElementById('lightbox');
  const items = [...document.querySelectorAll('.gallery__item')];
  if (lightbox && typeof lightbox.showModal === 'function') {
    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbCap = lightbox.querySelector('.lightbox__caption');
    let current = 0;
    let opener = null;
    const show = (index) => {
      current = (index + items.length) % items.length;
      const img = items[current].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = `${img.alt}（${current + 1} / ${items.length}）`;
    };
    items.forEach((item, i) => {
      item.setAttribute('aria-label', `${item.querySelector('img').alt}を拡大表示`);
      item.addEventListener('click', () => {
        opener = item;
        show(i);
        lightbox.showModal();
        document.body.classList.add('is-locked');
      });
    });
    lightbox.querySelector('.lightbox__btn--prev').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('.lightbox__btn--next').addEventListener('click', () => show(current + 1));
    lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
    // 背景（写真の外側）をクリックしたら閉じる
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      if (opener) opener.focus();
    });
  }

  /* ----- サンプル用リンク ----- */
  const toast = document.getElementById('toast');
  let toastTimer;
  document.querySelectorAll('.js-dummy').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      toast.textContent = 'サンプルサイトのため、リンク先はありません';
      toast.classList.add('is-show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2400);
    });
  });

  /* ----- 予約フォーム（サンプルのため送信はしない） ----- */
  const form = document.getElementById('reserveForm');
  if (!form) return;

  const toISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  // Web予約は前日まで → 明日以降のみ選択可能
  const dateInput = document.getElementById('r-date');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = toISO(tomorrow);

  const rules = {
    'r-date': (v) => {
      if (!v) return 'ご来店日を選択してください';
      if (v < dateInput.min) return 'Webでのご予約は前日までとなります';
      const [y, m, d] = v.split('-').map(Number);
      if (new Date(y, m - 1, d).getDay() === HOLIDAY) return '火曜日は定休日です。別の日をお選びください';
      return '';
    },
    'r-time': (v) => (v ? '' : 'お時間を選択してください'),
    'r-people': (v) => (v ? '' : '人数を選択してください'),
    'r-name': (v) => (v.trim() ? '' : 'お名前を入力してください'),
    'r-tel': (v) => {
      if (!v.trim()) return '電話番号を入力してください';
      const digits = v.replace(/[^\d０-９]/g, '');
      if (digits.length < 10 || digits.length > 11) return '電話番号は10〜11桁で入力してください';
      return '';
    },
  };

  const validateField = (id) => {
    const input = document.getElementById(id);
    const errorEl = form.querySelector(`[data-error-for="${id}"]`);
    const message = rules[id](input.value);
    errorEl.id = errorEl.id || `${id}-error`;
    errorEl.textContent = message;
    input.classList.toggle('is-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) {
      input.setAttribute('aria-describedby', errorEl.id);
    } else {
      input.removeAttribute('aria-describedby');
    }
    return !message;
  };

  Object.keys(rules).forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener(input.tagName === 'SELECT' || input.type === 'date' ? 'change' : 'blur', () => validateField(id));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(id);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) {
      form.querySelector('.is-error').focus();
      return;
    }
    const done = document.getElementById('reserveDone');
    form.querySelector('.form__submit').disabled = true;
    done.hidden = false;
    done.focus();
  });
})();
