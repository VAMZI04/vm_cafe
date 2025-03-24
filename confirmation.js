document.addEventListener('DOMContentLoaded', () => {
    const orderData = JSON.parse(sessionStorage.getItem('orderData'));
    
    if (!orderData) {
        window.location.href = 'menu.html';
        return;
    }

    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    const paymentMethod = document.getElementById('paymentMethod');

    // Display order items
    orderData.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-details">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <span class="item-name">${item.name}</span>
            </div>
            <div class="item-summary">
                <span class="item-quantity">x${item.quantity}</span>
                <span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        orderItems.appendChild(itemElement);
    });

    // Display total and payment method
    orderTotal.textContent = `₹${orderData.total.toFixed(2)}`;
    paymentMethod.textContent = orderData.paymentMethod.charAt(0).toUpperCase() + 
                               orderData.paymentMethod.slice(1);

    // Clear the cart data from session storage
    sessionStorage.removeItem('orderData');

    // Add animation classes
    setTimeout(() => {
        document.querySelector('.success-animation').classList.add('animate');
        document.querySelector('.confirmation-card').classList.add('show');
    }, 100);
});
