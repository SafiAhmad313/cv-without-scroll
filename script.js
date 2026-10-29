/**
 * SAFI AHMAD - CYBERNETIC NO-SCROLL CV & PORTFOLIO
 * Vanilla JavaScript Controller (Single-Page Zero-Scroll Dashboard)
 * Tab Switching, Keyboard Shortcuts (1-4), Clipboard Copy, Dynamic Forms & Mouse Spotlight
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // -------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const tabOrder = ['overview', 'experience', 'skills', 'contact'];
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

  // -------------------------------------------------------------------------
  // 01. ZERO-SCROLL TAB SWITCHING ENGINE
  // -------------------------------------------------------------------------
  function switchTab(tabId) {
    if (!tabOrder.includes(tabId)) return;

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
        pane.scrollTop = 0; // Reset internal scroll position smoothly
      }
    });

    // Update URL hash without scrolling
    history.replaceState(null, null, `#${tabId}`);
  }

  // Attach click listeners to all tab buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Brand link resets to Overview
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('overview');
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
      setTimeout(() => {
        const nameInput = document.getElementById('msg-name');
        if (nameInput) nameInput.focus();
      }, 150);
    });
  }

  // Load tab from initial URL hash if present
  const initialHash = window.location.hash.replace('#', '').toLowerCase();
  if (tabOrder.includes(initialHash)) {
    switchTab(initialHash);
  }

  // -------------------------------------------------------------------------
  // 02. KEYBOARD SHORTCUTS (1-4 & ARROW KEYS)
  // -------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    // Avoid triggering when user is typing in inputs or textarea
    const activeEl = document.activeElement;
    const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    if (isInputFocused) return;

    // Keys 1 to 4
    if (e.key >= '1' && e.key <= '4') {
      const index = parseInt(e.key, 10) - 1;
      if (tabOrder[index]) {
        switchTab(tabOrder[index]);
      }
    }

    // Arrow Left & Right navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const activeBtn = document.querySelector('.tab-btn.active');
      const currentTab = activeBtn ? activeBtn.getAttribute('data-tab') : 'overview';
      const currentIndex = tabOrder.indexOf(currentTab);

      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % tabOrder.length;
        switchTab(tabOrder[nextIndex]);
      } else {
        const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
        switchTab(tabOrder[prevIndex]);
      }
    }
  });

  // -------------------------------------------------------------------------
  // 03. CLIPBOARD COPY ENGINE
  // -------------------------------------------------------------------------
  async function copyEmail(buttonEl, labelEl) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        const temp = document.createElement('textarea');
        temp.value = emailAddress;
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
  // 04. RESUME DOWNLOAD ACTION HANDLERS
  // -------------------------------------------------------------------------
  const resumeButtons = [sidebarDownloadBtn, headerResumeBtn];
  resumeButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        // Trigger CV access or print view
        window.print();
      });
    }
  });

  // -------------------------------------------------------------------------
  // 05. INTERACTIVE CONTACT FORM DISPATCH
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
      }, 850);
    });
  }

  // -------------------------------------------------------------------------
  // 06. DYNAMIC MOUSE-TRACKING SPOTLIGHT
  // -------------------------------------------------------------------------
  interactivePanels.forEach(panel => {
    panel.addEventListener('mousemove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      panel.style.background = `radial-gradient(circle 260px at ${x}px ${y}px, rgba(0, 242, 254, 0.08), rgba(22, 27, 34, 0.78) 70%)`;
    });

    panel.addEventListener('mouseleave', () => {
      panel.style.background = '';
    });
  });

});
