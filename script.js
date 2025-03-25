document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Acoustic Precision Headphones",
            price: 28900,
            category: "headphones",
            image: "/api/placeholder/280/280"
        },
        {
            id: 2,
            name: "Stereo Bass Earbuds",
            price: 16800,
            category: "earbuds",
            image: "/api/placeholder/280/280"
        },
        {
            id: 3,
            name: "Studio Monitor HP",
            price: 34500,
            category: "headphones",
            image: "/api/placeholder/280/280"
        },
        {
            id: 4,
            name: "Premium Leather Case",
            price: 5900,
            category: "accessories",
            image: "/api/placeholder/280/280"
        },
        {
            id: 5,
            name: "Wireless Sport Earbuds",
            price: 18500,
            category: "earbuds",
            image: "/api/placeholder/280/280"
        },
        {
            id: 6,
            name: "Audiophile Cable Set",
            price: 8900,
            category: "accessories",
            image: "/api/placeholder/280/280"
        }
    ];

    // Navigation and Header
    const header = document.querySelector('header');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const cartButton = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');

    // Scroll event for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Transform hamburger to X
        navToggle.classList.toggle('active');
        if (navToggle.classList.contains('active')) {
            navToggle.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            navToggle.querySelectorAll('span')[1].style.opacity = '0';
            navToggle.querySelectorAll('span')[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            navToggle.querySelectorAll('span')[0].style.transform = 'none';
            navToggle.querySelectorAll('span')[1].style.opacity = '1';
            navToggle.querySelectorAll('span')[2].style.transform = 'none';
        }
    });

    // Cart sidebar toggle
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('open');
            overlay.classList.add('active');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    overlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
        }
        overlay.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.querySelectorAll('span')[0].style.transform = 'none';
        navToggle.querySelectorAll('span')[1].style.opacity = '1';
        navToggle.querySelectorAll('span')[2].style.transform = 'none';
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.querySelectorAll('span')[0].style.transform = 'none';
            navToggle.querySelectorAll('span')[1].style.opacity = '1';
            navToggle.querySelectorAll('span')[2].style.transform = 'none';
        });
    });

    // Product filtering
    const productGrid = document.querySelector('.product-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Format price to Japanese Yen
    function formatPrice(price) {
        return '¥' + price.toLocaleString();
    }

    // Display products
    function displayProducts(category = 'all') {
        if (!productGrid) return;
        
        productGrid.innerHTML = '';
        
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Initialize add to cart buttons
        initAddToCartButtons();
    }

    // Filter button click events
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Display filtered products
            displayProducts(filterValue);
        });
    });

    // Initialize products on load
    if (productGrid) {
        displayProducts();
    }

    // Shopping Cart functionality
    let cart = [];
    
    function initAddToCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCartCount();
        updateCartDisplay();
        showCartNotification();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartCount();
        updateCartDisplay();
    }
    
    function updateQuantity(productId, quantity) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity = Math.max(1, quantity);
            updateCartDisplay();
        }
    }
    
    function updateCartCount() {
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartIcon) return;
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartIcon.textContent = `Cart (${totalItems})`;
    }
    
    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItemsContainer || !cartTotal) return;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            cartTotal.textContent = formatPrice(0);
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        cartTotal.textContent = formatPrice(total);
        
        // Initialize quantity buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                const item = cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    updateQuantity(id, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                const item = cart.find(item => item.id === id);
                if (item) {
                    updateQuantity(id, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', () => {
                const id = parseInt(input.getAttribute('data-id'));
                const quantity = parseInt(input.value);
                if (!isNaN(quantity) && quantity > 0) {
                    updateQuantity(id, quantity);
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }
    
    function showCartNotification() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.textContent = 'Item added to cart!';
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 15px';
        notification.style.backgroundColor = 'var(--accent-color)';
        notification.style.color = 'var(--primary-color)';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = 'var(--shadow)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Testimonial Slider
    let currentTestimonialIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    
    function showTestimonial(index) {
        if (!testimonials.length || !dots.length) return;
        
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial and activate dot
        testimonials[index].style.display = 'block';
        dots[index].classList.add('active');
    }
    
    // Initialize testimonial display
    if (testimonials.length) {
        showTestimonial(currentTestimonialIndex);
        
        // Dot click event
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonialIndex = index;
                showTestimonial(currentTestimonialIndex);
            });
        });
        
        // Auto rotate testimonials
        setInterval(() => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            showTestimonial(currentTestimonialIndex);
        }, 5000);
    }

    // Form submissions
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulating form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Show success message
                const formContainer = this.parentElement;
                formContainer.innerHTML = `
                    <div class="form-success">
                        <h3>Thank you for your message!</h3>
                        <p>We will get back to you as soon as possible.</p>
                    </div>
                `;
            }, 1500);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulating form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            const emailInput = this.querySelector('input[type="email"]');
            
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Clear form and show success
                emailInput.value = '';
                submitButton.textContent = 'Subscribed!';
                
                // Reset after a delay
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // Animation on scroll
    const animateElements = document.querySelectorAll('.about, .feature-content, .products h2, .story h2, .testimonials h2, .contact h2');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Run on scroll and initial load
    window.addEventListener('scroll', checkScroll);
    checkScroll();
    
    // ABOUT SECTION ANIMATION - IMPROVED VERSION
    function setupAboutAnimation() {
        console.log("Setting up about animation");
        const aboutText = document.querySelector('.about-text');
        const aboutImage = document.querySelector('.about-image');
        const aboutSection = document.getElementById('about');
        
        if (!aboutText || !aboutImage || !aboutSection) {
            console.log("About elements not found:", {
                text: !!aboutText, 
                image: !!aboutImage, 
                section: !!aboutSection
            });
            return; // Exit if elements don't exist
        }
        
        console.log("About elements found, setting up animation");
        
        // Set initial styles directly
        aboutText.style.transform = 'translateX(-100%)';
        aboutText.style.opacity = '0';
        aboutText.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
        
        aboutImage.style.transform = 'translateX(100%)';
        aboutImage.style.opacity = '0';
        aboutImage.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
        
        function handleAboutScroll() {
            const rect = aboutSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Element is in viewport when its top is in view
            const isVisible = rect.top < windowHeight * 0.75 && rect.bottom > 0;
            
            console.log("About section visible:", isVisible);
            
            if (isVisible) {
                aboutText.style.transform = 'translateX(0)';
                aboutText.style.opacity = '1';
                aboutImage.style.transform = 'translateX(0)';
                aboutImage.style.opacity = '1';
            } else {
                aboutText.style.transform = 'translateX(-100%)';
                aboutText.style.opacity = '0';
                aboutImage.style.transform = 'translateX(100%)';
                aboutImage.style.opacity = '0';
            }
        }
        
        // Run immediately and after small delay to ensure it works
        handleAboutScroll();
        setTimeout(handleAboutScroll, 300);
        
        // Add scroll event listener with throttling for better performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(function() {
                    handleAboutScroll();
                    scrollTimeout = null;
                }, 20);
            }
        });
    }
    
    // Call the about animation setup
    setupAboutAnimation();
});

// Mobile menu toggle improved functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle improved functionality
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.getElementById('overlay');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking outside
    if (overlay) {
        overlay.addEventListener('click', function() {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Add swipe functionality for mobile testimonials
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const dots = document.querySelectorAll('.dot');
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (testimonialSlider) {
        testimonialSlider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        testimonialSlider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }
    
    function handleSwipe() {
        // Detect swipe direction
        if (touchEndX < touchStartX) {
            // Swipe left - next testimonial
            const activeDot = document.querySelector('.dot.active');
            const nextDot = activeDot.nextElementSibling || dots[0];
            if (nextDot) nextDot.click();
        }
        
        if (touchEndX > touchStartX) {
            // Swipe right - previous testimonial
            const activeDot = document.querySelector('.dot.active');
            const prevDot = activeDot.previousElementSibling || dots[dots.length - 1];
            if (prevDot) prevDot.click();
        }
    }
    
    // Initialize dot functionality if not already implemented
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Remove active class from all dots
                dots.forEach(d => d.classList.remove('active'));
                // Add active class to clicked dot
                dot.classList.add('active');
                
                // Update testimonial display based on the selected dot
                // This assumes you have multiple testimonials in the slider
                const testimonials = document.querySelectorAll('.testimonial');
                testimonials.forEach(t => t.style.display = 'none');
                if (testimonials[index]) testimonials[index].style.display = 'block';
            });
        });
    }
    
    // Responsive viewport fix for iOS
    function fixViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    fixViewportHeight();
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', fixViewportHeight);
});