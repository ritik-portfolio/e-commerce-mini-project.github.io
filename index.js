const cart = {};
        let cartItemCount = 0;

        function showSection(sectionId) {
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(sectionId).style.display = sectionId === 'cart' ? 'block' : 'grid';
        }

        function addToCart(productName, productPrice) {
            if (cart[productName]) {
                cart[productName].quantity++;
                cart[productName].total = cart[productName].quantity * productPrice;
            } else {
                cart[productName] = {
                    price: productPrice,
                    quantity: 1,
                    total: productPrice
                };
            }

            cartItemCount++;
            document.getElementById('cartCount').textContent = cartItemCount;
            updateCartPage();
            showSection('cart');
        }

        function removeFromCart(productName) {
            cartItemCount -= cart[productName].quantity;
            delete cart[productName];
            document.getElementById('cartCount').textContent = cartItemCount;
            updateCartPage();
        }

        function clearCart() {
            for (const product in cart) {
                delete cart[product];
            }
            cartItemCount = 0;
            document.getElementById('cartCount').textContent = cartItemCount;
            updateCartPage();
        }

        function updateCartPage() {
            const cartItems = document.getElementById('cartItems');
            cartItems.innerHTML = '';
            let totalAmount = 0;

            for (const [productName, productDetails] of Object.entries(cart)) {
                totalAmount += productDetails.total;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${productName}</td>
                    <td>₹${productDetails.price.toFixed(2)}</td>
                    <td>${productDetails.quantity}</td>
                    <td>₹${productDetails.total.toFixed(2)}</td>
                    <td><button class="remove-btn" onclick="removeFromCart('${productName}')">Remove</button></td>
                `;
                cartItems.appendChild(row);
            }

            document.getElementById('cartTotal').textContent = totalAmount.toFixed(2);
        }