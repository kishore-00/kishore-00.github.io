/* ===== ANTIGRAVITY PORTFOLIO — JAVASCRIPT ===== */
(function () {
  'use strict';

  /* ----- Particle Background Canvas ----- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += 0.02;
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x -= dx * 0.005;
        this.y -= dy * 0.005;
      }
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      const a = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 195, 247, ${a})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 195, 247, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  /* ----- Navbar Scroll Effect ----- */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  /* ----- Mobile Nav Toggle ----- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ----- Scroll Reveal (Intersection Observer) ----- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ----- Parallax on Scroll ----- */
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

  /* ----- Contact Form ----- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const origText = btn.textContent;
      btn.textContent = 'Message Sent! ✨';
      btn.style.background = 'linear-gradient(135deg, #66bb6a, #43a047)';
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  /* ----- Smooth Scroll for nav links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- GSAP Scroll Animations (if available) ----- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero content entrance
    gsap.from('.hero-content', {
      opacity: 0, y: 80, duration: 1.2, ease: 'power3.out', delay: 0.3
    });
    gsap.from('.hero-visual', {
      opacity: 0, x: 80, duration: 1.2, ease: 'power3.out', delay: 0.6
    });

    // Project cards staggered entrance
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 60 + i * 20, rotation: (i % 2 === 0 ? -2 : 2),
        duration: 0.9, ease: 'power3.out', delay: i * 0.15
      });
    });

    // About section
    gsap.from('.about-grid > *', {
      scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
      opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: 'power3.out'
    });

    // Contact section
    gsap.from('.contact-layout > *', {
      scrollTrigger: { trigger: '.contact-layout', start: 'top 80%' },
      opacity: 0, y: 40, stagger: 0.2, duration: 0.8, ease: 'power3.out'
    });
  }
})();
