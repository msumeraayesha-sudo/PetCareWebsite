import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const savedUser = localStorage.getItem("petCareUser");

            if (!savedUser) {
                setError("Please login to view your orders.");
                setLoading(false);
                return;
            }

            const user = JSON.parse(savedUser);

            if (!user?.id) {
                setError("Unable to identify your account.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/orders?userId=${user.id}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Unable to load orders."
                );
            }

            setOrders(data.orders || []);
        } catch (err) {
            console.error("❌ Orders error:", err);

            setError(
                err.message ||
                "Unable to load your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getStatusClass = (status) => {
        const normalizedStatus =
            String(status || "Pending").toLowerCase();

        if (normalizedStatus === "delivered") {
            return "status-delivered";
        }

        if (normalizedStatus === "shipped") {
            return "status-shipped";
        }

        if (normalizedStatus === "confirmed") {
            return "status-confirmed";
        }

        if (normalizedStatus === "processing") {
            return "status-confirmed";
        }

        if (normalizedStatus === "cancelled") {
            return "status-cancelled";
        }

        return "status-pending";
    };

    const getStatusIcon = (status) => {
        const normalizedStatus =
            String(status || "Pending").toLowerCase();

        if (normalizedStatus === "delivered") {
            return "✓";
        }

        if (normalizedStatus === "shipped") {
            return "🚚";
        }

        if (
            normalizedStatus === "confirmed" ||
            normalizedStatus === "processing"
        ) {
            return "✓";
        }

        if (normalizedStatus === "cancelled") {
            return "✕";
        }

        return "⏳";
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="orders-page">
                <section className="orders-state">
                    <div className="orders-loading-icon">
                        🐾
                    </div>

                    <h2>
                        Fetching Your Orders...
                    </h2>

                    <p>
                        Please wait while we load
                        your order history.
                    </p>
                </section>
            </div>
        );
    }

    /* =========================================
       ERROR
    ========================================= */

    if (error) {
        return (
            <div className="orders-page">
                <section className="orders-state">
                    <div className="orders-error-icon">
                        ⚠️
                    </div>

                    <span className="eyebrow">
                        SOMETHING WENT WRONG
                    </span>

                    <h1>
                        We Couldn't Load Your Orders
                    </h1>

                    <p>
                        {error}
                    </p>

                    <div className="orders-state-actions">
                        <button
                            className="btn btn-primary"
                            onClick={fetchOrders}
                        >
                            Try Again ↻
                        </button>

                        <Link
                            to="/shop"
                            className="btn btn-secondary"
                        >
                            Go Shopping
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    /* =========================================
       EMPTY
    ========================================= */

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <section className="orders-header">
                    <span className="eyebrow">
                        PETCAREWEBSITE
                    </span>

                    <h1>
                        My <span>Orders</span>
                    </h1>

                    <p>
                        Keep track of all your pet-care
                        purchases in one place.
                    </p>
                </section>

                <section className="orders-empty">
                    <div className="orders-empty-icon">
                        📦
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        Your order history is empty.
                        Find something special for your
                        furry friend!
                    </p>

                    <Link
                        to="/shop"
                        className="btn btn-primary"
                    >
                        Start Shopping →
                    </Link>
                </section>
            </div>
        );
    }

    /* =========================================
       ORDERS
    ========================================= */

    return (
        <div className="orders-page">

            <section className="orders-header">
                <span className="eyebrow">
                    PETCAREWEBSITE
                </span>

                <h1>
                    My <span>Orders</span>
                </h1>

                <p>
                    Your pet's goodies, all in one place. 🐾
                </p>
            </section>

            <section className="orders-container">

                <div className="orders-topbar">

                    <div>
                        <h2>
                            Order History
                        </h2>

                        <p>
                            {orders.length}{" "}
                            {orders.length === 1
                                ? "order"
                                : "orders"}{" "}
                            placed
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="orders-shop-btn"
                    >
                        + Shop More
                    </Link>

                </div>

                <div className="orders-list">

                    {orders.map((order) => {

                        const status =
                            order.status || "Pending";

                        return (
                            <article
                                className="order-card"
                                key={order.id}
                            >

                                {/* ORDER HEADER */}

                                <div className="order-card-header">

                                    <div className="order-id-section">

                                        <div className="order-box-icon">
                                            📦
                                        </div>

                                        <div>
                                            <span>
                                                ORDER
                                            </span>

                                            <h3>
                                                #{order.id}
                                            </h3>
                                        </div>

                                    </div>

                                    <div
                                        className={`order-status ${getStatusClass(
                                            status
                                        )}`}
                                    >
                                        <span>
                                            {getStatusIcon(
                                                status
                                            )}
                                        </span>

                                        {status}
                                    </div>

                                </div>

                                {/* ORDER INFO */}

                                <div className="order-meta">

                                    <div>
                                        <span>
                                            ORDER DATE
                                        </span>

                                        <strong>
                                            {formatDate(
                                                order.created_at ||
                                                order.createdAt
                                            )}
                                        </strong>

                                        <small>
                                            {formatTime(
                                                order.created_at ||
                                                order.createdAt
                                            )}
                                        </small>
                                    </div>

                                    <div>
                                        <span>
                                            PAYMENT
                                        </span>

                                        <strong>
                                            💵{" "}
                                            {order.payment_method ||
                                                "Cash on Delivery"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            TOTAL
                                        </span>

                                        <strong className="order-price">
                                            ₹
                                            {Number(
                                                order.total || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>

                                </div>

                                {/* ORDER FOOTER */}

                                <div className="order-card-footer">

                                    <div className="order-delivery">

                                        <span>
                                            📍
                                        </span>

                                        <div>
                                            <strong>
                                                Delivery Address
                                            </strong>

                                            <p>
                                                {order.address ||
                                                    "Address saved with order"}

                                                {order.city
                                                    ? `, ${order.city}`
                                                    : ""}

                                                {order.state
                                                    ? `, ${order.state}`
                                                    : ""}

                                                {order.pincode
                                                    ? ` - ${order.pincode}`
                                                    : ""}
                                            </p>
                                        </div>

                                    </div>

                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="view-order-btn"
                                    >
                                        View Details →
                                    </Link>

                                </div>

                            </article>
                        );
                    })}

                </div>

            </section>
        </div>
    );
}

export default Orders;