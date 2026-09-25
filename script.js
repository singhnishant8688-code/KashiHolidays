
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