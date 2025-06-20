// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navContent = document.querySelector('.nav-content');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navContent.classList.toggle('active');
});

// Close mobile nav when link is clicked
document.querySelectorAll('.nav-content a').forEach(link => {
    link.addEventListener('click', () => {
        navContent.classList.remove('active');
        hamburger.classList.remove('active');
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

// Cart and product logic (integrated from your provided code)
let cart = [];

function getSelectedSize(productName) {
    const select = document.querySelector(`.size-select[data-product="${productName}"]`);
    return select ? select.value.split('|')[0] : '';
}

function getSelectedPrice(productName) {
    const select = document.querySelector(`.size-select[data-product="${productName}"]`);
    return select ? parseFloat(select.value.split('|')[1]) : 0;
}

function addToCart(name, size, price) {
    if (!name || !size || !price) {
        console.error("Missing cart item details", { name, size, price });
        return;
    }
    const existing = cart.find(item => item.name === name && item.size === size);
    if (existing) existing.quantity += 1;
    else cart.push({ name, size, price, quantity: 1 });
    updateCart();
}

function removeFromCart(idx) {
    if (idx >= 0 && idx < cart.length) {
        cart.splice(idx, 1);
        updateCart();
    }
}

function updateCart() {
    const items = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEls = [document.getElementById('cart-count'), document.getElementById('middle-cart-count')];
    items.innerHTML = '';

    let total = 0, tQty = 0;
    cart.forEach((item, idx) => {
        total += item.price * item.quantity;
        tQty += item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            ${item.name} (${item.size}) - KES ${item.price} x ${item.quantity}
            <button onclick="removeFromCart(${idx})">Remove</button>
        `;
        items.appendChild(div);
    });

    totalEl.textContent = total.toFixed(2);
    countEls.forEach(el => el.textContent = tQty);
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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const addr = document.getElementById('address').value;

    const details = `Order from ${name}\nEmail: ${email}\nAddress: ${addr}\n` +
        cart.map(i => `${i.name} (${i.size}) - KES ${i.price} x ${i.quantity}`).join('\n') +
        `\nTotal: KES ${cart.reduce((s,i) => s + i.price * i.quantity, 0).toFixed(2)}`;

    window.open(
        `https://wa.me/254706361664?text=${encodeURIComponent(details)}`,
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
    slides.forEach(s => s.classList.remove('active'));
    slideIndex = (slideIndex % slides.length) + 1;
    slides[slideIndex - 1].classList.add('active');
    setTimeout(showSlides, 5000);
}
document.addEventListener('DOMContentLoaded', showSlides);

// Re-attach cart buttons after DOM renders
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button[onclick^="addToCart"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const [name, sizeFn, priceFn] = btn
                .getAttribute('onclick')
                .replace('addToCart(', '')
                .replace(')', '')
                .split(',');
            const size = eval(sizeFn);
            const price = eval(priceFn);
            addToCart(name.replace(/['"]/g, ''), size, price);
        });
    });
});

// Scrolling arrows
function scrollPricing(direction) {
    document.querySelectorAll('.pricing-grid .product-row').forEach(row => {
        row.scrollLeft += direction === 'left' ? -300 : 300;
    });
}
function scrollProducts(direction) {
    const grid = document.querySelector('#products .product-grid');
    grid.scrollLeft += direction === 'left' ? -320 : 320;
}
