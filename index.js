const CURRENCY_SYMBOL = '₹'; // Currency symbol for formatting

// Utility function to format currency
function formatCurrency(amount) {
    return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
}

// Initialize cart from localStorage or default to an empty object
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let cartItemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

// Update cart count on page load
const cartCountElem = document.getElementById('cartCount');
if (cartCountElem) {
    cartCountElem.textContent = cartItemCount;
}

// Show selected section (Products or Cart)
function showSection(sectionId, event) {
    if (event) event.preventDefault(); // Prevent default anchor behavior

    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = sectionId === 'cart' ? 'block' : 'grid';
        if (sectionId === 'cart') updateCartPage();
    }
}

// Go Home (show home section dynamically without reloading the page)
function goHome(event) {
    event.preventDefault(); // Prevent default behavior of the Home link
    showSection('hero', event); // Show the home section
    if (cartCountElem) {
        cartCountElem.textContent = cartItemCount; // Update cart count dynamically
    }
}

// Add item to Cart
function addToCart(productName, productPrice) {
    if (cart[productName]) {
        cart[productName].quantity++;
        cart[productName].total = cart[productName].quantity * productPrice;
    } else {
        cart[productName] = {
            price: productPrice,
            quantity: 1,
            total: productPrice,
        };
    }

    cartItemCount++;
    if (cartCountElem) {
        cartCountElem.textContent = cartItemCount;
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    showSection('cart'); // Show the cart page after adding

    alert(`${productName} has been added to your cart!`);
}

// Update Cart Page with items
function updateCartPage() {
    const cartItemsElem = document.getElementById('cartItems');
    if (!cartItemsElem) return;

    cartItemsElem.innerHTML = ''; // Clear the cart items list
    let totalAmount = 0;

    for (const [productName, productDetails] of Object.entries(cart)) {
        totalAmount += productDetails.total;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${productName}</td>
            <td>${formatCurrency(productDetails.price)}</td>
            <td>${productDetails.quantity}</td>
            <td>${formatCurrency(productDetails.total)}</td>
            <td><button class="remove-btn" onclick="removeFromCart('${productName}')">Remove</button></td>
        `;
        cartItemsElem.appendChild(row);
    }

    const cartTotalElem = document.getElementById('cartTotal');
    if (cartTotalElem) {
        cartTotalElem.textContent = formatCurrency(totalAmount);
    }
}

// Remove item from Cart
function removeFromCart(productName) {
    cartItemCount -= cart[productName].quantity;
    delete cart[productName];
    if (cartCountElem) {
        cartCountElem.textContent = cartItemCount;
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    updateCartPage(); // Update cart page after removal
}

// Clear Cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = {}; // Empty the cart
        cartItemCount = 0;
        if (cartCountElem) {
            cartCountElem.textContent = cartItemCount;
        }

        localStorage.removeItem('cart'); // Remove cart data from localStorage
        updateCartPage(); // Update cart page
    }
}

// Debounced Search and Filter Products
let debounceTimer;
function filterProducts() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            product.style.display = productName.includes(searchTerm) ? '' : 'none';
        });
    }, 300); // Delay for 300ms
}

// Placeholder for search functionality
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    alert(`Searching for: ${searchTerm}`);
    // Implement actual search logic here
}

// Display initial cart state
document.addEventListener('DOMContentLoaded', () => {
    updateCartPage();
});
