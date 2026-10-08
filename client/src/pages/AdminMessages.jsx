import { useEffect, useMemo, useState } from "react";

function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "/api/contact"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load messages."
                );
            }

            setMessages(data.contacts || []);
        } catch (err) {
            console.error("Messages error:", err);
            setError(
                err.message || "Unable to load contact messages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const filteredMessages = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) return messages;

        return messages.filter((message) =>
            [
                message.name,
                message.email,
                message.phone,
                message.message,
                message.subject,
            ]
                .filter(Boolean)
                .some((field) =>
                    String(field)
                        .toLowerCase()
                        .includes(value)
                )
        );
    }, [messages, search]);

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <section className="admin-messages-page">
            <div className="admin-page-header">
                <div>
                    <span className="admin-page-eyebrow">
                        📩 CUSTOMER SUPPORT
                    </span>

                    <h1>Messages</h1>

                    <p>
                        View customer enquiries and contact
                        requests.
                    </p>
                </div>

                <button
                    className="admin-messages-refresh"
                    onClick={fetchMessages}
                    disabled={loading}
                >
                    ↻ Refresh
                </button>
            </div>

            <div className="admin-message-stats">
                <div className="admin-message-stat">
                    <span>📩</span>
                    <div>
                        <small>Total Messages</small>
                        <strong>{messages.length}</strong>
                    </div>
                </div>

                <div className="admin-message-stat">
                    <span>👥</span>
                    <div>
                        <small>Customers</small>
                        <strong>
                            {
                                new Set(
                                    messages.map(
                                        (item) =>
                                            item.email
                                    )
                                ).size
                            }
                        </strong>
                    </div>
                </div>
            </div>

            {error && (
                <div className="admin-products-error">
                    ⚠️ {error}
                </div>
            )}

            <div className="admin-messages-card">
                <div className="admin-messages-toolbar">
                    <div className="admin-products-search">
                        <span>🔎</span>

                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <span className="admin-message-count">
                        {filteredMessages.length} message
                        {filteredMessages.length !== 1
                            ? "s"
                            : ""}
                    </span>
                </div>

                {loading ? (
                    <div className="admin-products-loading">
                        <div className="admin-spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="admin-products-empty">
                        <div>📭</div>

                        <h3>No messages found</h3>

                        <p>
                            Customer contact messages will
                            appear here.
                        </p>
                    </div>
                ) : (
                    <div className="admin-messages-list">
                        {filteredMessages.map((message) => (
                            <article
                                className="admin-message-item"
                                key={message.id}
                            >
                                <div className="admin-message-avatar">
                                    {message.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                        "C"}
                                </div>

                                <div className="admin-message-main">
                                    <div className="admin-message-top">
                                        <div>
                                            <h3>
                                                {message.name}
                                            </h3>

                                            <span>
                                                {message.email}
                                            </span>
                                        </div>

                                        <time>
                                            {formatDate(
                                                message.created_at
                                            )}
                                        </time>
                                    </div>

                                    <p className="admin-message-preview">
                                        {message.message}
                                    </p>

                                    <div className="admin-message-bottom">
                                        {message.phone && (
                                            <span>
                                                📞{" "}
                                                {
                                                    message.phone
                                                }
                                            </span>
                                        )}

                                        <button
                                            onClick={() =>
                                                setSelectedMessage(
                                                    message
                                                )
                                            }
                                        >
                                            View Message →
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {selectedMessage && (
                <div
                    className="admin-product-modal-overlay"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            setSelectedMessage(null);
                        }
                    }}
                >
                    <div className="admin-message-modal">
                        <div className="admin-product-modal-header">
                            <div>
                                <span>
                                    CUSTOMER MESSAGE
                                </span>

                                <h2>
                                    {selectedMessage.name}
                                </h2>

                                <p>
                                    {selectedMessage.email}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-message-details">
                            <div className="admin-message-detail-row">
                                <span>📧 Email</span>
                                <strong>
                                    {
                                        selectedMessage.email
                                    }
                                </strong>
                            </div>

                            {selectedMessage.phone && (
                                <div className="admin-message-detail-row">
                                    <span>📞 Phone</span>
                                    <strong>
                                        {
                                            selectedMessage.phone
                                        }
                                    </strong>
                                </div>
                            )}

                            <div className="admin-message-detail-row">
                                <span>🕒 Received</span>
                                <strong>
                                    {formatDate(
                                        selectedMessage.created_at
                                    )}
                                </strong>
                            </div>

                            <div className="admin-message-content">
                                <label>MESSAGE</label>

                                <p>
                                    {
                                        selectedMessage.message
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="admin-message-modal-footer">
                            <a
                                href={`mailto:${selectedMessage.email}`}
                                className="admin-message-reply"
                            >
                                ✉️ Reply by Email
                            </a>

                            <button
                                onClick={() =>
                                    setSelectedMessage(null)
                                }
                                className="admin-modal-cancel"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminMessages;