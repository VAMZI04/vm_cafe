// Cart functionality
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const paymentMethods = document.querySelectorAll('input[name="payment"]');

// Toggle between veg and non-veg items
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const type = btn.dataset.type;
        document.querySelectorAll('.veg-items').forEach(item => {
            item.style.display = type === 'veg' ? 'block' : 'none';
        });
        document.querySelectorAll('.non-veg-items').forEach(item => {
            item.style.display = type === 'non-veg' ? 'block' : 'none';
        });
    });
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuItem = button.closest('.menu-item');
        const name = menuItem.querySelector('.menu-item-name').textContent;
        const price = parseFloat(menuItem.querySelector('.menu-item-price').textContent.replace('₹', ''));
        const image = menuItem.querySelector('.menu-item-image').src;
        
        addToCart(name, price, image);
        updateCartUI();
        
        // Show quick feedback
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1000);
    });
});

// Cart functions
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    updateCartCount();
    showCartFeedback();
}

function showCartFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.textContent = 'Item added to cart!';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.classList.add('show');
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 2000);
    }, 100);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartUI() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <span class="item-name">${item.name}</span>
            <div class="item-controls">
                <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', -1)">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', 1)">+</button>
            </div>
            <span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" onclick="removeItem('${item.name}')">×</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    totalAmount.textContent = `₹${total.toFixed(2)}`;
    checkoutBtn.disabled = cart.length === 0;
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(name);
        } else {
            updateCartUI();
            updateCartCount();
        }
    }
}

function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
    updateCartCount();
}

// Cart modal toggle
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('show');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('show');
});

// Close cart when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('show');
    }
});

// Payment method selection
paymentMethods.forEach(method => {
    method.addEventListener('change', () => {
        checkoutBtn.disabled = false;
    });
});

// Store cart data in sessionStorage
function saveCartToSession() {
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: document.querySelector('input[name="payment"]:checked').value
    };
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
}

// Checkout process
checkoutBtn.addEventListener('click', () => {
    if (!document.querySelector('input[name="payment"]:checked')) {
        alert('Please select a payment method');
        return;
    }
    
    saveCartToSession();
    window.location.href = 'order-confirmation.html';
});
