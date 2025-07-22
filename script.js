document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    const app = document.getElementById('app');
    const pageTitle = document.getElementById('page-title');
    const themeSwitcher = document.querySelector('.theme-switcher');

    // --- THEME SWITCHER ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = currentTheme + '-theme';
    themeSwitcher.innerText = currentTheme === 'light' ? '🌙' : '☀️';

    themeSwitcher.addEventListener('click', () => {
        let theme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        document.body.className = theme + '-theme';
        themeSwitcher.innerText = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    });

    // --- DATA ---
    const categories = [
        { id: 1, name: 'Электроника' },
        { id: 2, name: 'Одежда' },
        { id: 3, name: 'Книги' },
    ];

    const products = [
        { id: 1, categoryId: 1, name: 'Смартфон Pro', description: 'Современный смартфон с отличной камерой.', price: '55000 RUB', imageUrl: 'https://via.placeholder.com/300/007bff/ffffff?text=Phone' },
        { id: 2, categoryId: 1, name: 'Ноутбук Air', description: 'Мощный ноутбук для работы и игр.', price: '125000 RUB', imageUrl: 'https://via.placeholder.com/300/1e90ff/ffffff?text=Laptop' },
        { id: 3, categoryId: 2, name: 'Футболка "Wave"', description: 'Хлопковая футболка, унисекс.', price: '1800 RUB', imageUrl: 'https://via.placeholder.com/300/28a745/ffffff?text=T-Shirt' },
        { id: 4, categoryId: 2, name: 'Джинсы "Urban"', description: 'Классические синие джинсы.', price: '4500 RUB', imageUrl: 'https://via.placeholder.com/300/ffc107/000000?text=Jeans' },
        { id: 5, categoryId: 3, name: 'Книга "Код Да Винчи"', description: 'Знаменитый роман Дэна Брауна.', price: '900 RUB', imageUrl: 'https://via.placeholder.com/300/dc3545/ffffff?text=Book' },
    ];

    let state = {
        currentPage: 'categories',
        currentCategoryId: null,
        currentProductId: null,
        searchQuery: ''
    };

    // --- RENDERING LOGIC ---
    function clearApp() {
        while (app.firstChild) {
            app.removeChild(app.firstChild);
        }
    }

    function render() {
        clearApp();
        tg.BackButton.hide();

        switch (state.currentPage) {
            case 'categories':
                pageTitle.innerText = 'Каталог';
                renderCategories();
                break;
            case 'products':
                const category = categories.find(c => c.id === state.currentCategoryId);
                pageTitle.innerText = category.name;
                renderProducts(state.currentCategoryId);
                tg.BackButton.show();
                break;
            case 'detail':
                 const product = products.find(p => p.id === state.currentProductId);
                pageTitle.innerText = product.name;
                renderProductDetail(state.currentProductId);
                tg.BackButton.show();
                break;
        }
    }

    function renderCategories() {
        const categoryList = document.createElement('div');
        categoryList.className = 'category-list';

        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerText = category.name;
            card.onclick = () => {
                state.currentPage = 'products';
                state.currentCategoryId = category.id;
                render();
            };
            categoryList.appendChild(card);
        });
        app.appendChild(categoryList);
    }
    
    function renderProducts(categoryId) {
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.className = 'search-bar';
        searchBar.placeholder = 'Поиск по товарам...';
        searchBar.value = state.searchQuery;
        searchBar.oninput = (e) => {
            state.searchQuery = e.target.value;
            render();
        };
        app.appendChild(searchBar);

        const productList = document.createElement('div');
        productList.className = 'product-list';
        
        const filteredProducts = products
            .filter(p => p.categoryId === categoryId)
            .filter(p => p.name.toLowerCase().includes(state.searchQuery.toLowerCase()));

        if (filteredProducts.length === 0) {
            const noResults = document.createElement('p');
            noResults.innerText = 'Товаров не найдено.';
            app.appendChild(noResults);
            return;
        }

        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" style="width:100px; height:100px; object-fit: cover;">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
            `;
            card.onclick = () => {
                state.currentPage = 'detail';
                state.currentProductId = product.id;
                render();
            };
            productList.appendChild(card);
        });
        app.appendChild(productList);
    }

    function renderProductDetail(productId) {
        const product = products.find(p => p.id === productId);
        const detailView = document.createElement('div');
        detailView.className = 'product-detail';
        detailView.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <h3>${product.price}</h3>
        `;
        app.appendChild(detailView);
    }

    // --- TELEGRAM INTEGRATION ---
    tg.onEvent('backButtonClicked', () => {
        if (state.currentPage === 'products') {
            state.currentPage = 'categories';
            state.searchQuery = ''; // Reset search
        } else if (state.currentPage === 'detail') {
            state.currentPage = 'products';
        }
        render();
    });

    // --- INITIAL RENDER ---
    render();
}); 