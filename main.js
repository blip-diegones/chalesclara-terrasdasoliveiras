/**
 * CHALÉS CLARA • TERRA DAS OLIVEIRAS - MARIA DA FÉ, MG
 * MAIN INTERACTIVE LOGIC, GALLERY & RESERVATION ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Setup House Scroll Zoom-In GSAP Animation
  initHouseScrollZoominAnimation();

  // 3. Setup Booking Calculator & WhatsApp Formatter
  initBookingCalculator();

  // 4. Setup Categorized Photo Gallery & Lightbox
  initCategorizedGallery();

  // 5. Setup Sticky Bar & Navbar Scroll Effects
  initScrollEffects();

  // 6. Setup Mobile Navigation Menu
  initMobileMenu();
});

/* ==========================================================
   1. HOUSE SCROLL ZOOM-IN GSAP ANIMATION
   ========================================================== */
function initHouseScrollZoominAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const heroTrigger = document.getElementById('hero-pinned-trigger');
  const maskViewport = document.getElementById('house-mask-viewport');
  const maskMedia = document.getElementById('house-mask-media');
  const heroIntro = document.getElementById('hero-intro-content');
  const watermark = document.getElementById('hero-watermark');

  if (!heroTrigger || !maskViewport || !maskMedia) return;

  const isMobile = window.innerWidth < 768;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroTrigger,
      start: "top top",
      end: isMobile ? "+=120%" : "+=220%",
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  tl.to(maskViewport, {
    "--maskW": "320vw",
    ease: "power2.inOut"
  }, 0)
  .to(maskMedia, {
    scale: 1.15,
    ease: "power1.out"
  }, 0)
  .to(heroIntro, {
    opacity: 0,
    y: -50,
    pointerEvents: 'none',
    ease: "power1.in"
  }, 0)
  .to(watermark, {
    opacity: 0.01,
    scale: 1.08,
    ease: "none"
  }, 0);
}

/* ==========================================================
   2. BOOKING CALCULATOR & WHATSAPP ENGINE
   ========================================================== */
// ==========================================================
// CONFIGURAÇÃO DO WHATSAPP DE RESERVAS
// Altere o número abaixo para o WhatsApp oficial do Chalés Clara quando disponibilizado (formato: 55 + DDD + Número)
// ==========================================================
const OFFICIAL_PHONE = "5535997386945"; // WhatsApp Provisório / Configurável

function initBookingCalculator() {
  const checkinInput = document.getElementById('checkin-date');
  const checkoutInput = document.getElementById('checkout-date');

  const today = new Date();
  const defaultCheckin = new Date(today);
  defaultCheckin.setDate(today.getDate() + 7);
  const defaultCheckout = new Date(defaultCheckin);
  defaultCheckout.setDate(defaultCheckin.getDate() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];

  if (checkinInput && checkoutInput) {
    checkinInput.min = formatDate(today);
    checkinInput.value = formatDate(defaultCheckin);

    checkoutInput.min = formatDate(defaultCheckin);
    checkoutInput.value = formatDate(defaultCheckout);

    checkinInput.addEventListener('change', () => {
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.value = formatDate(nextDay);
      }
      checkoutInput.min = checkinInput.value;
      calculateTotal();
    });

    checkoutInput.addEventListener('change', calculateTotal);
  }

  const romanceCheck = document.getElementById('addon-romance');
  if (romanceCheck) {
    romanceCheck.addEventListener('change', calculateTotal);
  }

  calculateTotal();
}

function calculateTotal() {
  const checkinInput = document.getElementById('checkin-date');
  const checkoutInput = document.getElementById('checkout-date');
  const romanceCheckbox = document.getElementById('addon-romance');

  const nightsLabel = document.getElementById('nights-label');
  const nightsSubtotal = document.getElementById('nights-subtotal');
  const addonsRow = document.getElementById('addons-row');
  const addonsSubtotal = document.getElementById('addons-subtotal');
  const finalTotal = document.getElementById('final-total');

  if (!checkinInput || !checkoutInput) return;

  const date1 = new Date(checkinInput.value);
  const date2 = new Date(checkoutInput.value);
  const diffTime = Math.abs(date2 - date1);
  let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (isNaN(nights) || nights < 1) nights = 1;

  const stayTotal = nights * BASE_NIGHTLY_RATE;
  let extrasTotal = 0;

  if (romanceCheckbox && romanceCheckbox.checked) {
    extrasTotal += ROMANCE_PACKAGE_RATE;
  }

  const grandTotal = stayTotal + extrasTotal;

  const formatBRL = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (nightsLabel) nightsLabel.textContent = `${nights} noite${nights > 1 ? 's' : ''} x ${formatBRL(BASE_NIGHTLY_RATE)}`;
  if (nightsSubtotal) nightsSubtotal.textContent = formatBRL(stayTotal);

  if (addonsRow && addonsSubtotal) {
    if (extrasTotal > 0) {
      addonsRow.style.display = 'flex';
      addonsSubtotal.textContent = `+ ${formatBRL(extrasTotal)}`;
    } else {
      addonsRow.style.display = 'none';
    }
  }

  if (finalTotal) finalTotal.textContent = formatBRL(grandTotal);
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const checkinVal = document.getElementById('checkin-date')?.value || '';
  const checkoutVal = document.getElementById('checkout-date')?.value || '';
  const guestsVal = document.getElementById('guest-count')?.value || '2 Adultos';
  const guestName = document.getElementById('guest-name')?.value || 'Hóspede';
  const hasRomance = document.getElementById('addon-romance')?.checked;
  const totalVal = document.getElementById('final-total')?.textContent || 'A combinar';

  const formatFriendly = (isoStr) => {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-');
    return `${d}/${m}/${y}`;
  };

  let extrasText = ['Café da Manhã Incluso ✨'];
  if (hasRomance) extrasText.push('Kit Romântico Especial 🍷');
  const extrasStr = `\n*Inclusos / Extras:* ${extrasText.join(', ')}`;

  const message = `Olá! Meu nome é *${guestName}* e gostaria de consultar a disponibilidade para uma reserva no *Chalés Clara - Terra das Oliveiras* em Maria da Fé - MG:

*Check-in:* ${formatFriendly(checkinVal)}
*Check-out:* ${formatFriendly(checkoutVal)}
*Acomodação:* ${guestsVal}${extrasStr}
*Estimativa Direta:* ${totalVal} (sem taxas de app)

Poderia me confirmar a disponibilidade para essas datas? Muito obrigado(a)!`;

  const waUrl = `https://api.whatsapp.com/send?phone=${OFFICIAL_PHONE}&text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

/* ==========================================================
   3. CATEGORIZED GALLERY DATABASE & LIGHTBOX
   ========================================================== */
const allPhotosDatabase = [
  // Exterior & Terreno
  { category: 'exterior', src: './Galeria/Exterior/1.avif', title: 'Arquitetura A-Frame & Deck', caption: 'Estrutura A-Frame moderna em madeira rodeada pelas montanhas e plantação de oliveiras em Maria da Fé MG' },
  { category: 'exterior', src: './Galeria/Exterior/2.avif', title: 'Deck & Entardecer', caption: 'Área externa privativa com vista privilegiada para a Serra da Mantiqueira' },
  { category: 'exterior', src: './Galeria/Exterior/3.avif', title: 'Natureza & Tranquilidade', caption: 'Clima serrano puro, silêncio e mudas de oliveiras integradas ao chalé' },
  { category: 'exterior', src: './Galeria/Exterior/4.avif', title: 'Fogo de Chão & Deck', caption: 'Espaço de fogueira ao ar livre para noites de vinho sob o céu estrelado' },
  { category: 'exterior', src: './Galeria/Exterior/Portal com porteiro eletrônico, para proporcionar total segurança e privacidade!.avif', title: 'Segurança & Privacidade', caption: 'Portal com porteiro eletrônico e fechamento seguro para tranquilidade absoluta dos hóspedes' },
  { category: 'exterior', src: './Galeria/Exterior/trava de segurança.avif', title: 'Acesso Seguro', caption: 'Trava de segurança no portão privativo' },

  // Banheira de Hidromassagem
  { category: 'banheira', src: './Galeria/Banheira/1.avif', title: 'Banheira de Hidromassagem', caption: 'Banho de hidromassagem relaxante com água aquecida e enxoval completo de banho' },
  { category: 'banheira', src: './Galeria/Banheira/2.avif', title: 'Momento Relaxante & Spa', caption: 'Conforto e sofisticação para recarregar as energias a dois' },

  // Sala de Estar
  { category: 'sala', src: './Galeria/Sala de Estar/1.avif', title: 'Sala Aconchegante', caption: 'Ambiente climatizado com ar-condicionado, sofá-cama e integração com a cozinha' },
  { category: 'sala', src: './Galeria/Sala de Estar/2.avif', title: 'Charme Rústico & Moderno', caption: 'Acabamentos nobres em madeira e decoração acolhedora' },
  { category: 'sala', src: './Galeria/Sala de Estar/3.avif', title: 'Sofá-Cama Versátil', caption: 'Acomodação confortável para 1 criança ou descanso extra' },
  { category: 'sala', src: './Galeria/Sala de Estar/4.avif', title: 'Integração & Luminosidade', caption: 'Janelões de vidro que trazem a luz natural e o verde da Mantiqueira' },
  { category: 'sala', src: './Galeria/Sala de Estar/5.avif', title: 'Mobiliário & Conforto', caption: 'Tudo planejado nos mínimos detalhes para seu bem-estar' },
  { category: 'sala', src: './Galeria/Sala de Estar/6.avif', title: 'Espaço de Convivência', caption: 'Ambiente perfeito para leitura, descanso e bons momentos' },
  { category: 'sala', src: './Galeria/Sala de Estar/7.avif', title: 'Detalhes Decorativos', caption: 'Toques rústicos e acolhedores no interior do chalé' },

  // Quarto
  { category: 'quarto', src: './Galeria/Quarto/1.avif', title: 'Cama Casal & Enxoval Completo', caption: 'Cama espaçosa com conjunto completo de roupa de cama premium e travesseiros macios' },
  { category: 'quarto', src: './Galeria/Quarto/2.avif', title: 'Mezanino Confortável', caption: 'Ambiente privativo para noites de sono restauradoras no frescor da serra' },

  // Cozinha Completa
  { category: 'cozinha', src: './Galeria/Cozinha Completa/1.avif', title: 'Cozinha Toda Equipada', caption: 'Cooktop, frigobar, cafeteira, louças e utensílios completos para suas refeições' },
  { category: 'cozinha', src: './Galeria/Cozinha Completa/2.avif', title: 'Bancada Gourmet & Praticidade', caption: 'Praticidade para preparar receitas e saborear com o delicioso azeite de Maria da Fé' }
];

let activeFilter = 'todos';
let currentActivePhotos = allPhotosDatabase;
let currentLightboxIndex = 0;

function initCategorizedGallery() {
  const container = document.getElementById('gallery-mosaic-container');
  const tabs = document.querySelectorAll('.gallery-tab-btn');

  if (!container) return;

  // Filter click handler
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter') || 'todos';
      renderGallery();
    });
  });

  renderGallery();
}

function renderGallery() {
  const container = document.getElementById('gallery-mosaic-container');
  if (!container) return;

  if (activeFilter === 'todos') {
    currentActivePhotos = allPhotosDatabase;
  } else {
    currentActivePhotos = allPhotosDatabase.filter(p => p.category === activeFilter);
  }

  container.innerHTML = '';

  currentActivePhotos.forEach((photo, idx) => {
    const item = document.createElement('div');
    const isLarge = idx === 0 && activeFilter === 'todos';
    item.className = `gallery-item ${isLarge ? 'item-large' : ''}`;
    item.onclick = () => openLightbox(idx);

    item.innerHTML = `
      <img src="${encodeURI(photo.src)}" alt="${photo.title}" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-tag">${photo.title}</span>
        <p class="gallery-caption">${photo.caption}</p>
      </div>
    `;

    container.appendChild(item);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  const photo = currentActivePhotos[index];
  if (modal && img && caption && photo) {
    img.src = encodeURI(photo.src);
    caption.textContent = `${photo.title} — ${photo.caption}`;
    if (counter) counter.textContent = `${index + 1} de ${currentActivePhotos.length}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(event) {
  if (event.target.id === 'lightbox-modal') {
    closeLightboxDirectly();
  }
}

function closeLightboxDirectly() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function prevLightbox(event) {
  if (event) event.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex - 1 + currentActivePhotos.length) % currentActivePhotos.length;
  openLightbox(currentLightboxIndex);
}

function nextLightbox(event) {
  if (event) event.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex + 1) % currentActivePhotos.length;
  openLightbox(currentLightboxIndex);
}

// Keyboard navigation for Lightbox
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightbox-modal');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightboxDirectly();
  if (e.key === 'ArrowLeft') prevLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
});

/* ==========================================================
   4. SCROLL EFFECTS & NAVBAR / STICKY BAR
   ========================================================== */
function initScrollEffects() {
  const stickyBar = document.getElementById('sticky-bar');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Sticky Bottom Bar visibility
    if (stickyBar) {
      if (scrollPos > 600) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }

    // Navbar backdrop darkening
    if (navbar) {
      if (scrollPos > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

/* ==========================================================
   5. MOBILE MENU TOGGLE
   ========================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }
}
