/**
 * SAFI AHMAD - CYBERNETIC ZERO-SCROLL CV & PORTFOLIO
 * Vanilla JavaScript Controller (Single-Page Zero-Scroll Dashboard)
 * Cross-Device Strict Zero-Scroll Architecture:
 * Responsive Tab Switching (Desktop & Mobile), Sub-Category Selectors,
 * Mobile Touch-Swipe Gestures, Keyboard Shortcuts (1-5 & Arrows),
 * Clipboard Engine, Interactive Contact Form & Mouse Spotlight.
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // -------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const tabOrder = ['profile', 'overview', 'experience', 'skills', 'contact'];
  const emailAddress = 'safiahmad.dev@gmail.com';

  const sidebarCopyBtn = document.getElementById('sidebar-copy-email');
  const tabCopyBtn = document.getElementById('btn-copy-email-tab');
  const tabCopyText = document.getElementById('copy-text-tab');
  
  const sidebarContactBtn = document.getElementById('sidebar-action-contact');
  const sidebarDownloadBtn = document.getElementById('sidebar-action-download');
  const headerResumeBtn = document.getElementById('header-btn-resume');
  const brandHomeLink = document.getElementById('brand-home-link');
  const contactTabOverviewBtn = document.getElementById('contact-tab-overview-btn');

  const contactForm = document.getElementById('tab-contact-form');
  const submitBtn = document.getElementById('btn-submit-tab-form');
  const submitText = document.getElementById('tab-submit-text');
  const formToast = document.getElementById('tab-form-toast');
  const interactivePanels = document.querySelectorAll('.glass-panel');

  // Mobile Sub-category Switchers
  const skillSwitchBtns = document.querySelectorAll('.skill-switch-btn');
  const skillColCards = document.querySelectorAll('.skill-col-card');
  const contactSwitchBtns = document.querySelectorAll('.contact-switch-btn');
  const contactLeftCard = document.querySelector('.contact-left-card');
  const contactRightCard = document.querySelector('.contact-right-card');

  // -------------------------------------------------------------------------
  // 01. ZERO-SCROLL TAB SWITCHING ENGINE
  // -------------------------------------------------------------------------
  function switchTab(tabId) {
    if (!tabOrder.includes(tabId)) return;

    // On desktop, the profile sidebar is pinned on the left; route 'profile' tab to 'overview'
    const isDesktop = window.innerWidth > 820;
    if (isDesktop && tabId === 'profile') {
      tabId = 'overview';
    }

    // Set high-performance CSS selector attribute on body
    document.body.setAttribute('data-active-tab', tabId);

    // Update active tab buttons
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Update active tab panes
    tabPanes.forEach(pane => {
      const isTarget = pane.id === `pane-${tabId}`;
      pane.classList.toggle('active', isTarget);
      if (isTarget) {
        pane.scrollTop = 0; // Strictly maintain top zero scroll
      }
    });

    // Update URL hash without scrolling page
    history.replaceState(null, null, `#${tabId}`);
  }

  // Attach click listeners to all primary tab buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Brand link resets to home (Profile on mobile, Overview on desktop)
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultTab = window.innerWidth <= 820 ? 'profile' : 'overview';
      switchTab(defaultTab);
    });
  }

  // Contact tab link to Overview
  if (contactTabOverviewBtn) {
    contactTabOverviewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('overview');
    });
  }

  // Sidebar "Send Message" action switches to Contact tab & focuses input
  if (sidebarContactBtn) {
    sidebarContactBtn.addEventListener('click', () => {
      switchTab('contact');
      // Ensure form view is active on mobile
      activateContactPanel('form');
      setTimeout(() => {
        const nameInput = document.getElementById('msg-name');
        if (nameInput) nameInput.focus();
      }, 150);
    });
  }

  // -------------------------------------------------------------------------
  // 02. MOBILE SUB-CATEGORY SWITCHERS (SKILLS & CONTACT)
  // -------------------------------------------------------------------------
  function activateSkillPanel(panelId) {
    skillSwitchBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-skill-tab') === panelId);
    });
    skillColCards.forEach(card => {
      card.classList.toggle('active-mobile-skill', card.getAttribute('data-skill-panel') === panelId);
    });
  }

  skillSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-skill-tab');
      activateSkillPanel(target);
    });
  });

  function activateContactPanel(panelId) {
    contactSwitchBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-contact-tab') === panelId);
    });
    if (contactLeftCard) {
      contactLeftCard.classList.toggle('active-mobile-contact', panelId === 'info');
    }
    if (contactRightCard) {
      contactRightCard.classList.toggle('active-mobile-contact', panelId === 'form');
    }
  }

  contactSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-contact-tab');
      activateContactPanel(target);
    });
  });

  // -------------------------------------------------------------------------
  // 03. MOBILE TOUCH-SWIPE ENGINE (ZERO-SCROLL GESTURES)
  // -------------------------------------------------------------------------
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Detect intentional horizontal swipe (at least 45px and predominantly horizontal)
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      const isMobile = window.innerWidth <= 820;
      const activeTabsList = isMobile ? tabOrder : tabOrder.filter(t => t !== 'profile');
      
      const currentActiveBtn = document.querySelector('.tab-btn.active');
      const currentTab = currentActiveBtn ? currentActiveBtn.getAttribute('data-tab') : (isMobile ? 'profile' : 'overview');
      const currentIndex = activeTabsList.indexOf(currentTab);

      if (currentIndex !== -1) {
        if (diffX < 0) {
          // Swiped Left -> Move to Next Tab
          const nextIndex = (currentIndex + 1) % activeTabsList.length;
          switchTab(activeTabsList[nextIndex]);
        } else {
          // Swiped Right -> Move to Previous Tab
          const prevIndex = (currentIndex - 1 + activeTabsList.length) % activeTabsList.length;
          switchTab(activeTabsList[prevIndex]);
        }
      }
    }
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 04. KEYBOARD SHORTCUTS (KEYS 1-5 & ARROW KEYS)
  // -------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    if (isInputFocused) return;

    const isMobile = window.innerWidth <= 820;
    const availableTabs = isMobile ? tabOrder : ['overview', 'experience', 'skills', 'contact'];

    // Keys 1 to 5
    if (e.key >= '1' && e.key <= String(availableTabs.length)) {
      const index = parseInt(e.key, 10) - 1;
      if (availableTabs[index]) {
        switchTab(availableTabs[index]);
      }
    }

    // Arrow Left & Right navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const currentActiveBtn = document.querySelector('.tab-btn.active');
      const currentTab = currentActiveBtn ? currentActiveBtn.getAttribute('data-tab') : availableTabs[0];
      const currentIndex = availableTabs.indexOf(currentTab);

      if (currentIndex !== -1) {
        if (e.key === 'ArrowRight') {
          const nextIndex = (currentIndex + 1) % availableTabs.length;
          switchTab(availableTabs[nextIndex]);
        } else {
          const prevIndex = (currentIndex - 1 + availableTabs.length) % availableTabs.length;
          switchTab(availableTabs[prevIndex]);
        }
      }
    }
  });

  // -------------------------------------------------------------------------
  // 05. CLIPBOARD COPY ENGINE
  // -------------------------------------------------------------------------
  async function copyEmail(buttonEl, labelEl) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        const temp = document.createElement('textarea');
        temp.value = emailAddress;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }

      if (labelEl) labelEl.textContent = 'Copied!';
      if (buttonEl) buttonEl.classList.add('copied');

      setTimeout(() => {
        if (labelEl) labelEl.textContent = 'Copy';
        if (buttonEl) buttonEl.classList.remove('copied');
      }, 2500);
    } catch (err) {
      if (labelEl) labelEl.textContent = 'Copied!';
      setTimeout(() => {
        if (labelEl) labelEl.textContent = 'Copy';
      }, 2500);
    }
  }

  if (tabCopyBtn) {
    tabCopyBtn.addEventListener('click', () => {
      copyEmail(tabCopyBtn, tabCopyText);
    });
  }

  if (sidebarCopyBtn) {
    sidebarCopyBtn.addEventListener('click', () => {
      const originalText = sidebarCopyBtn.textContent;
      sidebarCopyBtn.textContent = 'Copied!';
      copyEmail(sidebarCopyBtn, null);
      setTimeout(() => {
        sidebarCopyBtn.textContent = originalText;
      }, 2000);
    });
  }

  // -------------------------------------------------------------------------
  // 06. RESUME DOWNLOAD ACTION HANDLERS
  // -------------------------------------------------------------------------
  const resumeButtons = [sidebarDownloadBtn, headerResumeBtn];
  resumeButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        window.print();
      });
    }
  });

  // -------------------------------------------------------------------------
  // 07. INTERACTIVE CONTACT FORM DISPATCH
  // -------------------------------------------------------------------------
  if (contactForm && submitBtn && submitText && formToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';

      setTimeout(() => {
        submitText.textContent = 'Sent';
        formToast.classList.add('visible');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitText.textContent = 'Send Message';
          formToast.classList.remove('visible');
        }, 3500);
      }, 700);
    });
  }

  // -------------------------------------------------------------------------
  // 08. DYNAMIC MOUSE-TRACKING SPOTLIGHT (DESKTOP)
  // -------------------------------------------------------------------------
  interactivePanels.forEach(panel => {
    panel.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 820) return; // Save GPU cycles on mobile
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      panel.style.background = `radial-gradient(circle 260px at ${x}px ${y}px, rgba(0, 242, 254, 0.08), rgba(22, 27, 34, 0.78) 70%)`;
    });

    panel.addEventListener('mouseleave', () => {
      panel.style.background = '';
    });
  });

  // -------------------------------------------------------------------------
  // 09. WINDOW RESIZE SYNC (SEAMLESS ADAPTATION)
  // -------------------------------------------------------------------------
  window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth > 820;
    const currentActiveBtn = document.querySelector('.tab-btn.active');
    const currentTab = currentActiveBtn ? currentActiveBtn.getAttribute('data-tab') : 'overview';

    // If expanding to desktop and active tab was 'profile', seamlessly switch to 'overview'
    if (isDesktop && currentTab === 'profile') {
      switchTab('overview');
    }
  });

  // -------------------------------------------------------------------------
  // 10. INITIALIZATION: URL HASH OR SMART DEVICE DEFAULT
  // -------------------------------------------------------------------------
  const initialHash = window.location.hash.replace('#', '').toLowerCase();
  if (tabOrder.includes(initialHash)) {
    switchTab(initialHash);
  } else {
    // On mobile devices default to 'profile' (bio & identity hero), on desktop default to 'overview'
    const defaultTab = window.innerWidth <= 820 ? 'profile' : 'overview';
    switchTab(defaultTab);
  }

});
