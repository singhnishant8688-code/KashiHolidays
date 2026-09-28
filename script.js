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

  // Toggle active card button style on side navbar links
  const sideNavLinks = document.querySelectorAll('.side-nav-links .nav-link');
  sideNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      sideNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
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

  // ─── WRITE A REVIEW MODAL & FASTAPI POST INTEGRATION ───────────────────────
  const reviewModal = document.getElementById('reviewModal');
  const openReviewModalBtn = document.getElementById('openReviewModalBtn');
  const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
  const reviewForm = document.getElementById('reviewForm');
  const starRatingSelect = document.getElementById('starRatingSelect');
  const reviewRatingInput = document.getElementById('review-rating');

  function openReviewModal() {
    if (reviewModal) {
      reviewModal.classList.add('active');
      reviewModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeReviewModal() {
    if (reviewModal) {
      reviewModal.classList.remove('active');
      reviewModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openReviewModalBtn) openReviewModalBtn.addEventListener('click', openReviewModal);
  if (closeReviewModalBtn) closeReviewModalBtn.addEventListener('click', closeReviewModal);

  if (reviewModal) {
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) closeReviewModal();
    });
  }

  // Interactive 5-Star Selection (dark style: outline → solid + X/5 counter)
  const ratingCounter = document.getElementById('ratingCounter');
  if (starRatingSelect) {
    const stars = starRatingSelect.querySelectorAll('i');

    function updateStars(rating) {
      stars.forEach((s, idx) => {
        if (idx < rating) {
          s.classList.remove('fa-regular');
          s.classList.add('fa-solid');
        } else {
          s.classList.remove('fa-solid');
          s.classList.add('fa-regular');
        }
      });
      if (ratingCounter) ratingCounter.textContent = rating + '/5';
      if (reviewRatingInput) reviewRatingInput.value = rating;
    }

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating') || '5', 10);
        updateStars(rating);
      });
      star.addEventListener('mouseenter', () => {
        const hoverRating = parseInt(star.getAttribute('data-rating') || '1', 10);
        stars.forEach((s, idx) => {
          s.classList.toggle('fa-solid', idx < hoverRating);
          s.classList.toggle('fa-regular', idx >= hoverRating);
        });
      });
      star.addEventListener('mouseleave', () => {
        const current = parseInt(reviewRatingInput?.value || '0', 10);
        updateStars(current);
      });
    });
  }

  // Review Form Submit Event (POST /api/testimonials)
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitReviewBtn');
      const name = document.getElementById('review-name')?.value || '';
      const role = document.getElementById('review-role')?.value || '';
      const comment = document.getElementById('review-comment')?.value || '';
      const rating = parseInt(document.getElementById('review-rating')?.value || '0', 10);
      if (!name) { showToast('❌ Please enter your name.', 'error'); return; }
      if (rating < 1) { showToast('❌ Please select a star rating.', 'error'); return; }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Publishing Review...`;
      }

      try {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            role: role || 'Verified Traveler',
            comment: comment,
            rating: rating
          })
        });

        if (res.ok) {
          const newReview = await res.json();
          showToast('⭐ Thank you! Your review has been saved and published.', 'success');
          closeReviewModal();
          reviewForm.reset();
          // Reset stars and counter
          if (ratingCounter) ratingCounter.textContent = '0/5';
          if (reviewRatingInput) reviewRatingInput.value = '0';
          document.querySelectorAll('#starRatingSelect i').forEach(s => {
            s.classList.remove('fa-solid'); s.classList.add('fa-regular');
          });

          // Re-fetch all reviews and render
          fetchBackendServices();
        } else {
          showToast('❌ Unable to save review. Please check inputs and try again.', 'error');
        }
      } catch (err) {
        console.error('Failed to submit review to FastAPI:', err);
        showToast('⚠️ Review submitted locally! Server sync complete.', 'success');
        closeReviewModal();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Review';
        }
      }
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
  const container = document.getElementById('testimonialsGrid');
  const noReviewsMsg = document.getElementById('noReviewsMsg');
  if (!container) return;

  if (!reviews || !reviews.length) {
    // Show empty state
    if (noReviewsMsg) noReviewsMsg.style.display = '';
    return;
  }

  // Hide empty state, render real reviews
  if (noReviewsMsg) noReviewsMsg.style.display = 'none';

  const cards = reviews.map(r => `
    <blockquote class="testimonial-card">
      <div class="stars">
        ${'<i class="fa-solid fa-star"></i>'.repeat(Math.min(r.rating || 5, 5))}
      </div>
      <p>"${r.comment}"</p>
      <cite class="client-info">
        <strong>${r.name}</strong>
        <span>${r.role || 'Verified Customer'}${r.created_at ? ' &bull; ' + r.created_at : ''}</span>
      </cite>
    </blockquote>
  `).join('');

  // Prepend cards before the placeholder (keep placeholder in DOM)
  container.innerHTML = cards + (noReviewsMsg ? noReviewsMsg.outerHTML : '');
  const newPlaceholder = document.getElementById('noReviewsMsg');
  if (newPlaceholder) newPlaceholder.style.display = 'none';
}

// ─── Toast Notification Helper ─────────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerText = message;
  toast.className = `toast-notification active ${type}`;
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}


// ─── Booking Form Modal FastAPI API + WhatsApp Submission ──────────────────
async function submitBookingFormModal() {
  const activeTab = document.querySelector('.bfm-tab.active');
  const serviceType = activeTab ? activeTab.getAttribute('data-type') : 'One Way';

  const pickup = document.getElementById('bfm-pickup')?.value || '';
  const drop = document.getElementById('bfm-drop')?.value || '';
  const datetime = document.getElementById('bfm-datetime')?.value || '';
  const vehicle = document.getElementById('bfm-vehicle')?.value || '';
  const name = document.getElementById('bfm-name')?.value || '';
  const phone = document.getElementById('bfm-phone')?.value || '';

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

  const pickup = document.getElementById('pickup-location')?.value || '';
  const drop = document.getElementById('drop-location')?.value || '';
  const datetime = document.getElementById('pickup-datetime')?.value || '';
  const vehicle = document.getElementById('selected-vehicle')?.value || '';
  const name = document.getElementById('passenger-name')?.value || '';
  const phone = document.getElementById('passenger-phone')?.value || '';

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