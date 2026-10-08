import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError(
                "Name, email and password are required."
            );
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        phone: formData.phone.trim(),
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "Registration failed."
                );
            }

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            console.error("Registration error:", err);

            setError(
                err.message ||
                    "Unable to create your account."
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

                <div className="auth-card register-card">

                    <div className="auth-header">
                        <span className="auth-eyebrow">
                            JOIN OUR PET FAMILY 🐶
                        </span>

                        <h1>
                            Create Your{" "}
                            <span>Account</span>
                        </h1>

                        <p>
                            Join PetCareWebsite and make
                            caring for your pet easier.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            ✓ {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="auth-field">
                            <label>Full Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                        </div>

                        <div className="auth-field">
                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-field">
                            <label>Phone Number</label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                            />
                        </div>

                        <div className="auth-two-column">

                            <div className="auth-field">
                                <label>Password</label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    value={
                                        formData.password
                                    }
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="auth-field">
                                <label>
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Repeat password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account →"}
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>
                            Already have an account?
                        </span>
                    </div>

                    <Link
                        to="/login"
                        className="auth-secondary-btn"
                    >
                        Sign In
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

export default Register;