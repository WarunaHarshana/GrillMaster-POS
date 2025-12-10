// My simple data storage (just an object for now)
const db = {
    products: [
        // Burgers
        {
            id: 1,
            name: "Crispy Chicken Burger",
            price: 1290.0,
            category: "burgers",
            image: "assets/images/burger_crispy_chicken.png",
        },
        {
            id: 2,
            name: "Double Cheese Beef",
            price: 1850.0,
            category: "burgers",
            image: "assets/images/burger_double_beef.png",
        },
        {
            id: 3,
            name: "Cordon Bleu Burger",
            price: 1590.0,
            category: "burgers",
            image: "assets/images/burger_cordon_bleu.png",
        },
        {
            id: 4,
            name: "Spicy Veggie Delight",
            price: 850.0,
            category: "burgers",
            image: "assets/images/burger_veggie.png",
        },
        {
            id: 5,
            name: "Fish Fillet Burger",
            price: 1100.0,
            category: "burgers",
            image: "assets/images/burger_fish.png",
        },
        // Fries
        {
            id: 6,
            name: "Spicy Potato Wedges",
            price: 550.0,
            category: "fries",
            image: "assets/images/fries_potato_wedges.png",
        },
        {
            id: 7,
            name: "Cheesy Loaded Fries",
            price: 750.0,
            category: "fries",
            image: "assets/images/fries_cheesy.png",
        },
        {
            id: 8,
            name: "Classic Salted Fries",
            price: 450.0,
            category: "fries",
            image: "assets/images/fries_classic.png",
        },
        // Drinks
        {
            id: 9,
            name: "Coca-Cola (400ml)",
            price: 250.0,
            category: "drinks",
            image: "assets/images/drink_cola.png",
        },
        {
            id: 10,
            name: "Iced Milo",
            price: 350.0,
            category: "drinks",
            image: "assets/images/drink_milo.png",
        },
        {
            id: 11,
            name: "Lime Mojito",
            price: 550.0,
            category: "drinks",
            image: "assets/images/drink_mojito.png",
        },
    ],
    customers: [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "0771234567" },
        { id: 2, name: "Jane Smith", email: "jane@mail.com", phone: "0719876543" },
        { id: 3, name: "David Johnson", email: "david.j@xyz.com", phone: "0765551234" }
    ],
    orders: []
};
