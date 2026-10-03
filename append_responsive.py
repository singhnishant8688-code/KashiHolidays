import io

responsive_css = """

/* ==========================================================================
   RESPONSIVE DESIGN (TABLETS & MOBILE)
   ========================================================================== */

@media (max-width: 1024px) {
  .cab-cards-grid, .cards-grid, .testimonials-grid, .cab-features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.5rem;
  }
  
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .cab-cards-grid, .cards-grid, .testimonials-grid, .cab-features-grid {
    grid-template-columns: 1fr !important;
  }
  
  .bfm-fields-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .top-header-right {
    display: none; /* Might need to hide on very small screens, or rely on menu-toggle */
  }
  
  .menu-toggle {
    display: flex !important;
  }
  
  .hero-content {
    padding: 0 1rem;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-trust-bar {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  body {
    padding-top: 50px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }
  
  .btn-primary, .btn-secondary, .btn-cab-book, .btn-book-now {
    width: 100%;
    justify-content: center;
  }
}
"""

with io.open('style.css', 'a', encoding='utf-8') as f:
    f.write(responsive_css)

print("Appended responsive CSS successfully!")
