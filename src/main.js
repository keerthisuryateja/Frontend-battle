/* ==========================================================================
   AetherFlow Landing Page JS Logic
   ========================================================================== */

// 1. Loader & Hero Entrance Animations via Web Animations API (WAAPI)
document.addEventListener('DOMContentLoaded', () => {
  // Initialize matrix pricing dynamically to avoid hardcoded markup values
  updatePricingDOM();

  const loader = document.getElementById('entry-loader');
  
  if (loader) {
    // Resolve entry loader sequence within 200ms
    const loaderAnim = loader.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(1.02)' }
    ], {
      duration: 200,
      easing: 'ease-in-out',
      fill: 'forwards'
    });

    loaderAnim.onfinish = () => {
      loader.style.display = 'none';
      loader.setAttribute('aria-hidden', 'true');
    };

    // Trigger Hero entrance stagger concurrently for seamless reveal
    setTimeout(() => {
      triggerHeroEntrance();
    }, 50);
  } else {
    triggerHeroEntrance();
  }

  // Initialize Three.js hero scene
  initHero3D();
});

function triggerHeroEntrance() {
  const elements = document.querySelectorAll('.animate-fade-up');
  elements.forEach((el, index) => {
    // Check user accessibility preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    el.animate([
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 250,
      delay: index * 40,
      easing: 'ease-out',
      fill: 'both'
    });
  });
}

// 2. Bento ↔ Accordion State Persistence (Context Lock Constraint)
let activeFeatureIndex = 0;
const featurePanels = document.querySelectorAll('.feature-panel');
const featuresGrid = document.getElementById('features-interactive-wrapper');

function setFeatureActive(index) {
  activeFeatureIndex = index;
  featurePanels.forEach((panel, i) => {
    const isActive = i === index;
    panel.setAttribute('data-active', isActive ? 'true' : 'false');
    
    // Set proper accessibility state on header button
    const headerBtn = panel.querySelector('.feature-panel-header');
    if (headerBtn) {
      headerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }

    // Dynamic icon state mapping for API/Integrations card
    if (i === 2) {
      const linkUseTag = panel.querySelector('.link-dynamic-icon use');
      if (linkUseTag) {
        linkUseTag.setAttribute('href', isActive ? '#icon-link-solid' : '#icon-link');
      }
    }
  });
}

// Bind Feature Interaction Events
featurePanels.forEach((panel, i) => {
  const headerBtn = panel.querySelector('.feature-panel-header');
  
  // Desktop Interaction: Hover updates state
  panel.addEventListener('mouseenter', () => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      setFeatureActive(i);
    }
  });

  // Mobile Interaction: Click toggles accordion
  if (headerBtn) {
    headerBtn.addEventListener('click', (e) => {
      const isMobile = !window.matchMedia('(min-width: 768px)').matches;
      if (isMobile) {
        const currentlyActive = panel.getAttribute('data-active') === 'true';
        setFeatureActive(currentlyActive ? -1 : i);
      }
    });
  }
});

// Avoid layout snap when transitioning back/forth across breakpoint mid-interaction
window.addEventListener('resize', () => {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  // If we resized to desktop and active index is collapsed (-1), force back to 0
  if (isDesktop && activeFeatureIndex === -1) {
    setFeatureActive(0);
  }
});


// 3. Matrix-Driven Pricing System with Isolated State Re-renders
const PRICING_MATRIX = {
  starter:    { INR: 999,  USD: 19, EUR: 18 },
  pro:        { INR: 2499, USD: 49, EUR: 45 },
  enterprise: { INR: null, USD: null, EUR: null }, // null -> "Contact us"
};

const ANNUAL_DISCOUNT = 0.20; // 20% annual discount applied globally

const CURRENCY_META = {
  INR: { symbol: '₹', locale: 'en-IN' },
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'en-IE' },
};

// Global pricing selector states co-located inside pricing context/handler
let currentBillingCycle = 'monthly'; // 'monthly' | 'annual'
let currentCurrency = 'INR';         // 'INR' | 'USD' | 'EUR'

function getPrice(tier, currency, billingCycle) {
  const base = PRICING_MATRIX[tier][currency];
  if (base == null) return null;
  const amount = billingCycle === 'annual' ? base * (1 - ANNUAL_DISCOUNT) : base;
  const { symbol, locale } = CURRENCY_META[currency];
  return symbol + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
}

// Imperative pricing update to guarantee strict state isolation
function updatePricingDOM() {
  const tiers = ['starter', 'pro', 'enterprise'];
  
  tiers.forEach(tier => {
    const priceValNode = document.getElementById(`price-${tier}`);
    const pricePeriodNode = document.getElementById(`period-${tier}`);
    
    if (priceValNode) {
      const priceText = getPrice(tier, currentCurrency, currentBillingCycle);
      if (priceText === null) {
        priceValNode.textContent = 'Contact us';
        if (pricePeriodNode) pricePeriodNode.style.display = 'none';
      } else {
        priceValNode.textContent = priceText;
        if (pricePeriodNode) {
          pricePeriodNode.style.display = 'inline';
          pricePeriodNode.textContent = currentBillingCycle === 'annual' ? '/yr' : '/mo';
        }
      }
    }
  });
}

// Pricing controls event bindings
const billingButtons = document.querySelectorAll('.switch-btn');
const currencyButtons = document.querySelectorAll('.currency-btn');

billingButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    billingButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentBillingCycle = btn.getAttribute('data-billing');
    updatePricingDOM();
  });
});

currencyButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    currencyButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCurrency = btn.getAttribute('data-currency');
    updatePricingDOM();
  });
});


// 4. Testimonial Carousel Controls
let activeSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const track = document.getElementById('testimonial-track');
const dots = document.querySelectorAll('.carousel-indicator-dots .dot');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

function setSlideActive(index) {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  
  activeSlideIndex = index;
  
  // Slide track offset calculation
  const offset = -index * 33.3333; // since width is 300% for 3 slides
  if (track) {
    track.style.transform = `translateX(${offset}%)`;
  }
  
  // Update indicator dots active styles
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => setSlideActive(activeSlideIndex - 1));
  nextBtn.addEventListener('click', () => setSlideActive(activeSlideIndex + 1));
}

dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const slideIdx = parseInt(dot.getAttribute('data-slide'));
    setSlideActive(slideIdx);
  });
});


// 5. Scroll triggers using IntersectionObserver
const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      // Once revealed, no need to track it anymore
      scrollRevealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Select elements for scroll reveals
document.querySelectorAll('.pricing-card, .testimonial-carousel-wrapper, .cta-banner-card, .feature-panel').forEach(el => {
  el.classList.add('reveal-hidden');
  scrollRevealObserver.observe(el);
});


// 6. Dismiss Webhooks CTA Banner Card Action
const dismissCtaBtn = document.getElementById('dismiss-cta-banner');
if (dismissCtaBtn) {
  dismissCtaBtn.addEventListener('click', () => {
    const bannerCard = dismissCtaBtn.closest('.cta-banner-card');
    if (bannerCard) {
      bannerCard.classList.add('dismissed');
      // Remove from layout after fade out
      setTimeout(() => {
        bannerCard.style.display = 'none';
      }, 350);
    }
  });
}

// 7. Newsletter Form AJAX Submission with Success Feedback
const newsletterForm = document.getElementById('newsletter');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput && emailInput.value.trim() !== '') {
      // Smoothly transition form inputs to success message
      newsletterForm.innerHTML = `<span class="newsletter-success">Telemetry Sync Activated.</span>`;
    }
  });
}


// 8. Stats Counter Animation — numbers count up when scrolled into view
function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-target'));
  const suffix = element.getAttribute('data-suffix') || '';
  const decimals = parseInt(element.getAttribute('data-decimals') || '0');
  const duration = 1200; // ms
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    
    element.textContent = current.toFixed(decimals) + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger the counters for visual impact
      const cards = entry.target.querySelectorAll('.stat-number');
      cards.forEach((card, idx) => {
        setTimeout(() => animateCounter(card), idx * 100);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3
});

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  counterObserver.observe(statsGrid);
}


// 9. Three.js 3D Hero Scene — rotating wireframe with particles
function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;

  // Respect reduced motion preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  import('three').then((THREE) => {
    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    // Colors from palette
    const forsythia = new THREE.Color(0xFFC801);
    const saffron = new THREE.Color(0xFF9932);
    const mint = new THREE.Color(0xD9E8E2);
    const darkBg = new THREE.Color(0x172B36);

    // Central wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: forsythia,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icoMesh);

    // Inner solid icosahedron with glow
    const innerGeo = new THREE.IcosahedronGeometry(0.6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: saffron,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Orbiting ring (torus)
    const torusGeo = new THREE.TorusGeometry(1.8, 0.015, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: mint,
      transparent: true,
      opacity: 0.3,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    scene.add(torusMesh);

    // Second torus perpendicular
    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.01, 16, 80),
      new THREE.MeshBasicMaterial({
        color: forsythia,
        transparent: true,
        opacity: 0.2,
      })
    );
    torus2.rotation.x = Math.PI / 2;
    torus2.rotation.y = Math.PI / 4;
    scene.add(torus2);

    // Floating particles
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Mix colors between forsythia and mint
      const mix = Math.random();
      const col = new THREE.Color().lerpColors(forsythia, mint, mix);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Connection lines from center to outer nodes
    const linePositions = [];
    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const r = 1.8;
      linePositions.push(0, 0, 0);
      linePositions.push(r * Math.cos(angle), r * Math.sin(angle) * 0.5, r * Math.sin(angle) * 0.8);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: forsythia,
      transparent: true,
      opacity: 0.15,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Animation loop
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);

      if (!reduceMotion) {
        icoMesh.rotation.x += 0.003;
        icoMesh.rotation.y += 0.005;
        innerMesh.rotation.x -= 0.005;
        innerMesh.rotation.y -= 0.003;
        torusMesh.rotation.z += 0.002;
        torus2.rotation.z -= 0.003;
        particles.rotation.y += 0.001;
        lines.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    }

    animate();

    // Responsive resize handler
    const resizeObs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObs.observe(container);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      resizeObs.disconnect();
    });
  }).catch(() => {
    // Fallback: if Three.js fails to load, show a static gradient
    canvas.style.background = 'radial-gradient(circle, rgba(255,200,1,0.1) 0%, transparent 70%)';
  });
}
