import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "/api/auth/login",
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

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed."
                );
            }

            localStorage.setItem(
                "petCareUser",
                JSON.stringify(data.user)
            );

            const redirectTo =
                location.state?.from || "/";

            navigate(redirectTo);
        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.message ||
                    "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container">

                <div className="auth-brand">
                    <div className="auth-logo">🐾</div>

                    <div>
                        <h2>PetCareWebsite</h2>
                        <p>Better Care. Happier Pets.</p>
                    </div>
                </div>

                <div className="auth-card">

                    <div className="auth-header">
                        <span className="auth-eyebrow">
                            WELCOME BACK 🐾
                        </span>

                        <h1>
                            Welcome <span>Back!</span>
                        </h1>

                        <p>
                            Sign in to continue caring for
                            your furry friend.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="auth-field">
                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>

                            <input
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
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In →"}
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>New to PetCareWebsite?</span>
                    </div>

                    <Link
                        to="/register"
                        className="auth-secondary-btn"
                    >
                        Create an Account
                    </Link>

                </div>

                <Link
                    to="/"
                    className="auth-back-home"
                >
                    ← Back to PetCareWebsite
                </Link>

            </div>
        </main>
    );
}

export default Login;