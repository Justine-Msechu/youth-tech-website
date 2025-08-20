// js/main.js
(function () {
    'use strict';
  
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  
    document.addEventListener('DOMContentLoaded', () => {
      setupMobileNav();
      highlightActiveLink();
      enhanceNavbarOnScroll();
      enableSmoothAnchors();
      wireForms();
      revealOnScroll();
    });
  
    /* ---------------------------
       Mobile nav (hamburger)
    --------------------------- */
    function setupMobileNav() {
      const hamburger = $('.hamburger');
      const navMenu = $('.nav-menu');
  
      if (!hamburger || !navMenu) return;
  
      // A11y
      hamburger.setAttribute('role', 'button');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-controls', 'primary-nav');
  
      // Ensure an id exists for aria-controls
      if (!navMenu.id) navMenu.id = 'primary-nav';
  
      const closeMenu = () => {
        navMenu.dataset.open = 'false';
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        // Use inline styles so we don’t need extra CSS for the mobile state
        navMenu.style.display = '';
        navMenu.style.flexDirection = '';
        navMenu.style.gap = '';
      };
  
      const openMenu = () => {
        navMenu.dataset.open = 'true';
        hamburger.classList.add('is-active');
        hamburger.setAttribute('aria-expanded', 'true');
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.gap = '1rem';
      };
  
      const toggleMenu = () => {
        (navMenu.dataset.open === 'true') ? closeMenu() : openMenu();
      };
  
      hamburger.addEventListener('click', toggleMenu);
  
      // Close when a link is clicked (mobile)
      $$('.nav-menu a').forEach(a => {
        a.addEventListener('click', () => {
          if (window.innerWidth <= 768 && navMenu.dataset.open === 'true') {
            closeMenu();
          }
        });
      });
  
      // Reset inline styles on resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          navMenu.style.display = 'flex';
          navMenu.style.flexDirection = '';
          navMenu.style.gap = '';
          navMenu.dataset.open = 'false';
          hamburger.classList.remove('is-active');
          hamburger.setAttribute('aria-expanded', 'false');
        } else if (navMenu.dataset.open !== 'true') {
          navMenu.style.display = ''; // let CSS hide it at <=768
        }
      });
    }
  
    /* ---------------------------
       Active nav link by URL
    --------------------------- */
    function highlightActiveLink() {
      const links = $$('.nav-link');
      if (!links.length) return;
  
      // Normalize current path to the file name (index.html, about.html, etc.)
      const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  
      links.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        // Works with relative paths (../index.html, pages/about.html, etc.)
        if (href && href.endsWith(path)) {
          link.classList.add('active');
        }
      });
    }
  
    /* ---------------------------
       Navbar shadow on scroll
    --------------------------- */
    function enhanceNavbarOnScroll() {
      const navbar = $('.navbar');
      if (!navbar) return;
  
      const applyShadow = () => {
        if (window.scrollY > 10) {
          navbar.style.boxShadow = '0 4px 14px rgba(0,0,0,.12)';
        } else {
          navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,.10)';
        }
      };
  
      applyShadow();
      window.addEventListener('scroll', applyShadow, { passive: true });
    }
  
    /* ---------------------------
       Smooth in-page anchors
    --------------------------- */
    function enableSmoothAnchors() {
      const anchors = $$('a[href^="#"]');
      if (!anchors.length) return;
  
      anchors.forEach(a => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href').slice(1);
          const target = id ? document.getElementById(id) : null;
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  
    /* ---------------------------
       Basic form validation
    --------------------------- */
    function wireForms() {
      const forms = $$('form');
      if (!forms.length) return;
  
      forms.forEach(form => {
        // Respect server action, just help with HTML5 validation
        form.addEventListener('submit', (e) => {
          if (!form.checkValidity()) {
            e.preventDefault();
            form.reportValidity();
          }
        });
      });
    }



    document.addEventListener('DOMContentLoaded', () => {
      const mount = document.getElementById('site-footer');
      if (!mount) return;
    
      // Fallback source if attribute missing
      let src = mount.getAttribute('data-footer-src');
      if (!src) {
        src = location.pathname.includes('/pages/')
          ? '../includes/footer.html'
          : 'includes/footer.html';
      }
    
      fetch(src, { cache: 'no-cache' })
        .then(async (r) => {
          const text = await r.text();
          if (!r.ok) throw new Error(`HTTP ${r.status} for ${src}`);
          return text;
        })
        .then((html) => {
          // robust insert using <template>
          const tpl = document.createElement('template');
          tpl.innerHTML = html.trim();
    
          // Prefer an actual <footer>, but don’t fail if it’s a snippet
          const footer = tpl.content.querySelector('footer');
    
          if (footer) {
            mount.replaceWith(footer);
          } else if (tpl.content.childElementCount) {
            // If the snippet has multiple nodes, insert them all
            mount.replaceWith(tpl.content);
          } else {
            throw new Error('Footer snippet was empty');
          }
        })
        .catch((err) => {
          console.error('[Footer] load failed:', err);
          // Minimal fallback so the page keeps a footer
          mount.outerHTML =
            '<footer class="footer"><div class="container"><div class="footer-bottom"><p>&copy; 2025 Youth Tech</p></div></div></footer>';
        });
    });
    
    
      
  
    /* ---------------------------
       Reveal on scroll (cards)
    --------------------------- */
    function revealOnScroll() {
      const items = [
        ...$$('.impact-item'),
        ...$$('.program-card'),
        ...$$('.post-card'),
        ...$$('.team-member'),
        ...$$('.application-card'),
        ...$$('.benefit-item'),
        ...$$('.faq-item')
      ];
  
      if (!('IntersectionObserver' in window) || items.length === 0) return;
  
      items.forEach(el => {
        el.style.transform = 'translateY(10px)';
        el.style.opacity = '0';
        el.style.transition = 'transform .5s ease, opacity .5s ease';
      });
  
      const io = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            requestAnimationFrame(() => {
              target.style.transform = 'translateY(0)';
              target.style.opacity = '1';
            });
            io.unobserve(target);
          }
        });
      }, { threshold: 0.15 });
  
      items.forEach(el => io.observe(el));
    }

  })();
  