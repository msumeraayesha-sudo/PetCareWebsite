import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Account() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        const savedUser =
            localStorage.getItem("petCareUser");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const handleLogout = () => {
        localStorage.removeItem("petCareUser");
        navigate("/");
    };

    if (!user) {
        return null;
    }

    const firstLetter =
        user.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <main className="account-page">

            <section className="account-header">

                <span className="eyebrow">
                    PETCAREWEBSITE
                </span>

                <h1>
                    My <span>Account</span> 🐾
                </h1>

                <p>
                    Manage your account and keep track of
                    your pet-care journey.
                </p>

            </section>

            <section className="account-container">

                <div className="account-profile-card">

                    <div className="account-avatar">
                        {firstLetter}
                    </div>

                    <div className="account-profile-info">

                        <span className="account-label">
                            PET PARENT
                        </span>

                        <h2>{user.name}</h2>

                        <p>✉️ {user.email}</p>

                        {user.phone && (
                            <p>📞 {user.phone}</p>
                        )}

                    </div>

                </div>

                <div className="account-actions">

                    <Link
                        to="/orders"
                        className="account-action-card"
                    >
                        <div className="account-action-icon">
                            📦
                        </div>

                        <div>
                            <h3>My Orders</h3>
                            <p>
                                View your previous orders
                                and order details.
                            </p>
                        </div>

                        <span>→</span>
                    </Link>

                    <Link
                        to="/wishlist"
                        className="account-action-card"
                    >
                        <div className="account-action-icon">
                            ♡
                        </div>

                        <div>
                            <h3>My Wishlist</h3>
                            <p>
                                View products you saved
                                for later.
                            </p>
                        </div>

                        <span>→</span>
                    </Link>

                    <Link
                        to="/shop"
                        className="account-action-card"
                    >
                        <div className="account-action-icon">
                            🛍️
                        </div>

                        <div>
                            <h3>Continue Shopping</h3>
                            <p>
                                Explore products for your
                                furry friend.
                            </p>
                        </div>

                        <span>→</span>
                    </Link>

                </div>

                <button
                    className="account-logout"
                    onClick={handleLogout}
                >
                    🚪 Sign Out
                </button>

            </section>

        </main>
    );
}

export default Account;