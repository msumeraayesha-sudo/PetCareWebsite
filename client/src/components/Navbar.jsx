import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePetCare } from "../context/PetCareContext";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        cartCount,
        wishlist,
    } = usePetCare();

    const [menuOpen, setMenuOpen] = useState(false);

    // Get logged-in customer
    const user = JSON.parse(
        localStorage.getItem("petCareUser") || "null"
    );

    // Check active page
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }

        return location.pathname.startsWith(path);
    };

    // Close mobile menu
    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Logout customer
    const handleLogout = () => {
        localStorage.removeItem("petCareUser");
        setMenuOpen(false);
        navigate("/");
    };

    // Get first letter of customer's name
    const userInitial =
        user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <header className="navbar">

            <div className="navbar-container">

                {/* =========================================
                    LOGO
                ========================================= */}

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    <div className="navbar-logo-icon">
                        <svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.5 8.5C8.5 6.84 7.6 5.5 6.5 5.5C5.4 5.5 4.5 6.84 4.5 8.5C4.5 10.16 5.4 11.5 6.5 11.5C7.6 11.5 8.5 10.16 8.5 8.5Z"
                                fill="currentColor"
                            />

                            <path
                                d="M19.5 8.5C19.5 6.84 18.6 5.5 17.5 5.5C16.4 5.5 15.5 6.84 15.5 8.5C15.5 10.16 16.4 11.5 17.5 11.5C18.6 11.5 19.5 10.16 19.5 8.5Z"
                                fill="currentColor"
                            />

                            <path
                                d="M5.5 14.5C5.5 12.84 4.6 11.5 3.5 11.5C2.4 11.5 1.5 12.84 1.5 14.5C1.5 16.16 2.4 17.5 3.5 17.5C4.6 17.5 5.5 16.16 5.5 14.5Z"
                                fill="currentColor"
                            />

                            <path
                                d="M22.5 14.5C22.5 12.84 21.6 11.5 20.5 11.5C19.4 11.5 18.5 12.84 18.5 14.5C18.5 16.16 19.4 17.5 20.5 17.5C21.6 17.5 22.5 16.16 22.5 14.5Z"
                                fill="currentColor"
                            />

                            <path
                                d="M12 11C9.2 11 6.5 13.2 6.5 16.1C6.5 18.6 8.7 20.5 12 20.5C15.3 20.5 17.5 18.6 17.5 16.1C17.5 13.2 14.8 11 12 11Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>

                    <div className="navbar-brand-text">
                        <strong>PetCare</strong>
                        <strong className="navbar-brand-orange">
                            Website
                        </strong>

                        <span>
                            Better Care. Happier Pets.
                        </span>
                    </div>
                </Link>

                {/* =========================================
                    DESKTOP NAVIGATION
                ========================================= */}

                <nav className="navbar-links">

                    <Link
                        to="/"
                        className={
                            isActive("/")
                                ? "active"
                                : ""
                        }
                    >
                        Home
                    </Link>

                    <Link
                        to="/shop"
                        className={
                            isActive("/shop")
                                ? "active"
                                : ""
                        }
                    >
                        Shop
                    </Link>

                    <Link
                        to="/services"
                        className={
                            isActive("/services")
                                ? "active"
                                : ""
                        }
                    >
                        Services
                    </Link>

                    <Link
                        to="/about"
                        className={
                            isActive("/about")
                                ? "active"
                                : ""
                        }
                    >
                        About
                    </Link>

                    <Link
                        to="/contact"
                        className={
                            isActive("/contact")
                                ? "active"
                                : ""
                        }
                    >
                        Contact
                    </Link>

                    <Link
                        to="/orders"
                        className={
                            isActive("/orders")
                                ? "active"
                                : ""
                        }
                    >
                        Orders
                    </Link>

                </nav>

                {/* =========================================
                    RIGHT SIDE ACTIONS
                ========================================= */}

                <div className="navbar-actions">

                    {/* Wishlist */}

                    <Link
                        to="/wishlist"
                        className="navbar-icon-btn"
                        title="Wishlist"
                    >
                        ♡

                        {wishlist.length > 0 && (
                            <span className="navbar-badge">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}

                    <Link
                        to="/cart"
                        className="navbar-icon-btn"
                        title="Cart"
                    >
                        🛒

                        {cartCount > 0 && (
                            <span className="navbar-badge">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Customer Account */}

                    {user ? (
                        <div className="navbar-user-area">

                            <Link
                                to="/account"
                                className="navbar-account-link"
                                title="My Account"
                            >
                                <span className="navbar-user-avatar">
                                    {userInitial}
                                </span>

                                <span className="navbar-user-name">
                                    {user.name}
                                </span>
                            </Link>

                            <button
                                type="button"
                                className="navbar-logout-btn"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                Logout
                            </button>

                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="navbar-login-btn"
                        >
                            Login
                        </Link>
                    )}

                </div>

                {/* =========================================
                    MOBILE MENU BUTTON
                ========================================= */}

                <button
                    type="button"
                    className={`navbar-menu-btn ${
                        menuOpen ? "open" : ""
                    }`}
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

            </div>

            {/* =============================================
                MOBILE NAVIGATION
            ============================================= */}

            <div
                className={`navbar-mobile-menu ${
                    menuOpen ? "show" : ""
                }`}
            >

                <Link
                    to="/"
                    className={
                        isActive("/")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    🏠 Home
                </Link>

                <Link
                    to="/shop"
                    className={
                        isActive("/shop")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    🛍️ Shop
                </Link>

                <Link
                    to="/services"
                    className={
                        isActive("/services")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    ✨ Services
                </Link>

                <Link
                    to="/about"
                    className={
                        isActive("/about")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    🐾 About
                </Link>

                <Link
                    to="/contact"
                    className={
                        isActive("/contact")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    📩 Contact
                </Link>

                <Link
                    to="/orders"
                    className={
                        isActive("/orders")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    📦 Orders
                </Link>

                <Link
                    to="/wishlist"
                    className={
                        isActive("/wishlist")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    ♡ Wishlist

                    {wishlist.length > 0 && (
                        <span className="mobile-nav-badge">
                            {wishlist.length}
                        </span>
                    )}
                </Link>

                <Link
                    to="/cart"
                    className={
                        isActive("/cart")
                            ? "active"
                            : ""
                    }
                    onClick={closeMenu}
                >
                    🛒 Cart

                    {cartCount > 0 && (
                        <span className="mobile-nav-badge">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* Mobile customer account */}

                {user ? (
                    <>
                        <Link
                            to="/account"
                            className={
                                isActive("/account")
                                    ? "active"
                                    : ""
                            }
                            onClick={closeMenu}
                        >
                            👤 My Account
                        </Link>

                        <button
                            type="button"
                            className="mobile-logout-btn"
                            onClick={handleLogout}
                        >
                            🚪 Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="mobile-login-btn"
                        onClick={closeMenu}
                    >
                        🔐 Login
                    </Link>
                )}

            </div>

        </header>
    );
}

export default Navbar;