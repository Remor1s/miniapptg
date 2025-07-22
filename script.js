document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    const app = document.getElementById('app');
    let currentPage = 'categories';

    // Mock Data
    const categories = [
        { id: 1, name: 'Электроника' },
        { id: 2, name: 'Одежда' },
        { id: 3, name: 'Книги' },
    ];

    const products = [
        // Электроника
        { id: 1, categoryId: 1, name: 'Смартфон', description: 'Современный смартфон с отличной камерой.', price: '50000 RUB', imageUrl: 'https://via.placeholder.com/150' },
        { id: 2, categoryId: 1, name: 'Ноутбук', description: 'Мощный ноутбук для работы и игр.', price: '120000 RUB', imageUrl: 'https://via.placeholder.com/150' },
        // Одежда
        { id: 3, categoryId: 2, name: 'Футболка', description: 'Хлопковая футболка, унисекс.', price: '1500 RUB', imageUrl: 'https://via.placeholder.com/150' },
        { id: 4, categoryId: 2, name: 'Джинсы', description: 'Классические синие джинсы.', price: '4000 RUB', imageUrl: 'https://via.placeholder.com/150' },
        // Книги
        { id: 5, categoryId: 3, name: 'Книга "Мастер и Маргарита"', description: 'Знаменитый роман Михаила Булгакова.', price: '800 RUB', imageUrl: 'https://via.placeholder.com/150' },
    ];

    function renderCategories() {
        app.innerHTML = '<h1>Категории</h1>';
        const categoryList = document.createElement('div');
        categoryList.className = 'category-list';

        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerText = category.name;
            categoryCard.onclick = () => showProducts(category.id);
            categoryList.appendChild(categoryCard);
        });
        app.appendChild(categoryList);
        currentPage = 'categories';
        tg.BackButton.hide();
    }

    function showProducts(categoryId) {
        const category = categories.find(c => c.id === categoryId);
        app.innerHTML = `<h1>${category.name}</h1>`;
        const productList = document.createElement('div');
        productList.className = 'product-list';

        const categoryProducts = products.filter(p => p.categoryId === categoryId);

        categoryProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" style="width:100px; height:100px; object-fit: cover;">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
            `;
            productCard.onclick = () => showProductDetail(product.id);
            productList.appendChild(productCard);
        });

        app.appendChild(productList);
        currentPage = 'products';
        tg.BackButton.show();
    }

    function showProductDetail(productId) {
        lastViewedProductId = productId;
        const product = products.find(p => p.id === productId);
        app.innerHTML = `
            <div class="product-detail">
                <img src="${product.imageUrl}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <h3>${product.price}</h3>
            </div>
        `;
        currentPage = 'detail';
        tg.BackButton.show();
    }

    function handleBackButtonClick() {
        if (currentPage === 'products') {
            renderCategories();
        } else if (currentPage === 'detail') {
            const currentProduct = products.find(p => p.id === lastViewedProductId);
            if(currentProduct) {
                showProducts(currentProduct.categoryId);
            } else {
                renderCategories(); // fallback
            }
        }
    }
    
    let lastViewedProductId = null;

    tg.onEvent('backButtonClicked', handleBackButtonClick);
    
    renderCategories();
}); 