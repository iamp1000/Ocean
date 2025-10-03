// ============================================================================
// COMPLETE FINAL scripts.js - ALL FIXES + ROTATION ANIMATIONS
// ============================================================================

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Prevent hero from animating twice - flag
let heroAnimated = false;

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================================
  // LENIS SMOOTH SCROLL
  // ============================================================================

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  gsap.registerPlugin(ScrollTrigger);

  // ============================================================================
  // LOADING SCREEN
  // ============================================================================

  const loadingScreen = document.getElementById('loading-screen');
  const loadingVideo = document.getElementById('loading-video');
  const unmuteBtn = document.getElementById('unmute-btn');
  const skipBtn = document.getElementById('skip-btn');

  document.body.style.overflow = 'hidden';
  lenis.stop();

  if (unmuteBtn) {
    unmuteBtn.addEventListener('click', () => {
      loadingVideo.muted = !loadingVideo.muted;
      unmuteBtn.innerHTML = loadingVideo.muted
        ? '<i class="fas fa-volume-mute"></i> Unmute'
        : '<i class="fas fa-volume-up"></i> Mute';
    });
  }

  function skipLoading() {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        loadingScreen.style.display = 'none';
        loadingScreen.style.pointerEvents = 'none';
        document.body.style.overflow = 'auto';
        lenis.start();
        initializeAnimations();
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      skipLoading();
    });
  }

  setTimeout(skipLoading, 5000);

  // ============================================================================
  // SCROLL PROGRESS BAR
  // ============================================================================

  function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    gsap.to(progressBar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    });
  }

  // ============================================================================
  // NAVBAR - FIXED WITH NULL CHECKS
  // ============================================================================

  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const navLinks = navbar.querySelectorAll('.nav-links a');
    const logo = navbar.querySelector('.logo');
    if (!logo) return;

    gsap.set(navbar, { y: -100, opacity: 0 });
    gsap.set(logo, { scale: 0.8, opacity: 0 });
    gsap.set(navLinks, { y: -20, opacity: 0 });

    const navTl = gsap.timeline({ delay: 0.2 });

    navTl
      .to(navbar, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .to(logo, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.5')
      .to(navLinks, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, '-=0.3');

    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onEnter: () => {
        gsap.to(navbar, {
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          duration: 0.3
        });
        gsap.to(logo, { color: '#1f2937', duration: 0.3 });
        gsap.to(navLinks, { color: '#1f2937', duration: 0.3 });
      },
      onLeaveBack: () => {
        gsap.to(navbar, {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          boxShadow: 'none',
          duration: 0.3
        });
        gsap.to(logo, { color: '#ffffff', duration: 0.3 });
        gsap.to(navLinks, { color: '#ffffff', duration: 0.3 });
      }
    });
  }

  // ============================================================================
  // HERO SECTION - FIXED: LOADS ONLY ONCE WITH FLAG
  // ============================================================================

  function initHero() {
    // CRITICAL FIX: Check if already animated
    if (heroAnimated) {
      console.log('Hero already animated, skipping...');
      return;
    }

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroContent = hero.querySelector('.hero-content');
    if (!heroContent) return;

    const h1 = heroContent.querySelector('h1');
    const subtitle = heroContent.querySelector('.hero-subtitle');
    const ctaButton = heroContent.querySelector('.cta-button');
    const scrollIndicator = hero.querySelector('.scroll-indicator');
    const heroBg = hero.querySelector('.hero-bg');

    // NULL CHECKS
    if (!h1 || !subtitle || !ctaButton || !scrollIndicator || !heroBg) {
      console.log('Hero elements missing');
      return;
    }

    // Set flag IMMEDIATELY to prevent double execution
    heroAnimated = true;

    // Set white text colors
    gsap.set([h1, subtitle], { color: '#f5f5f5' });
    const scrollSpans = scrollIndicator.querySelectorAll('span');
    if (scrollSpans.length > 0) {
      gsap.set(scrollSpans, { color: '#e5e5e5' });
    }

    // Initial states
    gsap.set(heroBg, { scale: 1.1, opacity: 0 });
    gsap.set(h1, { y: 60, opacity: 0, scale: 0.95 });
    gsap.set(subtitle, { y: 40, opacity: 0 });
    gsap.set(ctaButton, { scale: 0.85, opacity: 0 });
    gsap.set(scrollIndicator, { y: 20, opacity: 0 });

    // FIXED: Reduced delay to 0.5s
    const heroTl = gsap.timeline({
      delay: 0.5,
      onStart: () => {
        console.log('Hero animation started');
      }
    });

    heroTl
      .to(heroBg, { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' })
      .to(h1, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.9')
      .to(subtitle, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to(ctaButton, { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.7)' }, '-=0.3')
      .to(scrollIndicator, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3');

    // Parallax effects
    gsap.to(heroBg, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to(heroContent, {
      yPercent: 50,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Scroll line animation
    const scrollLine = scrollIndicator.querySelector('.scroll-line');
    if (scrollLine) {
      gsap.to(scrollLine, {
        scaleY: 1.5,
        duration: 1.2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      });
    }

    // CTA button hover
    if (ctaButton) {
      ctaButton.addEventListener('mouseenter', () => {
        gsap.to(ctaButton, {
          scale: 1.05,
          boxShadow: '0 10px 30px rgba(199, 154, 135, 0.5)',
          duration: 0.25,
          ease: 'power2.out'
        });
      });

      ctaButton.addEventListener('mouseleave', () => {
        gsap.to(ctaButton, {
          scale: 1,
          boxShadow: '0 4px 15px rgba(199, 154, 135, 0.3)',
          duration: 0.25,
          ease: 'power2.out'
        });
      });
    }
  }

  // ============================================================================
  // ABOUT US
  // ============================================================================

  function initAboutUs() {
    const aboutSection = document.getElementById('about-us');
    if (!aboutSection) return;

    const image = aboutSection.querySelector('img');
    const textBox = aboutSection.querySelector('.bg-white');
    if (!image || !textBox) return;

    const heading = textBox.querySelector('h2');
    const paragraph = textBox.querySelector('p');

    gsap.set(image, { x: -80, opacity: 0 });
    gsap.set(textBox, { x: 80, opacity: 0 });
    if (heading) gsap.set(heading, { y: 20, opacity: 0 });
    if (paragraph) gsap.set(paragraph, { y: 15, opacity: 0 });

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    });

    aboutTl
      .to(image, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
      .to(textBox, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7');

    if (heading) aboutTl.to(heading, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
    if (paragraph) aboutTl.to(paragraph, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');

    gsap.to(image, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // ============================================================================
  // SERVICES
  // ============================================================================

  function initServices() {
    const servicesSection = document.getElementById('services');
    if (!servicesSection) return;

    const heading = servicesSection.querySelector('h2');
    const leftContent = servicesSection.querySelector('.bg-neutral-800');
    const rightContent = servicesSection.querySelector('.bg-neutral-100');

    if (!leftContent || !rightContent) return;

    const listItems = leftContent.querySelectorAll('li');
    const ctaBtn = leftContent.querySelector('a');
    const images = rightContent.querySelectorAll('img');

    if (heading) gsap.set(heading, { x: -60, opacity: 0 });
    gsap.set(leftContent, { x: -80, opacity: 0 });
    gsap.set(rightContent, { x: 80, opacity: 0 });
    gsap.set(listItems, { x: -20, opacity: 0 });
    if (ctaBtn) gsap.set(ctaBtn, { scale: 0.9, opacity: 0 });
    gsap.set(images, { scale: 0.92, opacity: 0 });

    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesSection,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    if (heading) servicesTl.to(heading, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });

    servicesTl
      .to(leftContent, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
      .to(rightContent, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.9')
      .to(listItems, { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.5')
      .to(images, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)' }, '-=0.6');

    if (ctaBtn) servicesTl.to(ctaBtn, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.6)' }, '-=0.3');

    images.forEach(img => {
      const parent = img.closest('div');
      if (parent) {
        parent.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });
        parent.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      }
    });
  }

  // ============================================================================
  // PORTFOLIO
  // ============================================================================

  function initPortfolio() {
    const section = document.querySelector('.portfolio-section');
    if (!section) return;

    const heading = section.querySelector('h2');
    const subtitle = section.querySelector('.section-subtitle');
    const items = section.querySelectorAll('.portfolio-item');

    if (heading) gsap.set(heading, { y: 40, opacity: 0 });
    if (subtitle) gsap.set(subtitle, { y: 25, opacity: 0 });
    gsap.set(items, { y: 60, opacity: 0, scale: 0.92 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });

    if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    if (subtitle) tl.to(subtitle, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
    tl.to(items, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    }, '-=0.3');

    items.forEach(item => {
      const img = item.querySelector('img');
      const overlay = item.querySelector('.portfolio-overlay');

      if (img) {
        gsap.to(img, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });

        item.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.1, duration: 0.5, ease: 'power2.out' });
          if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
          if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        });
      }
    });
  }

  // ============================================================================
  // UNIQUE EXPERIENCE
  // ============================================================================

  function initUniqueExperience() {
    const section = document.getElementById('unique-experience');
    if (!section) return;

    const heading = section.querySelector('h2');
    const videoWrap = document.getElementById('ux-video-wrap');
    const video = document.getElementById('ux-video');

    if (heading) gsap.set(heading, { y: 50, opacity: 0, scale: 0.96 });
    if (videoWrap) gsap.set(videoWrap, { y: 80, opacity: 0, scale: 0.88 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
        toggleActions: 'play none none none'
      }
    });

    if (heading) tl.to(heading, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' });
    if (videoWrap) tl.to(videoWrap, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, '-=0.5');

    if (videoWrap) {
      gsap.to(videoWrap, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }

    if (video && videoWrap) {
      ScrollTrigger.create({
        trigger: videoWrap,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => video.play(),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play(),
        onLeaveBack: () => video.pause()
      });
    }
  }

  // ============================================================================
  // EXPERIENCES
  // ============================================================================

  function initExperiences() {
    const section = document.querySelector('.experiences-section');
    if (!section) return;

    const heading = section.querySelector('h2');
    const subtitle = section.querySelector('.section-subtitle');
    const cards = section.querySelectorAll('.experience-card');

    if (heading) gsap.set(heading, { y: 40, opacity: 0 });
    if (subtitle) gsap.set(subtitle, { y: 25, opacity: 0 });
    gsap.set(cards, { y: 80, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });

    if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    if (subtitle) tl.to(subtitle, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
    tl.to(cards, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.3');

    cards.forEach(card => {
      const number = card.querySelector('.experience-number');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          duration: 0.3,
          ease: 'power2.out'
        });
        if (number) gsap.to(number, {
          scale: 1.2,
          color: '#c79a87',
          duration: 0.25,
          ease: 'back.out(2)'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          duration: 0.3,
          ease: 'power2.out'
        });
        if (number) gsap.to(number, { scale: 1, duration: 0.25, ease: 'power2.out' });
      });
    });
  }

  // ============================================================================
  // SHOP - NEW ROTATION ANIMATIONS (320°→0° and 40°→0° alternating)
  // ============================================================================

  function initShop() {
    const section = document.querySelector('.shop-section');
    if (!section) return;

    const heading = section.querySelector('h2');
    const description = section.querySelector('p');
    const cards = section.querySelectorAll('.product-card');

    // Set initial states for text (will animate faster)
    if (heading) gsap.set(heading, { y: 40, opacity: 0 });
    if (description) gsap.set(description, { y: 25, opacity: 0 });

    // Set initial states for product cards with rotation
    cards.forEach((card, index) => {
      const image = card.querySelector('.product-image img');
      const info = card.querySelector('.product-info');

      // Alternating rotation: even indices rotate from 320° (clockwise), odd from 40° (counter-clockwise)
      const startRotation = index % 2 === 0 ? 320 : 40;

      if (image) {
        gsap.set(image, {
          rotation: startRotation,
          opacity: 0,
          scale: 0.85
        });
      }

      if (info) {
        gsap.set(info, { y: 30, opacity: 0 });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });

    // Animate heading and description FAST (0.5s as requested)
    if (heading) {
      tl.to(heading, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      });
    }

    if (description) {
      tl.to(description, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3');
    }

    // Animate product cards with stagger
    cards.forEach((card, index) => {
      const image = card.querySelector('.product-image img');
      const info = card.querySelector('.product-info');

      if (image) {
        tl.to(image, {
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.7');
      }

      if (info) {
        tl.to(info, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.8');
      }
    });

    // Hover effects for product cards
    cards.forEach(card => {
      const image = card.querySelector('.product-image img');
      const info = card.querySelector('.product-info');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -15,
          scale: 1.02,
          boxShadow: '0 25px 50px rgba(199, 154, 135, 0.3)',
          duration: 0.3,
          ease: 'power2.out'
        });

        if (image) {
          gsap.to(image, {
            scale: 1.1,
            rotation: '+=5', // Slight additional rotation on hover
            duration: 0.4,
            ease: 'power2.out'
          });
        }

        if (info) {
          gsap.to(info, {
            y: -5,
            duration: 0.25,
            ease: 'power2.out'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          duration: 0.3,
          ease: 'power2.out'
        });

        if (image) {
          gsap.to(image, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }

        if (info) {
          gsap.to(info, {
            y: 0,
            duration: 0.25,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  // ============================================================================
  // NEWS SECTION - COMMENTED OUT (as per your request)
  // ============================================================================

  // function initNews() {
  //   const section = document.querySelector('.news-section');
  //   if (!section) return;
  //   
  //   const heading = section.querySelector('h2');
  //   const subtitle = section.querySelector('.section-subtitle');
  //   const cards = section.querySelectorAll('.news-card');
  //
  //   if (heading) gsap.set(heading, { y: 40, opacity: 0 });
  //   if (subtitle) gsap.set(subtitle, { y: 25, opacity: 0 });
  //   gsap.set(cards, { y: 80, opacity: 0, scale: 0.96 });
  //
  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: section,
  //       start: 'top 70%',
  //       toggleActions: 'play none none none'
  //     }
  //   });
  //
  //   if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
  //   if (subtitle) tl.to(subtitle, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
  //   tl.to(cards, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.3');
  //
  //   cards.forEach(card => {
  //     const image = card.querySelector('.news-image img');
  //     const readMore = card.querySelector('.read-more');
  //
  //     card.addEventListener('mouseenter', () => {
  //       gsap.to(card, { y: -12, boxShadow: '0 20px 50px rgba(0,0,0,0.15)', duration: 0.3, ease: 'power2.out' });
  //       if (image) gsap.to(image, { scale: 1.08, duration: 0.5, ease: 'power2.out' });
  //       if (readMore) gsap.to(readMore, { x: 8, duration: 0.25, ease: 'power2.out' });
  //     });
  //
  //     card.addEventListener('mouseleave', () => {
  //       gsap.to(card, { y: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', duration: 0.3, ease: 'power2.out' });
  //       if (image) gsap.to(image, { scale: 1, duration: 0.5, ease: 'power2.out' });
  //       if (readMore) gsap.to(readMore, { x: 0, duration: 0.25, ease: 'power2.out' });
  //     });
  //   });
  // }

  // ============================================================================
  // FOOTER
  // ============================================================================

  function initFooter() {
    const footer = document.getElementById('contact');
    if (!footer) return;

    const content = footer.querySelector('.footer-content');
    const columns = footer.querySelectorAll('.footer-column, .footer-brand');
    const socialLinks = footer.querySelectorAll('.social-links a');
    const bottom = footer.querySelector('.footer-bottom');

    if (content) gsap.set(content, { opacity: 0 });
    gsap.set(columns, { y: 50, opacity: 0 });
    gsap.set(socialLinks, { scale: 0, opacity: 0 });
    if (bottom) gsap.set(bottom, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    if (content) tl.to(content, { opacity: 1, duration: 0.5 });
    tl.to(columns, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out'
    }, '-=0.2')
      .to(socialLinks, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
        ease: 'back.out(1.7)'
      }, '-=0.3');

    if (bottom) tl.to(bottom, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.15');

    socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.2,
          y: -5,
          duration: 0.25,
          ease: 'back.out(2)'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        });
      });
    });
  }

  // ============================================================================
  // SMOOTH SCROLL TO ANCHORS
  // ============================================================================

  function initSmoothAnchors() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          lenis.scrollTo(target, {
            offset: -80,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      });
    });
  }

  // ============================================================================
  // MAIN INITIALIZATION - NEWS COMMENTED OUT
  // ============================================================================

  function initializeAnimations() {
    console.log('Initializing all animations...');

    initScrollProgress();
    initNavbar();
    initHero();
    initAboutUs();
    initServices();
    initPortfolio();
    initUniqueExperience();
    initExperiences();
    initShop();
    // initNews(); // COMMENTED OUT - News section removed
    initFooter();
    initSmoothAnchors();

    // Refresh ScrollTrigger after all animations
    ScrollTrigger.refresh();

    console.log('All animations initialized');
  }

  // ============================================================================
  // RESIZE HANDLER
  // ============================================================================

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  // ============================================================================
  // PAGE VISIBILITY HANDLER
  // ============================================================================

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
      lenis.stop();
    } else {
      gsap.globalTimeline.resume();
      lenis.start();
    }
  });

  // ============================================================================
  // DEBUG: Log when animations complete
  // ============================================================================

  ScrollTrigger.addEventListener('refresh', () => {
    console.log('ScrollTrigger refreshed');
  });

});

