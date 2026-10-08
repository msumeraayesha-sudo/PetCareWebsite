
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const orderResponse = await fetch(
                `http://localhost:3000/api/orders/${id}`
            );

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(
                    orderData.message ||
                        orderData.error ||
                        "Order not found."
                );
            }

            const foundOrder =
                orderData.order || orderData;

            setOrder(foundOrder);

            const itemsResponse = await fetch(
                `http://localhost:3000/api/orders/${id}/items`
            );

            const itemsData = await itemsResponse.json();

            if (!itemsResponse.ok) {
                throw new Error(
                    itemsData.message ||
                        itemsData.error ||
                        "Unable to load order items."
                );
            }

            setItems(itemsData.items || []);

        } catch (err) {
            console.error(
                "❌ Order details error:",
                err
            );

            setError(
                err.message ||
                    "Unable to load order details."
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
                month: "long",
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

    const getStatus = () => {
        return (
            String(order?.status || "Pending")
                .toLowerCase()
        );
    };

    const status = getStatus();

    const getStatusLabel = () => {
        if (status === "confirmed") return "Confirmed";
        if (status === "shipped") return "Shipped";
        if (status === "delivered") return "Delivered";
        if (status === "cancelled") return "Cancelled";

        return "Pending";
    };

    const getProgressClass = (step) => {
        const steps = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
        ];

        const currentIndex =
            steps.indexOf(status);

        const stepIndex =
            steps.indexOf(step);

        if (status === "cancelled") {
            return "";
        }

        if (stepIndex <= currentIndex) {
            return "completed";
        }

        return "";
    };

    const itemTotal = items.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
                Number(item.quantity || 0),
        0
    );

    const delivery =
        Number(order?.total || 0) > itemTotal
            ? Number(order.total) - itemTotal
            : 0;

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="order-details-page">
                <section className="order-details-state">

                    <div className="details-loading-icon">
                        🐾
                    </div>

                    <h2>
                        Loading Order...
                    </h2>

                    <p>
                        We're fetching your order
                        details.
                    </p>

                </section>
            </div>
        );
    }

    /* =========================================
       ERROR
    ========================================= */

    if (error || !order) {
        return (
            <div className="order-details-page">
                <section className="order-details-state">

                    <div className="details-error-icon">
                        📦
                    </div>

                    <span className="eyebrow">
                        ORDER NOT FOUND
                    </span>

                    <h1>
                        We Couldn't Find This Order
                    </h1>

                    <p>
                        {error ||
                            "The order may no longer exist."}
                    </p>

                    <Link
                        to="/orders"
                        className="btn btn-primary"
                    >
                        ← Back to My Orders
                    </Link>

                </section>
            </div>
        );
    }

    return (
        <div className="order-details-page">

            {/* =====================================
                HEADER
            ===================================== */}

            <section className="order-details-header">

                <div className="order-details-header-inner">

                    <Link
                        to="/orders"
                        className="back-orders-link"
                    >
                        ← Back to My Orders
                    </Link>

                    <div className="details-title-row">

                        <div>
                            <span className="eyebrow">
                                ORDER DETAILS
                            </span>

                            <h1>
                                Order #
                                {order.id}
                            </h1>

                            <p>
                                Placed on{" "}
                                {formatDate(
                                    order.created_at ||
                                        order.createdAt
                                )}{" "}
                                at{" "}
                                {formatTime(
                                    order.created_at ||
                                        order.createdAt
                                )}
                            </p>
                        </div>

                        <div
                            className={`details-status details-status-${status}`}
                        >
                            <span>
                                {status === "delivered"
                                    ? "✓"
                                    : status ===
                                      "shipped"
                                    ? "🚚"
                                    : status ===
                                      "cancelled"
                                    ? "✕"
                                    : "⏳"}
                            </span>

                            {getStatusLabel()}
                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================
                MAIN
            ===================================== */}

            <main className="order-details-container">

                {/* ORDER PROGRESS */}

                {status !== "cancelled" && (
                    <section className="order-progress-card">

                        <div className="details-section-heading">

                            <div>
                                <span>
                                    ORDER STATUS
                                </span>

                                <h2>
                                    Track Your Order
                                </h2>
                            </div>

                            <strong>
                                {getStatusLabel()}
                            </strong>

                        </div>

                        <div className="order-progress">

                            <div
                                className={`progress-item ${getProgressClass(
                                    "pending"
                                )}`}
                            >
                                <div className="progress-icon">
                                    📋
                                </div>

                                <span>
                                    Order Placed
                                </span>
                            </div>

                            <div
                                className={`progress-connector ${getProgressClass(
                                    "confirmed"
                                )}`}
                            />

                            <div
                                className={`progress-item ${getProgressClass(
                                    "confirmed"
                                )}`}
                            >
                                <div className="progress-icon">
                                    ✓
                                </div>

                                <span>
                                    Confirmed
                                </span>
                            </div>

                            <div
                                className={`progress-connector ${getProgressClass(
                                    "shipped"
                                )}`}
                            />

                            <div
                                className={`progress-item ${getProgressClass(
                                    "shipped"
                                )}`}
                            >
                                <div className="progress-icon">
                                    🚚
                                </div>

                                <span>
                                    Shipped
                                </span>
                            </div>

                            <div
                                className={`progress-connector ${getProgressClass(
                                    "delivered"
                                )}`}
                            />

                            <div
                                className={`progress-item ${getProgressClass(
                                    "delivered"
                                )}`}
                            >
                                <div className="progress-icon">
                                    🏠
                                </div>

                                <span>
                                    Delivered
                                </span>
                            </div>

                        </div>

                    </section>
                )}

                {status === "cancelled" && (
                    <section className="cancelled-order-card">

                        <div>
                            <span className="cancelled-icon">
                                ✕
                            </span>
                        </div>

                        <div>
                            <h2>
                                This order was cancelled
                            </h2>

                            <p>
                                If you believe this was
                                a mistake, please contact
                                our support team.
                            </p>
                        </div>

                    </section>
                )}

                <div className="order-details-grid">

                    {/* =================================
                        LEFT
                    ================================= */}

                    <div className="order-details-left">

                        {/* PRODUCTS */}

                        <section className="details-card">

                            <div className="details-card-header">
                                <div>
                                    <span>
                                        YOUR PURCHASE
                                    </span>

                                    <h2>
                                        Order Items
                                    </h2>
                                </div>

                                <span className="item-count">
                                    {items.length}{" "}
                                    {items.length === 1
                                        ? "item"
                                        : "items"}
                                </span>
                            </div>

                            <div className="details-items">

                                {items.length === 0 ? (
                                    <div className="no-items">
                                        No product information
                                        available.
                                    </div>
                                ) : (
                                    items.map((item) => {

                                        const image =
                                            item.product_image ||
                                            item.image ||
                                            "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=300&q=80";

                                        return (
                                            <div
                                                className="details-item"
                                                key={
                                                    item.id ||
                                                    item.product_id
                                                }
                                            >

                                                <div className="details-item-image">
                                                    <img
                                                        src={image}
                                                        alt={
                                                            item.product_name
                                                        }
                                                    />
                                                </div>

                                                <div className="details-item-info">

                                                    <span>
                                                        PetCare
                                                    </span>

                                                    <h3>
                                                        {
                                                            item.product_name
                                                        }
                                                    </h3>

                                                    <p>
                                                        Quantity:{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                </div>

                                                <div className="details-item-price">

                                                    <span>
                                                        ₹
                                                        {Number(
                                                            item.price ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}{" "}
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {(
                                                            Number(
                                                                item.price ||
                                                                    0
                                                            ) *
                                                            Number(
                                                                item.quantity ||
                                                                    0
                                                            )
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>
                                        );
                                    })
                                )}

                            </div>

                        </section>

                        {/* DELIVERY ADDRESS */}

                        <section className="details-card">

                            <div className="details-card-header">
                                <div>
                                    <span>
                                        DELIVERY
                                    </span>

                                    <h2>
                                        Shipping Address
                                    </h2>
                                </div>

                                <span className="address-icon">
                                    📍
                                </span>
                            </div>

                            <div className="address-box">

                                <strong>
                                    {order.customer_name ||
                                        order.customerName ||
                                        "Customer"}
                                </strong>

                                <p>
                                    {order.address}
                                </p>

                                <p>
                                    {order.city},{" "}
                                    {order.state}{" "}
                                    {order.pincode}
                                </p>

                                {order.phone && (
                                    <p>
                                        📞 {order.phone}
                                    </p>
                                )}

                            </div>

                        </section>

                    </div>

                    {/* =================================
                        RIGHT
                    ================================= */}

                    <aside className="order-details-right">

                        {/* SUMMARY */}

                        <section className="details-summary-card">

                            <div className="details-summary-title">
                                <span>
                                    ORDER SUMMARY
                                </span>

                                <h2>
                                    Payment Details
                                </h2>
                            </div>

                            <div className="summary-line">
                                <span>
                                    Items Total
                                </span>

                                <strong>
                                    ₹
                                    {itemTotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="summary-line">
                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    {delivery === 0
                                        ? "FREE"
                                        : `₹${delivery.toLocaleString(
                                              "en-IN"
                                          )}`}
                                </strong>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-total">
                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        order.total || 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="cod-box">

                                <span className="cod-icon">
                                    💵
                                </span>

                                <div>
                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <p>
                                        Pay when your order
                                        arrives.
                                    </p>
                                </div>

                            </div>

                        </section>

                        {/* HELP */}

                        <section className="order-help-card">

                            <div className="help-icon">
                                🐾
                            </div>

                            <div>
                                <h3>
                                    Need Help?
                                </h3>

                                <p>
                                    Our pet-care team is
                                    happy to help with your
                                    order.
                                </p>

                                <Link to="/contact">
                                    Contact Support →
                                </Link>
                            </div>

                        </section>

                    </aside>

                </div>

                {/* BOTTOM ACTIONS */}

                <div className="order-details-actions">

                    <Link
                        to="/orders"
                        className="details-secondary-btn"
                    >
                        ← My Orders
                    </Link>

                    <Link
                        to="/shop"
                        className="details-primary-btn"
                    >
                        Continue Shopping →
                    </Link>

                </div>

            </main>

        </div>
    );
}

export default OrderDetails;
