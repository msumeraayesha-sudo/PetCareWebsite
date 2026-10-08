import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
    const navigate = useNavigate();

    const admin = JSON.parse(
        localStorage.getItem("petCareAdmin") || "null"
    );

    const handleLogout = () => {
        localStorage.removeItem("petCareAdmin");
        navigate("/admin/login");
    };

    return (
        <div className="admin-layout">

            {/* SIDEBAR */}
            <aside className="admin-sidebar">

                <div className="admin-sidebar-brand">
                    <div className="admin-sidebar-logo">
                        🐾
                    </div>

                    <div>
                        <strong>PetCare</strong>
                        <strong className="admin-brand-orange">
                            Website
                        </strong>

                        <span>ADMIN PANEL</span>
                    </div>
                </div>


                <nav className="admin-sidebar-nav">

                    <p className="admin-nav-label">
                        MANAGEMENT
                    </p>

                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `admin-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span>📊</span>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            `admin-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span>📦</span>
                        Orders
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `admin-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span>🛍️</span>
                        Products
                    </NavLink>
                    <NavLink
    to="/admin/messages"
    className={({ isActive }) =>
        `admin-nav-link ${isActive ? "active" : ""}`
    }
>
    <span>📩</span>
    Messages
</NavLink>


                    <p className="admin-nav-label">
                        WEBSITE
                    </p>

                    <button
                        className="admin-nav-link admin-website-btn"
                        onClick={() => navigate("/")}
                    >
                        <span>🌐</span>
                        View Website
                    </button>

                </nav>


                {/* ADMIN PROFILE */}
                <div className="admin-sidebar-bottom">

                    <div className="admin-profile">

                        <div className="admin-profile-avatar">
                            {admin?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "A"}
                        </div>

                        <div className="admin-profile-info">
                            <strong>
                                {admin?.name || "Admin"}
                            </strong>

                            <span>
                                {admin?.email ||
                                    "admin@petcarewebsite.com"}
                            </span>
                        </div>

                    </div>


                    <button
                        className="admin-sidebar-logout"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>


            {/* MAIN AREA */}
            <main className="admin-main">

                <div className="admin-mobile-header">

                    <div className="admin-mobile-brand">
                        🐾 PetCareWebsite
                    </div>

                    <button
                        onClick={() => navigate("/")}
                    >
                        🌐 Website
                    </button>

                </div>

                <Outlet />

            </main>

        </div>
    );
}

export default AdminLayout;