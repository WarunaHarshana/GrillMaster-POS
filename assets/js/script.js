// 1. Product Database
let products = [
  {
    id: 1,
    name: "Classic Burger",
    price: 1500.0,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
  },
  {
    id: 2,
    name: "Cheese Fries",
    price: 800.0,
    category: "fries",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500",
  },
  {
    id: 3,
    name: "Cola (L)",
    price: 400.0,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
  },
  {
    id: 4,
    name: "Chicken Burger",
    price: 1800.0,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=500",
  },
];

let cart = [];

// 2. Display Products
function displayProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productCard = `
            <div class="col-md-4 col-lg-3">
                <div class="card h-100 border-0 shadow-sm" style="cursor: pointer;" onclick="addToCart(${product.id})">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 150px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h6 class="card-title fw-bold">${product.name}</h6>
                        <p class="card-text text-primary fw-bold">Rs. ${product.price}.00</p>
                        <button class="btn btn-sm btn-outline-primary w-100">Add to Order</button>
                    </div>
                </div>
            </div>
        `;
    productList.innerHTML += productCard;
  });
}

// 3. Add to Cart Function
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
}

// 4. Update Cart UI and Calculate Totals

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
                    <button class="btn btn-sm btn-light border" onclick="changeQty(${
                      item.id
                    }, -1)">-</button>
                    <span class="mx-2">${item.qty}</span>
                    <button class="btn btn-sm btn-light border" onclick="changeQty(${
                      item.id
                    }, 1)">+</button>
                </td>
                <td>${totalItemPrice.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger text-white" onclick="removeFromCart(${
                  item.id
                })">&times;</button></td>
            </tr>
        `;
    cartTable.innerHTML += row;
  });

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById(
    "subtotal-display"
  ).innerText = `Rs. ${subtotal.toFixed(2)}`;
  document.getElementById("tax-display").innerText = `Rs. ${tax.toFixed(2)}`;
  document.getElementById("total-display").innerText = `Rs. ${total.toFixed(
    2
  )}`;
}

// 5. Change Quantity
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

// 6. Remove Item
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

document.addEventListener("DOMContentLoaded", displayProducts);
