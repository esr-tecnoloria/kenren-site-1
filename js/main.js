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

// Inicializar pré-carregamento
preloadImages();

function showSlide(index) {
    // Encontrar slide ativo atual
    const currentActiveIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    // Se é o mesmo slide, não fazer nada
    if (currentActiveIndex === index) return;
    
    // Remover classes de todos os slides
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Se há um slide ativo anterior
    if (currentActiveIndex !== -1) {
        // Marcar slide anterior como prev (para animação de saída para esquerda)
        slides[currentActiveIndex].classList.add('prev');
    }
    
    // Adicionar active ao novo slide (vem da direita)
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    // Remover prev após transição
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
let slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds

// Pause on hover
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    heroSection.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Arrow controls
if (nextArrow) {
    nextArrow.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
}

if (prevArrow) {
    prevArrow.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Indicator controls
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        clearInterval(slideInterval);
        currentSlide = index;
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
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
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simulate form submission (replace with actual API call)
        formMessage.textContent = 'Enviando mensagem...';
        formMessage.className = 'form-message';
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.textContent = 'Obrigado pelo envio! Entraremos em contato em breve.';
            formMessage.className = 'form-message success';
            contactForm.reset();
        }, 1500);
    });
}

// Newsletter Form Handler
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate newsletter subscription (replace with actual API call)
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
    const animateElements = document.querySelectorAll('.atividade-card, .monumento-card, .evento-card, .kenjinkai-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax effect removed for slider (not needed with slider)

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

