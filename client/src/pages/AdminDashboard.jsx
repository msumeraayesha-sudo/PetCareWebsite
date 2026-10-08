import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "";

function AdminDashboard() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [ordersResponse, productsResponse] =
                await Promise.all([
                    fetch(`${API_URL}/api/orders`),
                    fetch(`${API_URL}/api/products`),
                ]);

            if (!ordersResponse.ok || !productsResponse.ok) {
                throw new Error("Unable to load dashboard data.");
            }

            const ordersData = await ordersResponse.json();
            const productsData = await productsResponse.json();

            setOrders(
                Array.isArray(ordersData)
                    ? ordersData
                    : ordersData.orders || []
            );

            setProducts(
                Array.isArray(productsData)
                    ? productsData
                    : productsData.products || []
            );
        } catch (err) {
            console.error("Dashboard error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const totalRevenue = useMemo(() => {
        return orders.reduce(
            (total, order) =>
                total + Number(order.total || 0),
            0
        );
    }, [orders]);

    const pendingOrders = useMemo(() => {
        return orders.filter(
            (order) =>
                String(order.status || "").toLowerCase() ===
                "pending"
        ).length;
    }, [orders]);

    const completedOrders = useMemo(() => {
        return orders.filter(
            (order) =>
                String(order.status || "").toLowerCase() ===
                "completed"
        ).length;
    }, [orders]);

    const processingOrders = useMemo(() => {
        return orders.filter(
            (order) =>
                String(order.status || "").toLowerCase() ===
                    "processing" ||
                String(order.status || "").toLowerCase() ===
                    "shipped"
        ).length;
    }, [orders]);

    const lowStockProducts = useMemo(() => {
        return products.filter(
            (product) => Number(product.stock || 0) <= 10
        );
    }, [products]);

    const outOfStockProducts = useMemo(() => {
        return products.filter(
            (product) => Number(product.stock || 0) <= 0
        );
    }, [products]);

    const totalInventory = useMemo(() => {
        return products.reduce(
            (total, product) =>
                total + Number(product.stock || 0),
            0
        );
    }, [products]);

    const averageOrderValue =
        orders.length > 0
            ? totalRevenue / orders.length
            : 0;

    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        const value = String(status || "Pending")
            .toLowerCase()
            .replace(/\s+/g, "-");

        return `admin-status-badge ${value}`;
    };

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort(
                (a, b) =>
                    new Date(b.created_at || 0) -
                    new Date(a.created_at || 0)
            )
            .slice(0, 5);
    }, [orders]);

    const topProducts = useMemo(() => {
        return [...products]
            .sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
            )
            .slice(0, 5);
    }, [products]);

    const handleOrderClick = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    return (
        <section className="admin-dashboard-page">

            {/* HEADER */}
            <div className="admin-page-header">
                <div>
                    <span className="admin-page-eyebrow">
                        🐾 PETCAREWEBSITE
                    </span>

                    <h1>Dashboard</h1>

                    <p>
                        A quick look at your store,
                        orders and inventory.
                    </p>
                </div>

                <button
                    className="admin-refresh-btn"
                    onClick={loadDashboard}
                    disabled={loading}
                >
                    🔄{" "}
                    {loading
                        ? "Refreshing..."
                        : "Refresh Data"}
                </button>
            </div>

            {/* ERROR */}
            {error && (
                <div className="admin-dashboard-error">
                    <span>⚠️</span>
                    <div>
                        <strong>
                            Unable to load dashboard
                        </strong>
                        <p>{error}</p>
                    </div>

                    <button onClick={loadDashboard}>
                        Try Again
                    </button>
                </div>
            )}

            {/* MAIN STATS */}
            <div className="admin-stat-grid">

                <div className="admin-stat-card revenue-card">
                    <div className="admin-stat-icon green">
                        💰
                    </div>

                    <div>
                        <span>Total Revenue</span>

                        <strong>
                            {formatCurrency(
                                totalRevenue
                            )}
                        </strong>

                        <small>
                            From {orders.length} order
                            {orders.length !== 1
                                ? "s"
                                : ""}
                        </small>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange">
                        📦
                    </div>

                    <div>
                        <span>Total Orders</span>

                        <strong>
                            {orders.length}
                        </strong>

                        <small>
                            {processingOrders} in progress
                        </small>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon brown">
                        ⏳
                    </div>

                    <div>
                        <span>Pending Orders</span>

                        <strong>
                            {pendingOrders}
                        </strong>

                        <small>
                            {pendingOrders > 0
                                ? "Need attention"
                                : "All caught up"}
                        </small>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon sage">
                        🛍️
                    </div>

                    <div>
                        <span>Total Products</span>

                        <strong>
                            {products.length}
                        </strong>

                        <small>
                            {lowStockProducts.length} low
                            stock
                        </small>
                    </div>
                </div>
            </div>

            {/* MINI INSIGHTS */}
            <div className="admin-insight-grid">

                <div className="admin-insight-card">
                    <div className="admin-insight-icon">
                        📈
                    </div>

                    <div>
                        <span>Average Order</span>
                        <strong>
                            {formatCurrency(
                                averageOrderValue
                            )}
                        </strong>
                    </div>
                </div>

                <div className="admin-insight-card">
                    <div className="admin-insight-icon">
                        📦
                    </div>

                    <div>
                        <span>Inventory Units</span>
                        <strong>
                            {totalInventory}
                        </strong>
                    </div>
                </div>

                <div className="admin-insight-card">
                    <div className="admin-insight-icon">
                        ⚠️
                    </div>

                    <div>
                        <span>Low Stock</span>
                        <strong>
                            {lowStockProducts.length}
                        </strong>
                    </div>
                </div>

                <div className="admin-insight-card">
                    <div className="admin-insight-icon">
                        ✅
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>
                            {completedOrders}
                        </strong>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="admin-section-card admin-quick-card">

                <div className="admin-section-heading">
                    <div>
                        <span>⚡</span>

                        <div>
                            <h2>Quick Actions</h2>
                            <p>
                                Manage your store quickly.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="admin-quick-actions">

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                    >
                        <span>🛍️</span>

                        <div>
                            <strong>
                                Manage Products
                            </strong>

                            <small>
                                Add, edit or remove
                                products
                            </small>
                        </div>

                        <b>→</b>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >
                        <span>📦</span>

                        <div>
                            <strong>
                                Manage Orders
                            </strong>

                            <small>
                                View and update orders
                            </small>
                        </div>

                        <b>→</b>
                    </button>

                    <button
                        onClick={() =>
                            navigate("/admin/messages")
                        }
                    >
                        <span>💬</span>

                        <div>
                            <strong>
                                Customer Messages
                            </strong>

                            <small>
                                Read customer enquiries
                            </small>
                        </div>

                        <b>→</b>
                    </button>

                    <button
                        onClick={() => navigate("/")}
                    >
                        <span>🌐</span>

                        <div>
                            <strong>
                                View Website
                            </strong>

                            <small>
                                Open customer website
                            </small>
                        </div>

                        <b>→</b>
                    </button>
                </div>
            </div>

            {/* DASHBOARD COLUMNS */}
            <div className="admin-dashboard-columns">

                {/* RECENT ORDERS */}
                <div className="admin-section-card">

                    <div className="admin-section-heading">
                        <div>
                            <span>📦</span>

                            <div>
                                <h2>Recent Orders</h2>

                                <p>
                                    Latest customer
                                    orders.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/orders"
                                )
                            }
                            className="admin-view-all"
                        >
                            View All →
                        </button>
                    </div>

                    {loading ? (
                        <div className="admin-empty-state">
                            <div className="admin-spinner"></div>
                            <p>
                                Loading orders...
                            </p>
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="admin-empty-state">
                            <span>📭</span>
                            <p>
                                No orders yet.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.map(
                                        (order) => (
                                            <tr
                                                key={
                                                    order.id
                                                }
                                                onClick={() =>
                                                    handleOrderClick(
                                                        order.id
                                                    )
                                                }
                                                title="Open order details"
                                            >
                                                <td>
                                                    <strong>
                                                        #
                                                        {
                                                            order.id
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <div className="admin-customer">
                                                        <div className="admin-mini-avatar">
                                                            {(
                                                                order.customer_name ||
                                                                "C"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <span>
                                                            {order.customer_name ||
                                                                "Customer"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {formatCurrency(
                                                            order.total
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getStatusClass(
                                                            order.status
                                                        )}
                                                    >
                                                        {order.status ||
                                                            "Pending"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        order.created_at
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* INVENTORY */}
                <div className="admin-section-card">

                    <div className="admin-section-heading">
                        <div>
                            <span>📊</span>

                            <div>
                                <h2>
                                    Inventory Health
                                </h2>

                                <p>
                                    Product stock
                                    overview.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            className="admin-view-all"
                        >
                            Products →
                        </button>
                    </div>

                    <div className="admin-inventory-summary">

                        <div>
                            <span>
                                All Products
                            </span>

                            <strong>
                                {products.length}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Low Stock
                            </span>

                            <strong className="warning">
                                {
                                    lowStockProducts.length
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Out of Stock
                            </span>

                            <strong className="danger">
                                {
                                    outOfStockProducts.length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="admin-stock-list">

                        {products.length === 0 ? (
                            <div className="admin-empty-state">
                                <span>🛍️</span>

                                <p>
                                    No products
                                    available.
                                </p>
                            </div>
                        ) : (
                            products
                                .slice(0, 5)
                                .map((product) => {
                                    const stock =
                                        Number(
                                            product.stock ||
                                                0
                                        );

                                    return (
                                        <div
                                            className="admin-stock-item"
                                            key={
                                                product.id
                                            }
                                        >
                                            <div className="admin-stock-icon">
                                                🐾
                                            </div>

                                            <div className="admin-stock-info">
                                                <strong>
                                                    {
                                                        product.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        product.category
                                                    }
                                                </span>
                                            </div>

                                            <div
                                                className={`admin-stock-number ${
                                                    stock <=
                                                    10
                                                        ? "low"
                                                        : ""
                                                } ${
                                                    stock <=
                                                    0
                                                        ? "empty"
                                                        : ""
                                                }`}
                                            >
                                                {stock}

                                                <small>
                                                    {stock ===
                                                    1
                                                        ? "left"
                                                        : "left"}
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>
            </div>

            {/* TOP PRODUCTS */}
            <div className="admin-section-card">

                <div className="admin-section-heading">
                    <div>
                        <span>⭐</span>

                        <div>
                            <h2>
                                Top Rated Products
                            </h2>

                            <p>
                                Your highest-rated
                                products.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        className="admin-view-all"
                    >
                        Manage →
                    </button>
                </div>

                <div className="admin-top-products">

                    {topProducts.length === 0 ? (
                        <div className="admin-empty-state">
                            <span>⭐</span>

                            <p>
                                No products available.
                            </p>
                        </div>
                    ) : (
                        topProducts.map(
                            (product, index) => (
                                <div
                                    className="admin-top-product"
                                    key={product.id}
                                >
                                    <div className="admin-product-rank">
                                        #{index + 1}
                                    </div>

                                    <div className="admin-product-info">
                                        <strong>
                                            {
                                                product.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                product.category
                                            }
                                        </span>
                                    </div>

                                    <div className="admin-product-rating">
                                        ⭐{" "}
                                        {Number(
                                            product.rating ||
                                                0
                                        ).toFixed(1)}
                                    </div>

                                    <strong className="admin-product-price">
                                        {formatCurrency(
                                            product.price
                                        )}
                                    </strong>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>

            {/* STORE HEALTH */}
            <div className="admin-section-card admin-health-card">

                <div>
                    <span className="admin-health-icon">
                        💚
                    </span>

                    <div>
                        <h2>
                            Store health
                        </h2>

                        <p>
                            Your PetCareWebsite store
                            is ready to serve pet
                            parents.
                        </p>
                    </div>
                </div>

                <div className="admin-health-items">

                    <span>
                        {orders.length >= 0
                            ? "✓"
                            : "!"}{" "}
                        Orders connected
                    </span>

                    <span>
                        {products.length > 0
                            ? "✓"
                            : "!"}{" "}
                        Products available
                    </span>

                    <span>
                        {outOfStockProducts.length ===
                        0
                            ? "✓"
                            : "!"}{" "}
                        Inventory healthy
                    </span>
                </div>
            </div>

            {/* BOTTOM BANNER */}
            <div className="admin-dashboard-banner">

                <div>
                    <span>🐶 🐱</span>

                    <div>
                        <h2>
                            Keep making pets happier!
                        </h2>

                        <p>
                            Manage your products and
                            orders from one simple
                            dashboard.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/")}
                >
                    Visit Store →
                </button>
            </div>
        </section>
    );
}

export default AdminDashboard;