// ============================================
// CÓDIGO PARA WIX VELO - Site KENREN
// ============================================
// Cole este código no arquivo main.js do Wix Velo
// ou em pages/home.js

import wixWindow from 'wix-window';

$w.onReady(function () {
    // Hero Slider
    initHeroSlider();
    
    // Smooth Scroll
    initSmoothScroll();
    
    // Form Handlers
    initContactForm();
    initNewsletterForm();
    
    // Mobile Menu
    initMobileMenu();
    
    // Scroll Effects
    initScrollEffects();
});

// ============================================
// HERO SLIDER
// ============================================
function initHeroSlider() {
    let currentSlide = 0;
    const slides = $w('#heroSlider'); // ID do seu slider no Wix
    const totalSlides = slides.items.length;
    
    // Auto-play
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        slides.currentIndex = currentSlide;
    }, 5000);
    
    // Pausa no hover
    $w('#heroSlider').onMouseIn(() => {
        // Pausar slider (implementar lógica de pausa)
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    $w.onReady(function () {
        // Adicionar smooth scroll para links âncora
        $w('#anchorLink').onClick(() => {
            $w('#sectionId').scrollTo();
        });
    });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    $w('#contactForm').onSubmit((event) => {
        event.preventDefault();
        
        const formData = {
            nome: $w('#nomeInput').value,
            email: $w('#emailInput').value,
            mensagem: $w('#mensagemInput').value
        };
        
        // Enviar para Wix Data ou Email
        wixData.save('ContactSubmissions', formData)
            .then(() => {
                $w('#successMessage').show();
                $w('#contactForm').reset();
            })
            .catch((error) => {
                console.error('Erro ao enviar formulário:', error);
                $w('#errorMessage').show();
            });
    });
}

// ============================================
// NEWSLETTER FORM
// ============================================
function initNewsletterForm() {
    $w('#newsletterForm').onSubmit((event) => {
        event.preventDefault();
        
        const email = $w('#newsletterEmail').value;
        
        // Integrar com Wix Email Marketing
        wixData.save('NewsletterSubscribers', { email: email })
            .then(() => {
                $w('#newsletterSuccess').show();
                $w('#newsletterForm').reset();
            })
            .catch((error) => {
                console.error('Erro ao inscrever:', error);
            });
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    $w('#mobileMenuButton').onClick(() => {
        $w('#mobileMenu').toggle();
    });
    
    // Fechar menu ao clicar em link
    $w('#mobileMenuLink').onClick(() => {
        $w('#mobileMenu').hide();
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    wixWindow.onScroll(() => {
        const scrollY = wixWindow.scrollY;
        const header = $w('#mainHeader');
        
        if (scrollY > 100) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
    });
}

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
function updateActiveNav() {
    const sections = ['#home', '#federacao', '#kenjinkais', '#monumentos', '#eventos', '#contato'];
    const scrollY = wixWindow.scrollY;
    
    sections.forEach((sectionId, index) => {
        const section = $w(sectionId);
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // Remover active de todos
            $w('#navLink').forEach(link => link.removeClass('active'));
            // Adicionar active ao link correspondente
            $w(`#navLink${index}`).addClass('active');
        }
    });
}

wixWindow.onScroll(updateActiveNav);


