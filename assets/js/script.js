// Main App Logic


let cart = [];


const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));

function showMessage(title, message, type = 'info') {
    document.getElementById('messageModalTitle').innerText = title;
    
    let bodyContent = '';
    
    if (type === 'success') {
        bodyContent += `
        <div class="success-checkmark">
            <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
            </div>
        </div>
        <div class="text-center mt-3">
            <h5>${message}</h5>
        </div>`;
    } else {
        bodyContent = message;
    }
    
    document.getElementById('messageModalBody').innerHTML = bodyContent;
    
    
    const header = document.querySelector('#messageModal .modal-header');
    header.className = 'modal-header'; 
    if (type === 'danger') header.classList.add('bg-danger', 'text-white');
    else if (type === 'success') header.classList.add('bg-success', 'text-white');
    else if (type === 'warning') header.classList.add('bg-warning', 'text-dark');
    else header.classList.add('bg-primary', 'text-white');

    messageModal.show();
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-block').forEach(el => el.classList.add('d-none'));
    // Show target section
    document.getElementById(`section-${sectionId}`).classList.remove('d-none');
    
    // Update Nav Active State
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    event.target.classList.add('active');

    if(sectionId === 'products') {
        renderProductManagementTable();
    } else if(sectionId === 'customers') {
        renderCustomerManagementTable();
        loadCustomersForOrder(); 
    } else if(sectionId === 'orders') {
        renderOrderHistoryTable();
    }
}

// --- Showing Past Orders ---

function renderOrderHistoryTable() {
    const tbody = document.getElementById('order-history-table');
    tbody.innerHTML = '';

    if (db.orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No orders found.</td></tr>';
        return;
    }

    // Show newest first
    const sortedOrders = [...db.orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach(order => {
        const itemSummary = order.items.map(i => `${i.name} (x${i.qty})`).join(', ');
        // Format Date
        const dateObj = new Date(order.date);
        const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();

        const row = `
            <tr>
                <td><span class="badge bg-secondary">#${order.id}</span></td>
                <td>${formattedDate}</td>
                <td>${order.customerName}</td>
                <td title="${itemSummary}" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${itemSummary}
                </td>
                <td class="fw-bold">Rs. ${order.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-info text-white" onclick="alert('Order Items:\\n${itemSummary}')">View</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// --- Managing Customers ---

function renderCustomerManagementTable() {
    const tbody = document.getElementById('customer-management-table');
    tbody.innerHTML = '';
    
    db.customers.forEach(c => {
        const row = `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editCustomer(${c.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${c.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

const customerModal = new bootstrap.Modal(document.getElementById('customerModal'));

function showAddCustomerModal() {
    document.getElementById('customerForm').reset();
    document.getElementById('custId').value = '';
    document.getElementById('customerModalLabel').innerText = 'Add Customer';
    customerModal.show();
}

function editCustomer(id) {
    const c = db.customers.find(x => x.id === id);
    if (!c) return;

    document.getElementById('custId').value = c.id;
    document.getElementById('custName').value = c.name;
    document.getElementById('custEmail').value = c.email;
    document.getElementById('custPhone').value = c.phone;
    
    document.getElementById('customerModalLabel').innerText = 'Edit Customer';
    customerModal.show();
}

function deleteCustomer(id) {
    if(confirm('Are you sure you want to delete this customer?')) {
        db.customers = db.customers.filter(c => c.id !== id);
        renderCustomerManagementTable();
        loadCustomersForOrder(); // Refresh POS dropdown
    }
}

document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('custId').value;
    const name = document.getElementById('custName').value;
    const email = document.getElementById('custEmail').value;
    const phone = document.getElementById('custPhone').value;

    // Phone Number Validation 
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        showMessage("Validation Error", "Please enter a valid Sri Lankan phone number.", "danger");
        return;
    }

    if (id) {
        // Update
        const index = db.customers.findIndex(c => c.id == id);
        if(index !== -1) {
            db.customers[index] = { ...db.customers[index], name, email, phone };
        }
    } else {
        // Add
        const newId = db.customers.length > 0 ? Math.max(...db.customers.map(c => c.id)) + 1 : 1;
        db.customers.push({ id: newId, name, email, phone });
    }

    customerModal.hide();
    renderCustomerManagementTable();
    loadCustomersForOrder(); // Refresh POS dropdown
});

// --- Managing Products ---

function renderProductManagementTable() {
    const tbody = document.getElementById('product-management-table');
    tbody.innerHTML = '';
    
    db.products.forEach(p => {
        const row = `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.image}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                <td>${p.name}</td>
                <td><span class="badge bg-secondary">${p.category}</span></td>
                <td>Rs. ${p.price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function toggleProductForm() {
    const formCard = document.getElementById('product-form-card');
    const form = document.getElementById('productForm');
    const isHidden = formCard.classList.contains('d-none');
    
    if (isHidden) {
        // Show
        formCard.classList.remove('d-none');
        document.getElementById('product-form-title').innerText = 'Add New Product';
        form.reset();
        document.getElementById('prodId').value = '';
    } else {
        // Hide
        formCard.classList.add('d-none');
    }
}

function editProduct(id) {
    const p = db.products.find(x => x.id === id);
    if (!p) return;

    // Show form
    const formCard = document.getElementById('product-form-card');
    formCard.classList.remove('d-none');

    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodImage').value = p.image;
    
    document.getElementById('product-form-title').innerText = 'Edit Product';
    
    formCard.scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
    if(confirm('Are you sure you want to delete this product?')) {
        db.products = db.products.filter(p => p.id !== id);
        renderProductManagementTable();
        displayProducts(); // Refresh POS view as well
    }
}

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const price = parseFloat(document.getElementById('prodPrice').value);
    const image = document.getElementById('prodImage').value;

    if (id) {
        // Update
        const index = db.products.findIndex(p => p.id == id);
        if(index !== -1) {
            db.products[index] = { ...db.products[index], name, category, price, image };
        }
    } else {
        // Add
        const newId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
        db.products.push({ id: newId, name, category, price, image });
    }

    toggleProductForm(); // Hide form
    renderProductManagementTable();
    displayProducts(); // Refresh POS view
});

// --- Main Selling Logic ---

function displayProducts(filter = 'all') {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    const filteredProducts = filter === 'all' ? db.products : db.products.filter(p => p.category === filter);

    filteredProducts.forEach((product) => {
        const productCard = `
            <div class="col-md-4 col-lg-3">
                <div class="card h-100 product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                        onerror="this.onerror=null; this.src='https://placehold.co/400x300?text=${encodeURIComponent(product.name)}';">
                    <div class="card-body">
                        <h6 class="card-title fw-bold">${product.name}</h6>
                        <p class="card-text product-price">Rs. ${product.price.toFixed(2)}</p>
                        <button class="btn btn-sm btn-outline-primary w-100" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

function filterProducts(category) {
    
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    displayProducts(category);
}

function addToCart(productId) {
    const product = db.products.find((p) => p.id === productId);
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartTable = document.getElementById("cart-items");
    cartTable.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
        const totalItemPrice = item.price * item.qty;
        subtotal += totalItemPrice;

        const row = `
            <tr>
                <td>${item.name}</td>
                <td>
                    <button class="btn btn-sm btn-light border" onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="mx-2">${item.qty}</span>
                    <button class="btn btn-sm btn-light border" onclick="changeQty(${item.id}, 1)">+</button>
                </td>
                <td>${totalItemPrice.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger text-white" onclick="removeFromCart(${item.id})">&times;</button></td>
            </tr>
        `;
        cartTable.innerHTML += row;
    });

    const total = subtotal;

    document.getElementById("total-display").innerText = `Rs. ${total.toFixed(2)}`;
}

function changeQty(id, change) {
    const item = cart.find((i) => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCartUI();
}

// --- Handling the Checkout ---

function loadCustomersForOrder() {
    const select = document.getElementById('order-customer-select');
    select.innerHTML = '<option value="" selected disabled>Choose...</option>';
    
    db.customers.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name} (${c.phone})</option>`;
    });
}

function placeOrder() {
    const customerId = document.getElementById('order-customer-select').value;
    
    if (cart.length === 0) {
        showMessage("Empty Cart", "Cart is empty!", "warning");
        return;
    }
    
    if (!customerId) {
        showMessage("Missing Customer", "Please select a customer!", "warning");
        return;
    }

    const customer = db.customers.find(c => c.id == customerId);
    
    // Calculate total price
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
    });
    const finalTotal = total;

    // Create Order Object
    const newOrder = {
        id: db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1001,
        customerId: customer.id,
        customerName: customer.name, 
        items: [...cart],
        total: finalTotal,
        date: new Date().toISOString()
    };

    db.orders.push(newOrder);
    
    console.log("Order Placed:", newOrder);
    showMessage("Success", `Order Placed Successfully! Order ID: ${newOrder.id}`, "success");

    // Clear Cart & UI
    cart = [];
    updateCartUI();
    document.getElementById('order-customer-select').value = "";
}


// Initialize
document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    loadCustomersForOrder();
    
    // Start everything when the page is ready
    const placeOrderBtn = document.querySelector('.btn-success.btn-lg');
    if(placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
});
