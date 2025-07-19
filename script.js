document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hamburger menu toggle with backdrop
    const hamburger = document.querySelector('.hamburger');
    const navContent = document.querySelector('.nav-content');
    if (!hamburger || !navContent) {
        console.error('Hamburger or navContent not found:', { hamburger, navContent });
        return;
    }
    console.log('Hamburger and navContent found');

    const navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
    console.log('Backdrop created');

    hamburger.addEventListener('click', () => {
        console.log('Hamburger clicked');
        hamburger.classList.toggle('active');
        navContent.classList.toggle('active');
        navBackdrop.classList.toggle('active');
    });

    // Close mobile nav when link or backdrop is clicked
    document.querySelectorAll('.nav-content a, .nav-backdrop').forEach(element => {
        element.addEventListener('click', () => {
            navContent.classList.remove('active');
            hamburger.classList.remove('active');
            navBackdrop.classList.remove('active');
        });
    });

    // Show/hide nav on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const nav = document.querySelector('nav');
        if (currentScroll > lastScroll && currentScroll > 50) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });

    // Cart and product logic
    let cart = [];

    function getSelectedSize(productName) {
        const select = document.querySelector(`.size-select[data-product="${productName}"]`);
        if (!select) {
            console.error(`No size select found for product: ${productName}`);
            return '';
        }
        const value = select.value.split('|')[0];
        if (!value) {
            console.error(`Invalid size for product: ${productName}`);
            return '';
        }
        return value;
    }

    function getSelectedPrice(productName) {
        const select = document.querySelector(`.size-select[data-product="${productName}"]`);
        if (!select) {
            console.error(`No size select found for product: ${productName}`);
            return 0;
        }
        const price = parseFloat(select.value.split('|')[1]);
        if (isNaN(price) || price <= 0) {
            console.error(`Invalid price for product: ${productName}`);
            return 0;
        }
        return price;
    }

    function addToCart(name, size, price) {
        if (!name || !size || !price) {
            console.error('Missing cart item details', { name, size, price });
            alert('Please select a valid size before adding to cart.');
            return;
        }
        const existing = cart.find(item => item.name === name && item.size === size);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ name, size, price, quantity: 1 });
        }
        updateCart();
    }

    function updateCart() {
        const items = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const countEls = [
            document.getElementById('cart-count'),
            document.getElementById('middle-cart-count')
        ].filter(el => el !== null);
        if (!items || !totalEl) {
            console.error('Cart elements missing', { items, totalEl });
            return;
        }
        items.innerHTML = '';

        let total = 0, tQty = 0;
        cart.forEach((item, idx) => {
            total += item.price * item.quantity;
            tQty += item.quantity;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                ${item.name} (${item.size}) - KES ${item.price.toFixed(2)} x ${item.quantity}
                <button class="remove-from-cart" data-idx="${idx}">Remove</button>
            `;
            items.appendChild(div);
        });

        totalEl.textContent = total.toFixed(2);
        countEls.forEach(el => el.textContent = tQty);

        // Attach remove button listeners
        document.querySelectorAll('.remove-from-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(parseInt(btn.dataset.idx));
            });
        });
    }

    function proceedToCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        document.getElementById('checkout-form').style.display = 'block';
    }

    function submitOrder(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const addr = document.getElementById('address').value.trim();

        if (!name || !email || !addr) {
            alert('Please fill in all fields.');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter a valid email address.');
            return;
        }

        const details = `Order from ${name}\nEmail: ${email}\nAddress: ${addr}\n` +
            cart.map(i => `${i.name} (${i.size}) - KES ${i.price.toFixed(2)} x ${i.quantity}`).join('\n') +
            `\nTotal: KES ${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}`;

        window.open(
            `https://wa.me/+254702899085?text=${encodeURIComponent(details)}`,
            '_blank'
        );

        cart = [];
        updateCart();
        document.getElementById('order-form').reset();
        document.getElementById('checkout-form').style.display = 'none';
    }

    // Image modal functionality
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close');

    document.querySelectorAll('img[data-modal]').forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImage.src = img.src;
            modalImage.alt = img.alt;
        });
    });

    closeModal.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Slideshow behavior
    let slideIndex = 0;
    function showSlides() {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) {
            console.warn('No slides found');
            return;
        }
        slides.forEach(s => s.classList.remove('active'));
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
        setTimeout(showSlides, 5000);
    }
    showSlides();

    // Add to cart buttons (replacing inline onclick)
    document.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-cart-btn') || e.target.matches('button[onclick^="addToCart"]')) {
            const productName = e.target.dataset.product || e.target.getAttribute('onclick')
                .replace("addToCart('", '').replace(/'.*/, '');
            const size = getSelectedSize(productName);
            const price = getSelectedPrice(productName);
            addToCart(productName, size, price);
        }
    });

    // Scrolling arrows
    window.scrollPricing = function(direction) {
        document.querySelectorAll('.pricing-grid .product-row').forEach(row => {
            row.scrollLeft += direction === 'left' ? -300 : 300;
        });
    };

    window.scrollProducts = function(direction) {
        const grid = document.querySelector('#products .product-grid');
        if (grid) {
            grid.scrollLeft += direction === 'left' ? -320 : 320;
        }
    };
});

// Global functions for scrolling and cart
function removeFromCart(idx) {
    if (idx >= 0 && idx < cart.length) {
        cart.splice(idx, 1);
        updateCart();
    }
}
