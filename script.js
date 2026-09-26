document.addEventListener('DOMContentLoaded', () => {

  // ─── Side Drawer (Amazon-style) ───────────────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const sideNavbar = document.getElementById('side-navbar');
  const sideCloseBtn = document.getElementById('sideCloseBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    if (sideNavbar) sideNavbar.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
  }

  function closeDrawer() {
    if (window.innerWidth <= 992) {
      if (sideNavbar) sideNavbar.classList.remove('active');
      if (drawerOverlay) drawerOverlay.classList.remove('active');
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (sideCloseBtn) sideCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // ─── Smooth Scroll ────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeDrawer();
      }
    });
  });

  // ─── BOOKING FORM MODAL (Opens on "Book Now") ────────────────────────────
  const bookingFormModal = document.getElementById('bookingFormModal');
  const closeBookingFormBtn = document.getElementById('closeBookingFormBtn');

  function openBookingForm() {
    if (bookingFormModal) {
      bookingFormModal.classList.add('active');
      bookingFormModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingForm() {
    if (bookingFormModal) {
      bookingFormModal.classList.remove('active');
      bookingFormModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // All "Book Now" buttons open the booking form modal
  const bookNowBtn = document.getElementById('topBookBtn');
  if (bookNowBtn) bookNowBtn.addEventListener('click', openBookingForm);

  // Close on X button
  if (closeBookingFormBtn) closeBookingFormBtn.addEventListener('click', closeBookingForm);

  // Close on clicking dark overlay background
  if (bookingFormModal) {
    bookingFormModal.addEventListener('click', (e) => {
      if (e.target === bookingFormModal) closeBookingForm();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookingForm();
  });

  // Booking form service tabs
  const bfmTabs = document.querySelectorAll('.bfm-tab');
  bfmTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      bfmTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ─── INSTANT BOOKING MODAL (Call/WhatsApp popup) ─────────────────────────
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function openInstantModal() {
    if (bookingModal) {
      bookingModal.classList.add('active');
      bookingModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeInstantModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      bookingModal.setAttribute('aria-hidden', 'true');
    }
  }

  // Service Type Tabs in main page form open instant modal
  const tabBtns = document.querySelectorAll('.service-type-tabs .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      openInstantModal();
    });
  });

  // All Book Now buttons and booking triggers open the booking form modal
  document.querySelectorAll('.btn-cab-book, .cards-grid .btn-secondary, .open-booking-trigger, #heroBookBtn, #topBookBtn').forEach(el => {
    el.addEventListener('click', (e) => {
      openBookingForm();
    });
  });

  // Open instant call & whatsapp popup when user clicks navbar options (Car Booking, Travel Booking, Hotel Booking, Boat Booking)
  document.querySelectorAll('.side-nav-links .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        openInstantModal();
      }, 400);
    });
  });

  // Auto trigger Instant Call & WhatsApp popup after 5 seconds on site
  setTimeout(() => {
    if (bookingModal && !bookingFormModal?.classList.contains('active')) {
      openInstantModal();
    }
  }, 5000);

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeInstantModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeInstantModal();
    });
  }

});

// ─── Booking Form Modal WhatsApp Submission ───────────────────────────────
function submitBookingFormModal() {
  const activeTab = document.querySelector('.bfm-tab.active');
  const serviceType = activeTab ? activeTab.getAttribute('data-type') : 'One Way';

  const pickup   = document.getElementById('bfm-pickup')?.value || '';
  const drop     = document.getElementById('bfm-drop')?.value || '';
  const datetime = document.getElementById('bfm-datetime')?.value || '';
  const vehicle  = document.getElementById('bfm-vehicle')?.value || '';
  const name     = document.getElementById('bfm-name')?.value || '';
  const phone    = document.getElementById('bfm-phone')?.value || '';

  const msg =
    `*🚖 NEW TAXI BOOKING REQUEST (KashiHolidays)*\n\n` +
    `*Service Type:* ${serviceType}\n` +
    `*Vehicle:* ${vehicle}\n` +
    `*Pickup:* ${pickup}\n` +
    `*Drop:* ${drop}\n` +
    `*Date & Time:* ${datetime}\n` +
    `*Passenger Name:* ${name}\n` +
    `*Mobile:* ${phone}\n\n` +
    `Please calculate my fare & confirm booking!`;

  window.open(`https://wa.me/918858852339?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── Original form WhatsApp Submission ───────────────────────────────────
function submitTaxiBooking() {
  const activeTab = document.querySelector('.service-type-tabs .tab-btn.active');
  const serviceType = activeTab ? activeTab.getAttribute('data-type') : 'One Way';

  const pickup   = document.getElementById('pickup-location')?.value || '';
  const drop     = document.getElementById('drop-location')?.value || '';
  const datetime = document.getElementById('pickup-datetime')?.value || '';
  const vehicle  = document.getElementById('selected-vehicle')?.value || '';
  const name     = document.getElementById('passenger-name')?.value || '';
  const phone    = document.getElementById('passenger-phone')?.value || '';

  const msg =
    `*🚖 NEW TAXI BOOKING REQUEST (KashiHolidays)*\n\n` +
    `*Service Type:* ${serviceType}\n` +
    `*Vehicle:* ${vehicle}\n` +
    `*Pickup:* ${pickup}\n` +
    `*Drop:* ${drop}\n` +
    `*Date & Time:* ${datetime}\n` +
    `*Passenger Name:* ${name}\n` +
    `*Mobile:* ${phone}\n\n` +
    `Please calculate my fare & confirm booking!`;

  window.open(`https://wa.me/918858852339?text=${encodeURIComponent(msg)}`, '_blank');
}