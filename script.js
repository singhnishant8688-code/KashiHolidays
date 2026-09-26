document.addEventListener('DOMContentLoaded', () => {

  const menuToggle = document.getElementById('menu-toggle');
  const sideNavbar = document.getElementById('side-navbar');
  const sideCloseBtn = document.getElementById('sideCloseBtn');
  const topBookBtn = document.getElementById('topBookBtn');

  // 1. Mobile Menu Toggle for Vertical Side Navbar
  if (menuToggle && sideNavbar) {
    menuToggle.addEventListener('click', () => {
      sideNavbar.classList.toggle('active');
    });
  }

  if (sideCloseBtn && sideNavbar) {
    sideCloseBtn.addEventListener('click', () => {
      sideNavbar.classList.remove('active');
    });
  }

  // 2. Smooth Scroll for Anchor Links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      if (targetId !== '#' && document.querySelector(targetId)) {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        if (sideNavbar && sideNavbar.classList.contains('active')) {
          sideNavbar.classList.remove('active');
        }
      }
    });
  });

  // 3. Instant Booking Modal Setup
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function openModal() {
    if (bookingModal) {
      bookingModal.classList.add('active');
      bookingModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      bookingModal.setAttribute('aria-hidden', 'true');
    }
  }

  // Open modal on top header "Book Now" button click
  if (topBookBtn) {
    topBookBtn.addEventListener('click', openModal);
  }

  // Service Type Tabs interactivity (triggers modal popup when changing tab)
  const tabBtns = document.querySelectorAll('.service-type-tabs .tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      openModal();
    });
  });

  // Open modal when user clicks ANY navigation menu item (Home, Car Booking, Travel Booking, Hotel Booking, etc.)
  const triggerElements = document.querySelectorAll(
    '.nav-link, .footer-links a, .cards-grid .btn-secondary, .btn-cab-book, .btn-primary'
  );

  triggerElements.forEach(el => {
    el.addEventListener('click', (e) => {
      openModal();
    });
  });

  // Close modal when 'X' button is clicked
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking dark overlay background
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

});

// Global WhatsApp Taxi Booking Submission
function submitTaxiBooking() {
  const activeTab = document.querySelector('.service-type-tabs .tab-btn.active');
  const serviceType = activeTab ? activeTab.getAttribute('data-type') : 'One Way';
  
  const pickup = document.getElementById('pickup-location')?.value || '';
  const drop = document.getElementById('drop-location')?.value || '';
  const datetime = document.getElementById('pickup-datetime')?.value || '';
  const vehicle = document.getElementById('selected-vehicle')?.value || '';
  const name = document.getElementById('passenger-name')?.value || '';
  const phone = document.getElementById('passenger-phone')?.value || '';

  const msg = `*🚖 NEW TAXI BOOKING REQUEST (KashiHolidays)*\n\n` +
              `*Service Type:* ${serviceType}\n` +
              `*Vehicle:* ${vehicle}\n` +
              `*Pickup:* ${pickup}\n` +
              `*Drop:* ${drop}\n` +
              `*Date & Time:* ${datetime}\n` +
              `*Passenger Name:* ${name}\n` +
              `*Mobile:* ${phone}\n\n` +
              `Please calculate my fare & confirm booking!`;

  const encodedMsg = encodeURIComponent(msg);
  const whatsappUrl = `https://wa.me/8858852339?text=${encodedMsg}`;
  
  window.open(whatsappUrl, '_blank');
}