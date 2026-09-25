
document.addEventListener('DOMContentLoaded', () => {


  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');


      const isExpanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }


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

        
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

});
// Example: Fetching destinations dynamically from your backend
async function fetchDestinations() {
  try {
    const response = await fetch('http://localhost:5000/api/destinations');
    const data = await response.json();
    console.log('Destinations from Server:', data);
    // Dynamically insert cards into HTML grid here
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDestinations();