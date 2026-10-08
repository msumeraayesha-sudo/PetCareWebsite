import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "";

function AdminOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/orders`
            );

            if (!response.ok) {
                throw new Error("Unable to load orders.");
            }

            const data = await response.json();

            setOrders(
                Array.isArray(data)
                    ? data
                    : data.orders || []
            );
        } catch (err) {
            console.error("Admin orders error:", err);
            setError(
                err.message || "Unable to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            setUpdatingId(orderId);
            setError("");

            const response = await fetch(
                `${API_URL}/api/orders/${orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Unable to update status."
                );
            }

            setOrders((current) =>
                current.map((order) =>
                    order.id === orderId
                        ? {
                              ...order,
                              status,
                          }
                        : order
                )
            );
        } catch (err) {
            console.error(
                "Order status error:",
                err
            );

            setError(
                err.message ||
                    "Unable to update order status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

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
        return String(status || "pending")
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    const statistics = useMemo(() => {
        const revenue = orders.reduce(
            (total, order) =>
                total + Number(order.total || 0),
            0
        );

        return {
            total: orders.length,

            pending: orders.filter(
                (order) =>
                    String(order.status || "")
                        .toLowerCase() === "pending"
            ).length,

            processing: orders.filter(
                (order) =>
                    String(order.status || "")
                        .toLowerCase() === "processing"
            ).length,

            shipped: orders.filter(
                (order) =>
                    String(order.status || "")
                        .toLowerCase() === "shipped"
            ).length,

            completed: orders.filter(
                (order) =>
                    String(order.status || "")
                        .toLowerCase() === "completed"
            ).length,

            cancelled: orders.filter(
                (order) =>
                    String(order.status || "")
                        .toLowerCase() === "cancelled"
            ).length,

            revenue,
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        return [...orders]
            .sort(
                (a, b) =>
                    new Date(b.created_at || 0) -
                    new Date(a.created_at || 0)
            )
            .filter((order) => {
                const matchesStatus =
                    statusFilter === "All" ||
                    String(order.status || "")
                        .toLowerCase() ===
                        statusFilter.toLowerCase();

                const matchesSearch =
                    !searchText ||
                    String(order.id)
                        .toLowerCase()
                        .includes(searchText) ||
                    String(
                        order.customer_name || ""
                    )
                        .toLowerCase()
                        .includes(searchText) ||
                    String(order.phone || "")
                        .toLowerCase()
                        .includes(searchText) ||
                    String(order.city || "")
                        .toLowerCase()
                        .includes(searchText);

                return (
                    matchesStatus &&
                    matchesSearch
                );
            });
    }, [orders, statusFilter, search]);

    const filterOptions = [
        {
            label: "All",
            value: "All",
            count: statistics.total,
            icon: "📋",
        },
        {
            label: "Pending",
            value: "Pending",
            count: statistics.pending,
            icon: "⏳",
        },
        {
            label: "Processing",
            value: "Processing",
            count: statistics.processing,
            icon: "🔄",
        },
        {
            label: "Shipped",
            value: "Shipped",
            count: statistics.shipped,
            icon: "🚚",
        },
        {
            label: "Completed",
            value: "Completed",
            count: statistics.completed,
            icon: "✓",
        },
        {
            label: "Cancelled",
            value: "Cancelled",
            count: statistics.cancelled,
            icon: "✕",
        },
    ];

    return (
        <section className="admin-orders-page">

            {/* HEADER */}
            <div className="admin-page-header">
                <div>
                    <span className="admin-page-eyebrow">
                        📦 ORDER MANAGEMENT
                    </span>

                    <h1>Orders</h1>

                    <p>
                        Track customer purchases and
                        manage order status.
                    </p>
                </div>

                <button
                    className="admin-refresh-btn"
                    onClick={loadOrders}
                    disabled={loading}
                >
                    🔄{" "}
                    {loading
                        ? "Refreshing..."
                        : "Refresh Orders"}
                </button>
            </div>

            {/* STATISTICS */}
            <div className="admin-orders-stat-grid">

                <div className="admin-orders-stat">
                    <div className="admin-orders-stat-icon">
                        📦
                    </div>

                    <div>
                        <span>Total Orders</span>
                        <strong>
                            {statistics.total}
                        </strong>
                        <small>
                            All customer orders
                        </small>
                    </div>
                </div>

                <div className="admin-orders-stat pending">
                    <div className="admin-orders-stat-icon pending">
                        ⏳
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>
                            {statistics.pending}
                        </strong>
                        <small>
                            Awaiting action
                        </small>
                    </div>
                </div>

                <div className="admin-orders-stat processing">
                    <div className="admin-orders-stat-icon processing">
                        🔄
                    </div>

                    <div>
                        <span>Processing</span>
                        <strong>
                            {statistics.processing}
                        </strong>
                        <small>
                            Being prepared
                        </small>
                    </div>
                </div>

                <div className="admin-orders-stat shipped">
                    <div className="admin-orders-stat-icon shipped">
                        🚚
                    </div>

                    <div>
                        <span>Shipped</span>
                        <strong>
                            {statistics.shipped}
                        </strong>
                        <small>
                            On the way
                        </small>
                    </div>
                </div>

                <div className="admin-orders-stat completed">
                    <div className="admin-orders-stat-icon completed">
                        ✓
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>
                            {statistics.completed}
                        </strong>
                        <small>
                            Successfully delivered
                        </small>
                    </div>
                </div>

                <div className="admin-orders-stat revenue">
                    <div className="admin-orders-stat-icon revenue">
                        💰
                    </div>

                    <div>
                        <span>Total Revenue</span>
                        <strong>
                            {formatCurrency(
                                statistics.revenue
                            )}
                        </strong>
                        <small>
                            From all orders
                        </small>
                    </div>
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="admin-section-card admin-orders-card">

                {/* TOOLBAR */}
                <div className="admin-orders-toolbar">

                    <div className="admin-orders-toolbar-top">

                        <div>
                            <h2>
                                All Orders
                            </h2>

                            <p>
                                {filteredOrders.length}{" "}
                                matching order
                                {filteredOrders.length !==
                                1
                                    ? "s"
                                    : ""}
                            </p>
                        </div>

                        <div className="admin-orders-search">
                            <span>🔍</span>

                            <input
                                type="text"
                                placeholder="Search order, customer, phone..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            {search && (
                                <button
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    title="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="admin-order-filters">
                        {filterOptions.map(
                            (filter) => (
                                <button
                                    key={
                                        filter.value
                                    }
                                    className={
                                        statusFilter ===
                                        filter.value
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setStatusFilter(
                                            filter.value
                                        )
                                    }
                                >
                                    <span>
                                        {filter.icon}
                                    </span>

                                    {filter.label}

                                    <b>
                                        {filter.count}
                                    </b>
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="admin-orders-error">
                        <span>⚠️</span>

                        <div>
                            <strong>
                                Something went wrong
                            </strong>

                            <p>{error}</p>
                        </div>

                        <button
                            onClick={loadOrders}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="admin-orders-loading">
                        <div className="admin-spinner"></div>

                        <h3>
                            Loading orders...
                        </h3>

                        <p>
                            Getting the latest
                            customer orders.
                        </p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="admin-orders-empty">
                        <span>📭</span>

                        <h3>
                            No orders found
                        </h3>

                        <p>
                            Try another search or
                            choose a different status
                            filter.
                        </p>

                        {(search ||
                            statusFilter !==
                                "All") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter(
                                        "All"
                                    );
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="admin-orders-table-wrapper">

                        <table className="admin-orders-table">

                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Contact</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOrders.map(
                                    (order) => {
                                        const status =
                                            order.status ||
                                            "Pending";

                                        return (
                                            <tr
                                                key={
                                                    order.id
                                                }
                                            >
                                                <td>
                                                    <div className="admin-order-number">
                                                        <strong>
                                                            #
                                                            {
                                                                order.id
                                                            }
                                                        </strong>

                                                        <span>
                                                            Order
                                                            ID
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-order-customer">
                                                        <div className="admin-order-avatar">
                                                            {(
                                                                order.customer_name ||
                                                                "C"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {order.customer_name ||
                                                                    "Customer"}
                                                            </strong>

                                                            <small>
                                                                {order.city ||
                                                                    "Location unavailable"}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-order-contact">
                                                        <strong>
                                                            {order.phone ||
                                                                "—"}
                                                        </strong>

                                                        <small>
                                                            {order.email ||
                                                                "Phone contact"}
                                                        </small>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong className="admin-order-total">
                                                        {formatCurrency(
                                                            order.total
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span className="admin-payment-badge">
                                                        💵{" "}
                                                        {order.payment_method ||
                                                            "Cash on Delivery"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="admin-status-control">
                                                        <select
                                                            className={`admin-status-select ${getStatusClass(
                                                                status
                                                            )}`}
                                                            value={
                                                                status
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                order.id
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateStatus(
                                                                    order.id,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option value="Pending">
                                                                Pending
                                                            </option>

                                                            <option value="Processing">
                                                                Processing
                                                            </option>

                                                            <option value="Shipped">
                                                                Shipped
                                                            </option>

                                                            <option value="Completed">
                                                                Completed
                                                            </option>

                                                            <option value="Cancelled">
                                                                Cancelled
                                                            </option>
                                                        </select>

                                                        {updatingId ===
                                                            order.id && (
                                                            <span className="admin-status-saving">
                                                                Saving...
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="admin-order-date">
                                                        <strong>
                                                            {formatDate(
                                                                order.created_at
                                                            )}
                                                        </strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    <button
                                                        className="admin-order-view-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/orders/${order.id}`
                                                            )
                                                        }
                                                    >
                                                        View
                                                        →
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* FOOTER */}
                {!loading &&
                    filteredOrders.length > 0 && (
                        <div className="admin-orders-footer">
                            <span>
                                Showing{" "}
                                <strong>
                                    {
                                        filteredOrders.length
                                    }
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {orders.length}
                                </strong>{" "}
                                orders
                            </span>

                            <span>
                                💳 Cash on Delivery
                            </span>
                        </div>
                    )}
            </div>
        </section>
    );
}

export default AdminOrders;