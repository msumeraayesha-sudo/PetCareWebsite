import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            console.log("Admin login response:", data);

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Invalid email or password."
                );
            }

            localStorage.setItem(
                "petCareAdmin",
                JSON.stringify(data.admin)
            );

            navigate("/admin");
        } catch (error) {
            console.error("Admin login error:", error);

            setError(
                error.message ||
                    "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">

            <div className="admin-login-container">

                {/* BRAND */}
                <div className="admin-login-brand">
                    <div className="admin-login-logo">
                        🐾
                    </div>

                    <div>
                        <h2>PetCareWebsite</h2>
                        <p>Better Care. Happier Pets.</p>
                    </div>
                </div>


                {/* LOGIN CARD */}
                <div className="admin-login-card">

                    <div className="admin-login-header">

                        <span className="admin-login-eyebrow">
                            🐾 ADMIN PANEL
                        </span>

                        <h1>Welcome back</h1>

                        <p>
                            Sign in to manage your
                            PetCareWebsite store.
                        </p>

                    </div>


                    {/* ERROR */}
                    {error && (
                        <div className="admin-login-error">
                            ⚠️ {error}
                        </div>
                    )}


                    {/* FORM */}
                    <form onSubmit={handleLogin}>

                        <div className="admin-login-field">

                            <label htmlFor="admin-email">
                                Email Address
                            </label>

                            <input
                                id="admin-email"
                                type="email"
                                placeholder="admin@petcarewebsite.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                            />

                        </div>


                        <div className="admin-login-field">

                            <label htmlFor="admin-password">
                                Password
                            </label>

                            <input
                                id="admin-password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                            />

                        </div>


                        <button
                            type="submit"
                            className="admin-login-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In →"}
                        </button>

                    </form>


                    {/* FOOTER */}
                    <div className="admin-login-footer">

                        <span>
                            🔒 Secure Admin Access
                        </span>

                        <span>
                            PetCareWebsite
                        </span>

                    </div>

                </div>


                {/* BACK */}
                <button
                    type="button"
                    className="admin-back-home"
                    onClick={() => navigate("/")}
                >
                    ← Back to Website
                </button>

            </div>

        </main>
    );
}

export default AdminLogin;