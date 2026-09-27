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

  // Top header, hero & cab rate buttons open the booking form modal
  document.querySelectorAll('.btn-cab-book, .open-booking-trigger, #heroBookBtn, #topBookBtn').forEach(el => {
    el.addEventListener('click', (e) => {
      openBookingForm();
    });
  });

  // Card "Book Now" buttons open WhatsApp directly with specific package details
  document.querySelectorAll('.cards-grid .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.card');
      const title = card ? (card.querySelector('h3')?.innerText || 'Tour Package') : 'Tour Package';
      const price = card ? (card.querySelector('.badge')?.innerText || '') : '';

      const msg =
        `*🚖 NEW BOOKING INQUIRY (KashiHolidays)*\n\n` +
        `*Package:* ${title}\n` +
        (price ? `*Price:* ${price}\n` : '') +
        `\nHi KashiHolidays, I want to book the ${title} package. Please share availability & booking details!`;

      window.open(`https://wa.me/918858852339?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  // ─── DYNAMIC PACKAGE CATEGORY FILTERING ──────────────────────────────────
  const filterBtns = document.querySelectorAll('.category-filter-bar .filter-btn');
  const destinationCards = document.querySelectorAll('#destinations .cards-grid .card');

  function filterPackages(category) {
    if (!category) category = 'all';

    // Update filter buttons active state
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show / Hide matching cards smoothly
    destinationCards.forEach(card => {
      const cardCat = card.getAttribute('data-category') || '';
      if (category === 'all' || cardCat.includes(category)) {
        card.style.display = 'flex';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 250);
      }
    });
  }

  // Event listener for filter bar buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterPackages(cat);
    });
  });

  // Event listener for Side Drawer & Nav links with data-filter
  document.querySelectorAll('a[data-filter]').forEach(link => {
    link.addEventListener('click', () => {
      const cat = link.getAttribute('data-filter');
      if (cat) {
        filterPackages(cat);
      }
    });
  });

  // Auto trigger Instant Call & WhatsApp popup after 5 seconds on site
  setTimeout(() => {
    if (bookingModal && !bookingFormModal?.classList.contains('active')) {
      openInstantModal();
    }
  }, 8000);

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeInstantModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeInstantModal();
    });
  }

  // ─── Fetch API Verification on Page Load ─────────────────────────────────
  fetchBackendServices();
});


// ─── Fetch Backend Fleet & Real Customer Reviews ───────────────────────────
async function fetchBackendServices() {
  try {
    const res = await fetch('/api/testimonials');
    if (res.ok) {
      const reviews = await res.json();
      renderTestimonials(reviews);
    }
  } catch (err) {
    console.log('FastAPI backend offline or static mode:', err);
  }
}

function renderTestimonials(reviews) {
  const container = document.querySelector('.testimonials-grid');
  if (!container || !reviews || !reviews.length) return;

  container.innerHTML = reviews.map(r => `
    <blockquote class="testimonial-card">
      <div class="stars">
        ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating || 5)}
      </div>
      <p>"${r.comment}"</p>
      <cite class="client-info">
        <strong>${r.name}</strong>
        <span>${r.role || 'Verified Customer'}</span>
      </cite>
    </blockquote>
  `).join('');
}


// ─── Booking Form Modal FastAPI API + WhatsApp Submission ──────────────────
async function submitBookingFormModal() {
  const activeTab = document.querySelector('.bfm-tab.active');
  const serviceType = activeTab ? activeTab.getAttribute('data-type') : 'One Way';

  const pickup   = document.getElementById('bfm-pickup')?.value || '';
  const drop     = document.getElementById('bfm-drop')?.value || '';
  const datetime = document.getElementById('bfm-datetime')?.value || '';
  const vehicle  = document.getElementById('bfm-vehicle')?.value || '';
  const name     = document.getElementById('bfm-name')?.value || '';
  const phone    = document.getElementById('bfm-phone')?.value || '';

  const submitBtn = document.querySelector('.bfm-submit-btn');
  const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Booking...`;
  }

  const payload = {
    service_type: serviceType,
    pickup_location: pickup,
    drop_location: drop,
    pickup_datetime: datetime,
    vehicle: vehicle,
    name: name,
    phone: phone
  };

  try {
    // 🔥 Send fetch() POST request to FastAPI endpoint
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      console.log('✅ Booking created successfully via FastAPI:', data);

      if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Booking ${data.id} Created (${data.estimated_fare})! Opening WhatsApp...`;
      }

      setTimeout(() => {
        if (data.whatsapp_link) {
          window.open(data.whatsapp_link, '_blank');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        }
      }, 1200);
      return;
    }
  } catch (err) {
    console.warn('Backend API request skipped, falling back to direct WhatsApp link:', err);
  }

  // Fallback if API server is offline
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
  }

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


// ─── Original form FastAPI API + WhatsApp Submission ──────────────────────
async function submitTaxiBooking() {
  const activeTab = document.querySelector('.service-type-tabs .tab-btn.active');
  const serviceType = activeTab ? activeTab.getAttribute('data-type') : 'One Way';

  const pickup   = document.getElementById('pickup-location')?.value || '';
  const drop     = document.getElementById('drop-location')?.value || '';
  const datetime = document.getElementById('pickup-datetime')?.value || '';
  const vehicle  = document.getElementById('selected-vehicle')?.value || '';
  const name     = document.getElementById('passenger-name')?.value || '';
  const phone    = document.getElementById('passenger-phone')?.value || '';

  const payload = {
    service_type: serviceType,
    pickup_location: pickup,
    drop_location: drop,
    pickup_datetime: datetime,
    vehicle: vehicle,
    name: name,
    phone: phone
  };

  try {
    // 🔥 Send fetch() POST request to FastAPI endpoint
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.whatsapp_link) {
        window.open(data.whatsapp_link, '_blank');
        return;
      }
    }
  } catch (err) {
    console.warn('Backend API request skipped, falling back to direct WhatsApp link:', err);
  }

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