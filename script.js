document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

let cart = [];
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
        console.log("Error: Missing cart item details", { name, size, price });
        return;
    }
    const existingItem = cart.find(item => item.name === name && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, size, price, quantity: 1 });
    }
    updateCart();
    console.log("Cart updated:", cart);
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const middleCartCount = document.getElementById('middle-cart-count');
    cartItems.innerHTML = '';

    let total = 0;
    let totalQuantity = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            ${item.name} (${item.size}) - KES ${item.price} x ${item.quantity}
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalQuantity;
    middleCartCount.textContent = totalQuantity;
    console.log("Cart count updated to:", totalQuantity);
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    document.getElementById('checkout-form').style.display = 'block';
}

function submitOrder(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    const orderDetails = `Order from ${name}\nEmail: ${email}\nAddress: ${address}\nItems:\n${cart.map(item => `${item.name} (${item.size}) - KES ${item.price} x ${item.quantity}`).join('\n')}\nTotal: KES ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;
    const whatsappUrl = `https://wa.me/254706361664?text=${encodeURIComponent(orderDetails)}`;

    window.open(whatsappUrl, '_blank');

    cart = [];
    updateCart();
    document.getElementById('order-form').reset();
    document.getElementById('checkout-form').style.display = 'none';
}

// Modal Functionality
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementsByClassName('close')[0];

document.querySelectorAll('img[data-modal]').forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImage.src = img.src;
        modalImage.alt = img.alt;
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Slideshow Functionality
let slideIndex = 0;
showSlides();

function showSlides() {
    const slides = document.getElementsByClassName('slide');
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].classList.add('active');
    setTimeout(showSlides, 5000);
}

// Ensure all "Add to Cart" buttons are bound on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button[onclick^="addToCart"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const [name, sizeFunc, priceFunc] = button.getAttribute('onclick').replace('addToCart(', '').replace(')', '').split(',');
            const size = eval(sizeFunc);
            const price = eval(priceFunc);
            addToCart(name.replace(/['"]/g, ''), size, price);
        });
    });
});

// Pricing Navigation
function scrollPricing(direction) {
    const rows = document.querySelectorAll('.pricing-grid .product-row');
    rows.forEach(row => {
        const scrollAmount = 300; // Adjust based on product-card width
        if (direction === 'left') {
            row.scrollLeft -= scrollAmount;
        } else if (direction === 'right') {
            row.scrollLeft += scrollAmount;
        }
    });
}

// Products Navigation
function scrollProducts(direction) {
    const grid = document.querySelector('#products .product-grid');
    const scrollAmount = 320; // Slightly more than product-card width to ensure smooth transition
    if (direction === 'left') {
        grid.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
        grid.scrollLeft += scrollAmount;
    }
}