
const http = require("http");


const fs = require("fs");
const path = require("path");

const ORDERS_FILE = path.join(__dirname, "orders.json");

function loadOrders() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const data = JSON.parse(
                fs.readFileSync(ORDERS_FILE, "utf8")
            );

            return Array.isArray(data) ? data : [];
        }
    } catch (error) {
        console.error("Orders file read error:", error);
    }

    return [];
}

let orders = loadOrders();

function saveOrders() {
    const tempFile = ORDERS_FILE + ".tmp";

    fs.writeFileSync(
        tempFile,
        JSON.stringify(orders, null, 2),
        "utf8"
    );

    fs.renameSync(tempFile, ORDERS_FILE);
}

const PORT = process.env.PORT || 3000;

// Image helper
const img = (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

// Keep the original four products and their IDs
const originalProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 999,
        category: "Electronics",
        image: img("photo-1505740420928-5e560c06d30e")
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1499,
        category: "Electronics",
        image: img("photo-1523275335684-37898b6baf30")
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 799,
        category: "Electronics",
        image: img("photo-1608043152269-423dbba4e7e1")
    },
    {
        id: 4,
        name: "Wireless Mouse",
        price: 499,
        category: "Computer Accessories",
        image: img("photo-1527814050087-3793815479db")
    }
];

// 50 additional products
const newProducts = [
    // ELECTRONICS (5-17)
    {
        id: 5, name: "Premium Earbuds", price: 1299,
        category: "Electronics",
        image: img("photo-1590658268037-6bf12165a8df")
    },
    {
        id: 6, name: "Portable Speaker", price: 1199,
        category: "Electronics",
        image: img("photo-1608043152269-423dbba4e7e1")
    },
    {
        id: 7, name: "Digital Camera", price: 8999,
        category: "Electronics",
        image: img("photo-1516035069371-29a1b244cc32")
    },
    {
        id: 8, name: "Gaming Headset", price: 1799,
        category: "Electronics",
        image: img("photo-1599669454699-248893623440")
    },
    {
        id: 9, name: "LED Desk Lamp", price: 699,
        category: "Electronics",
        image: img("photo-1507473885765-e6ed057f782c")
    },
    {
        id: 10, name: "Digital Alarm Clock", price: 599,
        category: "Electronics",
        image: img("photo-1508057198894-247b23fe5ade")
    },
    {
        id: 11, name: "Action Camera", price: 5499,
        category: "Electronics",
        image: img("photo-1526170375885-4d8ecf77b99f")
    },
    {
        id: 12, name: "Tripod Stand", price: 899,
        category: "Electronics",
        image: img("photo- tripod-placeholder")
    },
    {
        id: 13, name: "USB Microphone", price: 1599,
        category: "Electronics",
        image: img("photo-1590602847861-f357a9332bbc")
    },
    {
        id: 14, name: "Portable Projector", price: 6999,
        category: "Electronics",
        image: img("photo-1478720568477-152d9b164e26")
    },
    {
        id: 15, name: "Smart LED Bulb", price: 399,
        category: "Electronics",
        image: img("photo-1507473885765-e6ed057f782c")
    },
    {
        id: 16, name: "Fitness Band", price: 999,
        category: "Electronics",
        image: img("photo-1557935728-e6d1eaabe558")
    },
    {
        id: 17, name: "Gaming Controller", price: 1499,
        category: "Electronics",
        image: img("photo-1606144042614-b2417e99c4e3")
    },

    // MOBILE ACCESSORIES (18-30)
    {
        id: 18, name: "Fast Mobile Charger", price: 499,
        category: "Mobile Accessories",
        image: img("photo-1583863788434-e58a36330cf0")
    },
    {
        id: 19, name: "Power Bank 10000mAh", price: 999,
        category: "Mobile Accessories",
        image: img("photo-1609091839311-d5365f9ff1c5")
    },
    {
        id: 20, name: "USB-C Cable", price: 199,
        category: "Mobile Accessories",
        image: img("photo-1558618666-fcd25c85cd64")
    },
    {
        id: 21, name: "Premium Phone Case", price: 299,
        category: "Mobile Accessories",
        image: img("photo-1601593346740-925612772716")
    },
    {
        id: 22, name: "Screen Protector", price: 149,
        category: "Mobile Accessories",
        image: img("photo-1511707171634-5f897ff02aa9")
    },
    {
        id: 23, name: "Car Phone Holder", price: 399,
        category: "Mobile Accessories",
        image: img("photo-1512941937669-90a1b58e7e9c")
    },
    {
        id: 24, name: "Wireless Charging Pad", price: 799,
        category: "Mobile Accessories",
        image: img("photo-1583394838336-acd977736f90")
    },
    {
        id: 25, name: "Selfie Stick", price: 349,
        category: "Mobile Accessories",
        image: img("photo-1512499617640-c74ae3a79d37")
    },
    {
        id: 26, name: "Mobile Ring Holder", price: 129,
        category: "Mobile Accessories",
        image: img("photo-1511707171634-5f897ff02aa9")
    },
    {
        id: 27, name: "Phone Stand", price: 249,
        category: "Mobile Accessories",
        image: img("photo-1512499617640-c74ae3a79d37")
    },
    {
        id: 28, name: "OTG Adapter", price: 199,
        category: "Mobile Accessories",
        image: img("photo-1558618666-fcd25c85cd64")
    },
    {
        id: 29, name: "Bluetooth Neckband", price: 699,
        category: "Mobile Accessories",
        image: img("photo-1505740420928-5e560c06d30e")
    },
    {
        id: 30, name: "Mobile Cleaning Kit", price: 149,
        category: "Mobile Accessories",
        image: img("photo-1511707171634-5f897ff02aa9")
    },

    // COMPUTER ACCESSORIES (31-42)
    {
        id: 31, name: "Mechanical Keyboard", price: 1999,
        category: "Computer Accessories",
        image: img("photo-1587829741301-dc798b83add3")
    },
    {
        id: 32, name: "Gaming Mouse", price: 899,
        category: "Computer Accessories",
        image: img("photo-1527814050087-3793815479db")
    },
    {
        id: 33, name: "Laptop Stand", price: 799,
        category: "Computer Accessories",
        image: img("photo-1527864550417-7fd91fc51a46")
    },
    {
        id: 34, name: "USB Hub", price: 499,
        category: "Computer Accessories",
        image: img("photo-1625842268584-8f3296236761")
    },
    {
        id: 35, name: "HD Webcam", price: 1299,
        category: "Computer Accessories",
        image: img("photo-1587829741301-dc798b83add3")
    },
    {
        id: 36, name: "Mouse Pad", price: 249,
        category: "Computer Accessories",
        image: img("photo-1615663245857-ac93bb7c39e7")
    },
    {
        id: 37, name: "Laptop Backpack", price: 1199,
        category: "Computer Accessories",
        image: img("photo-1553062407-98eeb64c6a62")
    },
    {
        id: 38, name: "HDMI Cable", price: 299,
        category: "Computer Accessories",
        image: img("photo-1558618666-fcd25c85cd64")
    },
    {
        id: 39, name: "Laptop Cooling Pad", price: 899,
        category: "Computer Accessories",
        image: img("photo-1496181133206-80ce9b88a853")
    },
    {
        id: 40, name: "External SSD", price: 2499,
        category: "Computer Accessories",
        image: img("photo-1597872200969-2b65d56bd16b")
    },
    {
        id: 41, name: "USB Flash Drive", price: 399,
        category: "Computer Accessories",
        image: img("photo-1618410320928-25228d811631")
    },
    {
        id: 42, name: "Laptop Sleeve", price: 599,
        category: "Computer Accessories",
        image: img("photo-1496181133206-80ce9b88a853")
    },

    // FASHION (43-54)
    {
        id: 43, name: "Classic Cotton T-Shirt", price: 499,
        category: "Fashion",
        image: img("photo-1521572163474-6864f9cf17ab")
    },
    {
        id: 44, name: "Casual Sneakers", price: 1299,
        category: "Fashion",
        image: img("photo-1542291026-7eec264c27ff")
    },
    {
        id: 45, name: "Leather Wallet", price: 599,
        category: "Fashion",
        image: img("photo-1627123424574-724758594e93")
    },
    {
        id: 46, name: "Travel Backpack", price: 999,
        category: "Fashion",
        image: img("photo-1553062407-98eeb64c6a62")
    },
    {
        id: 47, name: "Classic Sunglasses", price: 699,
        category: "Fashion",
        image: img("photo-1511499767150-a48a237f0083")
    },
    {
        id: 48, name: "Casual Wrist Watch", price: 1099,
        category: "Fashion",
        image: img("photo-1523275335684-37898b6baf30")
    },
    {
        id: 49, name: "Baseball Cap", price: 299,
        category: "Fashion",
        image: img("photo-1588850561407-ed78c282e89b")
    },
    {
        id: 50, name: "Running Shoes", price: 1499,
        category: "Fashion",
        image: img("photo-1542291026-7eec264c27ff")
    },
    {
        id: 51, name: "Denim Jeans", price: 999,
        category: "Fashion",
        image: img("photo-1542272604-787c3835535d")
    },
    {
        id: 52, name: "Casual Shirt", price: 799,
        category: "Fashion",
        image: img("photo-1596755094514-f87e34085b2c")
    },
    {
        id: 53, name: "Sports Backpack", price: 899,
        category: "Fashion",
        image: img("photo-1622560480654-d96214fdc887")
    },
    {
        id: 54, name: "Sports T-Shirt", price: 599,
        category: "Fashion",
        image: img("photo-1503342217505-b0a15ec3261c")
    }
];

const products = [...originalProducts, ...newProducts];

// ---------- HTTP SERVER ----------
const server = http.createServer((req, res) => {
    // Allow frontend requests from a different local port
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }
     if (req.method === "GET" && req.url === "/") {
    const indexPath = path.join(__dirname, "..", "..", "index.html");

    fs.readFile(indexPath, (err, data) => {
        if (err) {
            res.writeHead(500, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            return res.end("Deva Store homepage load failed.");
        }

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(data);
    });

    return;
}

    if (req.method === "GET" && req.url === "/api/products") {
        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });

        return res.end(JSON.stringify(products));
    }

    if (req.method === "GET" && req.url === "/api/categories") {
        const categories = [...new Set(
            products.map(product => product.category)
        )];

        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });

        return res.end(JSON.stringify(categories));
    }
    
    // CREATE A NEW ORDER
    if (req.method === "POST" && req.url === "/api/orders") {
        let body = "";
        let tooLarge = false;

        req.on("data", chunk => {
            body += chunk.toString();

            if (body.length > 100000) {
                tooLarge = true;
                res.writeHead(413, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    error: "Request too large"
                }));
                req.destroy();
            }
        });

        req.on("end", () => {
            if (tooLarge) return;

            try {
                const data = JSON.parse(body);

                const customer = data.customer;
                const email = data.email;
                const address = data.address;
                const items = data.items;

                if (
                    typeof customer !== "string" ||
                    customer.trim().length < 2 ||
                    customer.trim().length > 100 ||
                    typeof email !== "string" ||
                    email.length > 254 ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                    typeof address !== "string" ||
                    address.trim().length < 5 ||
                    address.trim().length > 1000 ||
                    !Array.isArray(items) ||
                    items.length === 0 ||
                    items.length > 50
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    return res.end(JSON.stringify({
                        error: "Customer details किंवा Cart माहिती चुकीची आहे."
                    }));
                }

                // Recalculate all prices on the server.
                const orderItems = [];

                for (const item of items) {
                    if (
                        !item ||
                        !Number.isInteger(Number(item.qty)) ||
                        Number(item.qty) < 1 ||
                        Number(item.qty) > 20
                    ) {
                        res.writeHead(400, {
                            "Content-Type": "application/json"
                        });

                        return res.end(JSON.stringify({
                            error: "Quantity चुकीची आहे."
                        }));
                    }

                    const product = products.find(
                        p => String(p.id) === String(item.id)
                    );

                    if (
                        !product ||
                        !Number.isFinite(Number(product.price)) ||
                        Number(product.price) < 0
                    ) {
                        res.writeHead(400, {
                            "Content-Type": "application/json"
                        });

                        return res.end(JSON.stringify({
                            error: "Cart मधील एक Product उपलब्ध नाही."
                        }));
                    }

                    orderItems.push({
                        productId: product.id,
                        name: product.name,
                        price: Number(product.price),
                        quantity: Number(item.qty),
                        subtotal:
                            Number(product.price) * Number(item.qty)
                    });
                }

                const subtotal = orderItems.reduce(
                    (sum, item) => sum + item.subtotal,
                    0
                );

                // Match the existing demo cart discount.
                const discount = Math.round(subtotal * 0.10);
                const total = subtotal - discount;

                const order = {
                    id: "DEVA-" + Date.now() + "-" +
                        Math.floor(Math.random() * 10000),
                    customer: customer.trim(),
                    email: email.trim(),
                    address: address.trim(),
                    items: orderItems,
                    subtotal,
                    discount,
                    total,
                    status: "Pending",
                    paymentStatus: "Not paid",
                    createdAt: new Date().toISOString()
                };

                orders.push(order);

                try {
                    saveOrders();
                } catch (saveError) {
                    orders.pop();
                    throw saveError;
                }

                res.writeHead(201, {
                    "Content-Type": "application/json; charset=utf-8"
                });

                return res.end(JSON.stringify({
                    message: "Order successfully created",
                    order
                }));

            } catch (error) {
                console.error("Create order error:", error);

                if (!res.headersSent) {
                    res.writeHead(400, {
                        "Content-Type": "application/json; charset=utf-8"
                    });

                    res.end(JSON.stringify({
                        error: "Order तयार करता आला नाही. माहिती तपासा."
                    }));
                }
            }
        });

        return;
    }

    // GET ALL ORDERS (local development only)
    if (req.method === "GET" && req.url === "/api/orders") {
        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });

        return res.end(JSON.stringify(orders));
    }


    res.writeHead(404, {
        "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
        error: "Route not found",
        availableRoutes: ["/", "/api/products", "/api/categories"]
    }));
});

server.listen(PORT, () => {
    console.log("-----------------------------------");
    console.log(" DEVA STORE SERVER STARTED");
    console.log(` http://localhost:${PORT}`);
    console.log(` Total Products: ${products.length}`);
    console.log(" New Products: 50");
    console.log("-----------------------------------");
});
