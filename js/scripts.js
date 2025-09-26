document.addEventListener('DOMContentLoaded', () => {
    const cartCountSpan = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        cartCountSpan.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function addToCart(product) {
        const existingProductIndex = cart.findIndex(item => item.name === product.name);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} به سبد خرید اضافه شد!`);
    }

    document.querySelectorAll('.product button').forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const productName = productElement.querySelector('h3').textContent;
            const productPriceText = productElement.querySelector('p').textContent;
            const productImage = productElement.querySelector('img') ? productElement.querySelector('img').src : '';
            const productPrice = parseFloat(productPriceText.replace(/,/g, '').replace('تومان', '').trim());

            const product = {
                name: productName,
                price: productPrice,
                image: productImage
            };
            addToCart(product);
        });
    });

    updateCartCount();


    if (window.location.pathname.endsWith('cart.html')) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');

        function renderCart() {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>سبد خرید شما خالی است.</p>';
            } else {
                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('cart-item');
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>${item.price.toLocaleString()} تومان</p>
                            <div class="quantity-controls">
                                <button class="decrease-quantity" data-name="${item.name}">-</button>
                                <span>${item.quantity}</span>
                                <button class="increase-quantity" data-name="${item.name}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-name="${item.name}">حذف</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                    total += item.price * item.quantity;
                });
            }
            cartTotalSpan.textContent = total.toLocaleString();
            updateCartCount();
        }


        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('increase-quantity')) {
                const productName = event.target.dataset.name;
                const itemIndex = cart.findIndex(item => item.name === productName);
                if (itemIndex > -1) {
                    cart[itemIndex].quantity++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                }
            } else if (event.target.classList.contains('decrease-quantity')) {
                const productName = event.target.dataset.name;
                const itemIndex = cart.findIndex(item => item.name === productName);
                if (itemIndex > -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        cart.splice(itemIndex, 1);
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                }
            } else if (event.target.classList.contains('remove-item')) {
                const productName = event.target.dataset.name;
                cart = cart.filter(item => item.name !== productName);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        });
        
        renderCart();
    }
});
