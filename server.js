const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ======================================================
   MIDDLEWARE
====================================================== */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   DATABASE SETUP
====================================================== */

const databaseFolder = path.join(__dirname, "database");

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
}

const dbPath = path.join(databaseFolder, "petcare.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
    } else {
        console.log("✅ SQLite database connected");
    }
});

/* ======================================================
   DATABASE TABLES
====================================================== */

db.serialize(() => {

    // USERS
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // PRODUCTS
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            rating REAL DEFAULT 0,
            stock INTEGER DEFAULT 0,
            description TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ORDERS
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            pincode TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ORDER ITEMS
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER,
            product_name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL
        )
    `);

    // CONTACTS
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // WISHLIST
    db.run(`
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Make sure old databases have user_id
    db.all(
        "PRAGMA table_info(orders)",
        [],
        (err, columns) => {
            if (err) {
                console.error("❌ Could not inspect orders table:", err.message);
                return;
            }

            const hasUserId = columns.some(
                (column) => column.name === "user_id"
            );

            if (!hasUserId) {
                db.run(
                    "ALTER TABLE orders ADD COLUMN user_id INTEGER",
                    (alterErr) => {
                        if (alterErr) {
                            console.error(
                                "❌ Could not add user_id:",
                                alterErr.message
                            );
                        } else {
                            console.log(
                                "✅ Added user_id column to orders table"
                            );
                        }
                    }
                );
            }
        }
    );

    /* ==================================================
       DEFAULT PRODUCTS
    ================================================== */

    db.get(
        "SELECT COUNT(*) AS count FROM products",
        [],
        (err, row) => {
            if (err) {
                console.error(
                    "❌ Product count error:",
                    err.message
                );
                return;
            }

            if (row.count === 0) {

                const products = [
                    [
                        "Premium Dog Treats",
                        "Nutrition",
                        450,
                        4.8,
                        25,
                        "Healthy and delicious treats for dogs.",
                        "https://images.unsplash.com/photo-1582798358481-d199fb734d7d?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Interactive Cat Ball",
                        "Cats",
                        399,
                        4.5,
                        18,
                        "Fun interactive toy to keep cats active.",
                        "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Gentle Pet Shampoo",
                        "Grooming & Care",
                        599,
                        4.6,
                        30,
                        "Gentle shampoo suitable for regular pet grooming.",
                        "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Cat Grooming Brush",
                        "Grooming & Care",
                        349,
                        4.6,
                        22,
                        "Soft grooming brush for healthy and shiny fur.",
                        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Squeaky Duck Toy",
                        "Play & Enrichment",
                        499,
                        4.7,
                        20,
                        "Fun squeaky toy for active pets.",
                        "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Healthy Puppy Food",
                        "Nutrition",
                        799,
                        4.8,
                        28,
                        "Balanced nutrition for growing puppies.",
                        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Comfort Pet Bed",
                        "Dogs",
                        999,
                        4.9,
                        15,
                        "Comfortable and cozy bed for pets.",
                        "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Healthy Cat Food",
                        "Nutrition",
                        599,
                        4.8,
                        35,
                        "Nutritious food for healthy and active cats.",
                        "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80"
                    ],
                    [
                        "Interactive Rope Toy",
                        "Play & Enrichment",
                        699,
                        4.7,
                        20,
                        "Durable rope toy for interactive play.",
                        "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80"
                    ]
                ];

                const insertProduct = db.prepare(`
                    INSERT INTO products
                    (
                        name,
                        category,
                        price,
                        rating,
                        stock,
                        description,
                        image
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

                products.forEach((product) => {
                    insertProduct.run(product);
                });

                insertProduct.finalize();

                console.log("✅ Default products added");
            }
        }
    );
});

/* ======================================================
   HOME / API TEST
====================================================== */

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "PetCareWebsite Backend API is running 🐾"
    });
});

/* ======================================================
   GET PRODUCTS
====================================================== */

app.get("/api/products", (req, res) => {

    const {
        search = "",
        category = ""
    } = req.query;

    let sql = "SELECT * FROM products WHERE 1 = 1";
    const params = [];

    if (search) {
        sql += `
            AND (
                name LIKE ?
                OR description LIKE ?
            )
        `;

        params.push(
            `%${search}%`,
            `%${search}%`
        );
    }

    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }

    sql += " ORDER BY created_at DESC";

    db.all(sql, params, (err, rows) => {

        if (err) {
            console.error(
                "❌ Get products error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch products",
                error: err.message
            });
        }

        res.json({
            success: true,
            products: rows
        });
    });
});

/* ======================================================
   GET SINGLE PRODUCT
====================================================== */

app.get("/api/products/:id", (req, res) => {

    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }

    db.get(
        "SELECT * FROM products WHERE id = ?",
        [productId],
        (err, product) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch product",
                    error: err.message
                });
            }

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.json({
                success: true,
                product
            });
        }
    );
});

/* ======================================================
   ADD PRODUCT - ADMIN
====================================================== */

app.post("/api/products", (req, res) => {

    const {
        name,
        category,
        price,
        rating,
        stock,
        description,
        image
    } = req.body;

    if (!name || !category || price === undefined) {
        return res.status(400).json({
            success: false,
            message: "Name, category and price are required"
        });
    }

    db.run(
        `
        INSERT INTO products
        (
            name,
            category,
            price,
            rating,
            stock,
            description,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            name,
            category,
            Number(price),
            Number(rating || 0),
            Number(stock || 0),
            description || "",
            image || ""
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to add product",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Product added successfully",
                productId: this.lastID
            });
        }
    );
});

/* ======================================================
   UPDATE PRODUCT - ADMIN
====================================================== */

app.put("/api/products/:id", (req, res) => {

    const productId = Number(req.params.id);

    const {
        name,
        category,
        price,
        rating,
        stock,
        description,
        image
    } = req.body;

    if (!Number.isInteger(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }

    db.run(
        `
        UPDATE products
        SET
            name = ?,
            category = ?,
            price = ?,
            rating = ?,
            stock = ?,
            description = ?,
            image = ?
        WHERE id = ?
        `,
        [
            name,
            category,
            Number(price),
            Number(rating || 0),
            Number(stock || 0),
            description || "",
            image || "",
            productId
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update product",
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.json({
                success: true,
                message: "Product updated successfully"
            });
        }
    );
});

/* ======================================================
   DELETE PRODUCT - ADMIN
====================================================== */

app.delete("/api/products/:id", (req, res) => {

    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }

    db.run(
        "DELETE FROM products WHERE id = ?",
        [productId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete product",
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.json({
                success: true,
                message: "Product deleted successfully"
            });
        }
    );
});

/* ======================================================
   CREATE ORDER
====================================================== */

app.post("/api/orders", (req, res) => {

    const {
        userId,
        customerName,
        phone,
        address,
        city,
        state,
        pincode,
        paymentMethod,
        items,
        total
    } = req.body;

    /* ---------------- VALIDATION ---------------- */

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    if (!customerName) {
        return res.status(400).json({
            success: false,
            message: "Customer name is required"
        });
    }

    if (!phone) {
        return res.status(400).json({
            success: false,
            message: "Phone number is required"
        });
    }

    if (!address) {
        return res.status(400).json({
            success: false,
            message: "Address is required"
        });
    }

    if (!city) {
        return res.status(400).json({
            success: false,
            message: "City is required"
        });
    }

    if (!state) {
        return res.status(400).json({
            success: false,
            message: "State is required"
        });
    }

    if (!pincode) {
        return res.status(400).json({
            success: false,
            message: "PIN code is required"
        });
    }

    if (!paymentMethod) {
        return res.status(400).json({
            success: false,
            message: "Payment method is required"
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Order must contain at least one item"
        });
    }

    if (total === undefined || total === null) {
        return res.status(400).json({
            success: false,
            message: "Order total is required"
        });
    }

    /* ---------------- INSERT ORDER ---------------- */

    const orderQuery = `
        INSERT INTO orders
        (
            user_id,
            customer_name,
            phone,
            address,
            city,
            state,
            pincode,
            payment_method,
            total,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        orderQuery,
        [
            Number(userId),
            customerName,
            phone,
            address,
            city,
            state,
            pincode,
            paymentMethod,
            Number(total),
            "Pending"
        ],
        function (err) {

            if (err) {

                console.error(
                    "❌ Order database error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to save order",
                    error: err.message
                });
            }

            const orderId = this.lastID;

            console.log(
                `✅ Order #${orderId} created for user #${userId}`
            );

            /* ---------------- ORDER ITEMS ---------------- */

            const itemQuery = `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    product_name,
                    price,
                    quantity
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            let completed = 0;
            let hasError = false;

            items.forEach((item) => {

                db.run(
                    itemQuery,
                    [
                        orderId,
                        item.productId || item.id || null,
                        item.productName || item.name || "Product",
                        Number(item.price),
                        Number(item.quantity)
                    ],
                    (itemErr) => {

                        if (hasError) {
                            return;
                        }

                        if (itemErr) {

                            hasError = true;

                            console.error(
                                "❌ Order item database error:",
                                itemErr.message
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Failed to save order items",
                                error: itemErr.message
                            });
                        }

                        completed++;

                        if (completed === items.length) {

                            console.log(
                                `✅ Order #${orderId} placed successfully`
                            );

                            console.log(
                                "💵 Payment:",
                                paymentMethod
                            );

                            res.status(201).json({
                                success: true,
                                message: "Order placed successfully!",
                                orderId: orderId
                            });
                        }
                    }
                );
            });
        }
    );
});

/* ======================================================
   GET ORDERS
   CUSTOMER:
   /api/orders?userId=1

   ADMIN:
   /api/orders
====================================================== */

app.get("/api/orders", (req, res) => {

    const { userId } = req.query;

    let sql = `
        SELECT *
        FROM orders
    `;

    const params = [];

    if (userId) {
        sql += " WHERE user_id = ?";
        params.push(Number(userId));
    }

    sql += " ORDER BY created_at DESC";

    db.all(
        sql,
        params,
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch orders",
                    error: err.message
                });
            }

            res.json({
                success: true,
                orders: rows
            });
        }
    );
});

/* ======================================================
   GET SINGLE ORDER
====================================================== */

app.get("/api/orders/:id", (req, res) => {

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID"
        });
    }

    db.get(
        `
        SELECT *
        FROM orders
        WHERE id = ?
        `,
        [orderId],
        (err, order) => {

            if (err) {

                console.error(
                    "❌ Get order error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Unable to fetch order",
                    error: err.message
                });
            }

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });
            }

            res.json({
                success: true,
                order
            });
        }
    );
});

/* ======================================================
   GET ORDER ITEMS
====================================================== */

app.get("/api/orders/:id/items", (req, res) => {

    const orderId = Number(req.params.id);

    db.all(
        `
        SELECT *
        FROM order_items
        WHERE order_id = ?
        `,
        [orderId],
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch order items",
                    error: err.message
                });
            }

            res.json({
                success: true,
                items: rows
            });
        }
    );
});

/* ======================================================
   UPDATE ORDER STATUS
====================================================== */

app.put("/api/orders/:id/status", (req, res) => {

    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status is required"
        });
    }

    const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order status"
        });
    }

    db.run(
        `
        UPDATE orders
        SET status = ?
        WHERE id = ?
        `,
        [status, orderId],
        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to update order status",
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });
            }

            res.json({
                success: true,
                message: "Order status updated successfully"
            });
        }
    );
});

/* ======================================================
   CONTACT FORM
====================================================== */

app.post("/api/contact", (req, res) => {

    const {
        name,
        email,
        phone,
        message
    } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Name, email and message are required"
        });
    }

    db.run(
        `
        INSERT INTO contacts
        (
            name,
            email,
            phone,
            message
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            name,
            email,
            phone || "",
            message
        ],
        function (err) {

            if (err) {

                console.error(
                    "❌ Contact error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to send message",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Your message has been sent successfully!",
                contactId: this.lastID
            });
        }
    );
});

/* ======================================================
   GET CONTACT MESSAGES - ADMIN
====================================================== */

app.get("/api/contact", (req, res) => {

    db.all(
        `
        SELECT *
        FROM contacts
        ORDER BY created_at DESC
        `,
        [],
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch contact messages",
                    error: err.message
                });
            }

            res.json({
                success: true,
                messages: rows
            });
        }
    );
});

/* ======================================================
   ADD TO WISHLIST
====================================================== */

app.post("/api/wishlist", (req, res) => {

    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }

    db.run(
        `
        INSERT INTO wishlist
        (product_id)
        VALUES (?)
        `,
        [productId],
        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to add to wishlist",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Added to wishlist",
                wishlistId: this.lastID
            });
        }
    );
});

/* ======================================================
   GET WISHLIST
====================================================== */

app.get("/api/wishlist", (req, res) => {

    db.all(
        `
        SELECT
            wishlist.id AS wishlist_id,
            products.*
        FROM wishlist
        JOIN products
            ON wishlist.product_id = products.id
        ORDER BY wishlist.created_at DESC
        `,
        [],
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch wishlist",
                    error: err.message
                });
            }

            res.json({
                success: true,
                wishlist: rows
            });
        }
    );
});

/* ======================================================
   DELETE WISHLIST ITEM
====================================================== */

app.delete("/api/wishlist/:productId", (req, res) => {

    const productId = Number(req.params.productId);

    db.run(
        `
        DELETE FROM wishlist
        WHERE product_id = ?
        `,
        [productId],
        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to remove from wishlist",
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Removed from wishlist"
            });
        }
    );
});

/* ======================================================
   ADMIN LOGIN
====================================================== */

app.post("/api/admin/login", (req, res) => {

    const { email, password } = req.body;

    console.log(
        "🔐 Admin login attempt:",
        email
    );

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    const ADMIN_EMAIL =
        process.env.ADMIN_EMAIL ||
        "admin@petcarewebsite.com";

    const ADMIN_PASSWORD =
        process.env.ADMIN_PASSWORD ||
        "admin123";

    if (
        email.trim().toLowerCase() !==
            ADMIN_EMAIL.toLowerCase() ||
        password !== ADMIN_PASSWORD
    ) {

        return res.status(401).json({
            success: false,
            message: "Invalid email or password."
        });
    }

    console.log(
        "✅ Admin login successful"
    );

    res.json({
        success: true,
        message: "Admin login successful.",
        admin: {
            email: ADMIN_EMAIL,
            name: "PetCareWebsite Admin",
            role: "admin"
        }
    });
});

/* ======================================================
   CUSTOMER REGISTER
====================================================== */

app.post("/api/auth/register", async (req, res) => {

    const {
        name,
        email,
        phone,
        password
    } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required."
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters."
        });
    }

    try {

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone
            ? phone.trim()
            : "";

        db.get(
            "SELECT id FROM users WHERE email = ?",
            [cleanEmail],
            async (err, existingUser) => {

                if (err) {

                    return res.status(500).json({
                        success: false,
                        message: "Database error.",
                        error: err.message
                    });
                }

                if (existingUser) {

                    return res.status(409).json({
                        success: false,
                        message:
                            "An account with this email already exists."
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );

                db.run(
                    `
                    INSERT INTO users
                    (
                        name,
                        email,
                        phone,
                        password
                    )
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        cleanName,
                        cleanEmail,
                        cleanPhone,
                        hashedPassword
                    ],
                    function (insertErr) {

                        if (insertErr) {

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to create account.",
                                error:
                                    insertErr.message
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message:
                                "Account created successfully.",
                            user: {
                                id: this.lastID,
                                name: cleanName,
                                email: cleanEmail,
                                phone: cleanPhone
                            }
                        });
                    }
                );
            }
        );

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Registration failed.",
            error: error.message
        });
    }
});

/* ======================================================
   CUSTOMER LOGIN
====================================================== */

app.post("/api/auth/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    const cleanEmail =
        email.trim().toLowerCase();

    db.get(
        `
        SELECT
            id,
            name,
            email,
            phone,
            password
        FROM users
        WHERE email = ?
        `,
        [cleanEmail],
        async (err, user) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database error.",
                    error: err.message
                });
            }

            if (!user) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            res.json({
                success: true,
                message: "Login successful.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });
        }
    );
});

/* ======================================================
   SERVE REACT FRONTEND
====================================================== */

const clientDistPath = path.join(
    __dirname,
    "client",
    "dist"
);

app.use(express.static(clientDistPath));

/* ======================================================
   REACT ROUTING FALLBACK
====================================================== */

app.use((req, res, next) => {
    if (
        req.method === "GET" &&
        req.accepts("html")
    ) {
        return res.sendFile(
            path.join(
                clientDistPath,
                "index.html"
            )
        );
    }

    next();
});

/* ======================================================
   404 HANDLER
====================================================== */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

/* ======================================================
   START SERVER
====================================================== */

app.listen(PORT, () => {

    console.log("");
    console.log("==========================================");
    console.log("🐾 PetCareWebsite Backend");
    console.log("==========================================");
    console.log(
        `🚀 Server running on port ${PORT}`
    );
    console.log(
        `🌐 http://localhost:${PORT}`
    );
    console.log(
        `📦 Products: http://localhost:${PORT}/api/products`
    );
    console.log(
        `🛒 Orders: http://localhost:${PORT}/api/orders`
    );
    console.log(
        `🔐 Admin Login: http://localhost:${PORT}/api/admin/login`
    );
    console.log("==========================================");
    console.log("");
});