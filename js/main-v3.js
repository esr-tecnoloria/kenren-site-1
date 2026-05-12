// ============================================
// JAVASCRIPT VERSÃO 3 - ACESSIBILIDADE
// ============================================

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.hero-indicator');
const prevArrow = document.querySelector('.hero-arrow-prev');
const nextArrow = document.querySelector('.hero-arrow-next');
const totalSlides = slides.length;

// Pré-carregar todas as imagens para evitar piscar
function preloadImages() {
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img && img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
}

preloadImages();

function showSlide(index) {
    const currentActiveIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    if (currentActiveIndex === index) return;
    
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    if (currentActiveIndex !== -1) {
        slides[currentActiveIndex].classList.add('prev');
    }
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    setTimeout(() => {
        slides.forEach(slide => slide.classList.remove('prev'));
    }, 800);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Auto-play slider
let slideInterval = setInterval(nextSlide, 6000);

// Pause on hover
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    heroSection.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 6000);
    });
}

// Arrow controls
if (nextArrow) {
    nextArrow.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 6000);
    });
}

if (prevArrow) {
    prevArrow.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 6000);
    });
}

// Indicator controls
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        clearInterval(slideInterval);
        currentSlide = index;
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 6000);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 120;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Atualizar link ativo
            document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link, .nav-link-mobile');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    }

    lastScroll = currentScroll;
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Enviando...';
        button.disabled = true;

        setTimeout(() => {
            formMessage.textContent = 'Obrigado pelo envio! Entraremos em contato em breve.';
            formMessage.className = 'form-message success';
            contactForm.reset();
            button.textContent = originalText;
            button.disabled = false;
            
            setTimeout(() => {
                formMessage.className = 'form-message';
                formMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

// Newsletter Form Handler
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        const button = newsletterForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Inscrevendo...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Inscrito!';
            button.style.background = '#28a745';
            newsletterForm.reset();
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        }, 1000);
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.destaque-card, .noticia-card, .evento-card, .atividade-card, .monumento-card, .kenjinkai-item, .info-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Menu Sidebar Mobile
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileSidebar = document.getElementById('mobileSidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const navLinksMobile = document.querySelectorAll('.nav-link-mobile');

// Abrir sidebar
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Fechar sidebar
function closeSidebar() {
    mobileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Fechar ao clicar em um link
navLinksMobile.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(closeSidebar, 300);
    });
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
        closeSidebar();
    }
});

// Acessibilidade: Foco visível melhorado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Aumentar tamanho de fonte (acessibilidade)
function increaseFontSize() {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    html.style.fontSize = (currentSize + 2) + 'px';
}

function decreaseFontSize() {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    if (currentSize > 14) {
        html.style.fontSize = (currentSize - 2) + 'px';
    }
}

// Adicionar controles de acessibilidade (opcional)
if (window.innerWidth > 968) {
    const accessibilityControls = document.createElement('div');
    accessibilityControls.className = 'accessibility-controls';
    accessibilityControls.innerHTML = `
        <button onclick="increaseFontSize()" aria-label="Aumentar fonte">A+</button>
        <button onclick="decreaseFontSize()" aria-label="Diminuir fonte">A-</button>
    `;
    document.body.appendChild(accessibilityControls);
}

