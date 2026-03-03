// ===== DOM Elements =====
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileBackdrop = document.getElementById('mobileMenuBackdrop');
const typedTextElement = document.querySelector('.typed-text');
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');
const contactForm = document.getElementById('contactForm');

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
  // Remove loader if it exists (your HTML doesn't have one, but keeping for compatibility)
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1500);
  }
});

// ===== MOBILE MENU FUNCTIONALITY =====
class MobileMenu {
  constructor() {
    this.menuBtn = mobileMenuBtn;
    this.navMenu = navMenu;
    this.backdrop = mobileBackdrop;
    this.body = body;
    this.isOpen = false;

    if (!this.menuBtn || !this.navMenu) {
      console.warn('Mobile menu elements not found');
      return;
    }

    this.init();
  }

  init() {
    // Toggle menu on button click
    this.menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) this.closeMenu();
      });
    });

    // Close menu when clicking on backdrop
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => {
        if (this.isOpen) this.closeMenu();
      });
    }

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle window resize - close menu on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && this.isOpen) {
        this.closeMenu();
      }
    });

    // Set initial ARIA state
    this.menuBtn.setAttribute('aria-expanded', 'false');
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.menuBtn.classList.add('active');
    this.navMenu.classList.add('active');
    if (this.backdrop) this.backdrop.classList.add('active');
    this.body.classList.add('menu-open');
    this.menuBtn.setAttribute('aria-expanded', 'true');
    
    // Log for debugging
    console.log('Menu opened');
  }

  closeMenu() {
    this.isOpen = false;
    this.menuBtn.classList.remove('active');
    this.navMenu.classList.remove('active');
    if (this.backdrop) this.backdrop.classList.remove('active');
    this.body.classList.remove('menu-open');
    this.menuBtn.setAttribute('aria-expanded', 'false');
    
    // Log for debugging
    console.log('Menu closed');
  }
}

// ===== THEME TOGGLE =====
class ThemeManager {
  constructor() {
    this.themeToggle = themeToggle;
    if (!this.themeToggle) return;

    this.init();
  }

  init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      body.classList.add('light');
      this.themeToggle.setAttribute('aria-checked', 'true');
    }

    // Set initial icon colors
    this.updateIconColors();

    // Add click event
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    
    // Save preference
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Update ARIA
    this.themeToggle.setAttribute('aria-checked', isLight);
    
    // Update icon colors
    this.updateIconColors();
  }

  updateIconColors() {
    const sunIcon = this.themeToggle.querySelector('.fa-sun');
    const moonIcon = this.themeToggle.querySelector('.fa-moon');
    const isLight = body.classList.contains('light');
    
    if (sunIcon && moonIcon) {
      sunIcon.style.color = isLight ? '#fbbf24' : '#94a3b8';
      moonIcon.style.color = isLight ? '#94a3b8' : '#fff';
    }
  }
}

// ===== PARTICLE BACKGROUND SYSTEM =====
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) {
      console.warn('Particle canvas not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrame = null;
    
    this.init();
    this.animate();
    this.addEventListeners();
  }
  
  init() {
    this.resize();
    this.createParticles();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 12000);
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: `rgba(37, 99, 235, ${Math.random() * 0.3 + 0.1})`
      });
    }
  }
  
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Boundary check - wrap around
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      
      // Draw connections
      this.drawConnections(particle);
    });
  }
  
  drawConnections(particle) {
    this.particles.forEach(otherParticle => {
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 120) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / 120)})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(otherParticle.x, otherParticle.y);
        this.ctx.stroke();
      }
    });
  }
  
  animate() {
    this.drawParticles();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
  constructor() {
    this.element = typedTextElement;
    if (!this.element) return;

    this.phrases = [
      'Full Stack Web Developer',
      'IT Professional',
      'UI/UX Designer',
      'Mobile App Developer',
      'Problem Solver'
    ];
    
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.timeout = null;
    
    this.start();
  }

  start() {
    setTimeout(() => this.type(), 1000);
  }

  type() {
    const currentPhrase = this.phrases[this.phraseIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentPhrase.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentPhrase.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      this.isDeleting = true;
      this.timeout = setTimeout(() => this.type(), 2000);
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      this.timeout = setTimeout(() => this.type(), 500);
    } else {
      this.timeout = setTimeout(() => this.type(), this.isDeleting ? 50 : 100);
    }
  }

  destroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

// ===== ACTIVE NAV LINK ON SCROLL =====
class ScrollSpy {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = navLinks;
    
    if (!this.sections.length || !this.navLinks.length) return;
    
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.setActiveLink(), { passive: true });
    this.setActiveLink(); // Set initial state
  }

  setActiveLink() {
    let current = '';
    const scrollY = window.pageYOffset;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.classList.add('active');
      }
    });
  }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// ===== SKILLS FILTER =====
class SkillsFilter {
  constructor() {
    this.buttons = filterBtns;
    this.cards = skillCards;
    
    if (!this.buttons.length || !this.cards.length) return;
    
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => this.filter(btn));
    });
  }

  filter(activeBtn) {
    // Update active button
    this.buttons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
    
    const filter = activeBtn.dataset.filter;
    
    // Filter cards
    this.cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
}

// ===== ANIMATED COUNTERS =====
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }

  init() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounter(element) {
    const text = element.textContent;
    const target = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(target)) return;
    
    let current = 0;
    const increment = target / 100;
    const hasPlus = text.includes('+');
    const hasK = text.includes('K');
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        let displayValue = Math.floor(current);
        if (hasK) displayValue = displayValue + 'K';
        else if (hasPlus) displayValue = displayValue + '+';
        element.textContent = displayValue;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = text; // Restore original
      }
    };
    
    updateCounter();
  }
}

// ===== SCROLL REVEAL ANIMATION =====
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll(
      '.service-card, .case-card, .skill-card, .about-content, .about-stats, .contact-info, .contact-form, .footer-quote'
    );
    this.init();
  }

  init() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          
          // Special handling for quote icon
          if (entry.target.classList.contains('footer-quote')) {
            const icon = entry.target.querySelector('.quote-icon');
            if (icon) {
              icon.style.transform = 'rotate(0deg) scale(1)';
            }
          }
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      if (el.classList.contains('footer-quote')) {
        el.style.transform = 'translateY(30px) scale(0.95)';
      }
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      revealObserver.observe(el);
    });

    // Special handling for quote icon
    const quoteIcon = document.querySelector('.footer-quote .quote-icon');
    if (quoteIcon) {
      quoteIcon.style.transform = 'rotate(-10deg) scale(0.8)';
      quoteIcon.style.transition = 'all 0.8s ease 0.3s';
    }
  }
}

// ===== FORM HANDLING =====
class FormHandler {
  constructor() {
    this.form = contactForm;
    if (!this.form) return;
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add input event listeners to remove error styling
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    
    // Validate inputs
    inputs.forEach(input => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ef4444';
      }
    });
    
    if (isValid) {
      const button = this.form.querySelector('button');
      const originalText = button.innerHTML;
      const originalBg = button.style.background;
      
      // Show success state
      button.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
      button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      button.disabled = true;
      
      // Reset form
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = originalBg;
        button.disabled = false;
        this.form.reset();
      }, 3000);
    }
  }
}

// ===== 3D TILT EFFECT =====
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('.service-card, .case-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
      card.addEventListener('mouseleave', (e) => this.resetTilt(card));
    });
  }

  handleTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }

  resetTilt(card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }
}

// ===== FLOATING BADGES ANIMATION =====
class FloatingBadges {
  constructor() {
    this.badges = document.querySelectorAll('.badge');
    this.init();
  }

  init() {
    this.badges.forEach((badge, index) => {
      badge.style.animationDelay = `${index * 0.5}s`;
    });
  }
}

// ===== SOCIAL LINKS HOVER EFFECT =====
class SocialLinks {
  constructor() {
    this.links = document.querySelectorAll('.social-icon, .footer-social-link');
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px) scale(1.1)';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
      });
    });
  }
}

// ===== LOGO GLOW EFFECT =====
class LogoGlow {
  constructor() {
    this.logo = document.querySelector('.footer-logo');
    if (!this.logo) return;
    
    this.init();
  }

  init() {
    setInterval(() => {
      this.logo.style.boxShadow = '0 0 30px var(--electric-glow)';
      setTimeout(() => {
        this.logo.style.boxShadow = '0 10px 30px -5px var(--electric-glow)';
      }, 200);
    }, 3000);
  }
}

// ===== UPDATE COPYRIGHT YEAR =====
class CopyrightYear {
  constructor() {
    this.element = document.querySelector('.copyright');
    if (!this.element) return;
    
    this.update();
  }

  update() {
    const currentYear = new Date().getFullYear();
    this.element.innerHTML = this.element.innerHTML.replace(/202[0-9]/g, currentYear);
  }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing components...');
  
  // Initialize all components
  new MobileMenu();
  new ThemeManager();
  new ParticleSystem();
  new TypingAnimation();
  new ScrollSpy();
  new SmoothScroll();
  new SkillsFilter();
  new CounterAnimation();
  new ScrollReveal();
  new FormHandler();
  new TiltEffect();
  new FloatingBadges();
  new SocialLinks();
  new LogoGlow();
  new CopyrightYear();
  
  console.log('All components initialized');
});

// Handle any errors gracefully
window.addEventListener('error', (e) => {
  console.error('Error caught:', e.message);
});