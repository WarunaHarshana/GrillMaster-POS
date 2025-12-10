// Database for GrillMaster POS

const db = {
    products: [
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
    ],
    customers: [
        // { id: 1, name: "John Doe", email: "john@example.com", phone: "0771234567" }
    ],
    orders: []
};
