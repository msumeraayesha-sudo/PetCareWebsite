import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Contact() {
    const [searchParams] = useSearchParams();

    const selectedService = searchParams.get("service") || "";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: selectedService,
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (selectedService) {
            setFormData((current) => ({
                ...current,
                subject: selectedService,
            }));
        }
    }, [selectedService]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const response = await fetch(
                "/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        data.error ||
                        "Unable to send your message."
                );
            }

            setSuccess(
                "Thank you! Your message has been sent successfully. 🐾"
            );

            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (err) {
            console.error("Contact error:", err);

            setError(
                err.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">

            <section className="contact-hero">
                <div className="contact-hero-content">
                    <span className="eyebrow">GET IN TOUCH</span>

                    <h1>
                        We're Here For
                        <span> You & Your Pet.</span>
                    </h1>

                    <p>
                        Have a question about a product, service, or your
                        pet's needs? Send us a message and our team will be
                        happy to help.
                    </p>
                </div>

                <div className="contact-hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=85"
                        alt="Person caring for a dog"
                    />
                </div>
            </section>

            <section className="contact-content">

                <div className="contact-info">

                    <span className="eyebrow">CONTACT DETAILS</span>

                    <h2>
                        Let's start a
                        <span> conversation.</span>
                    </h2>

                    <p>
                        We're always happy to hear from pet parents. Reach
                        out with your questions, suggestions, or service
                        enquiries.
                    </p>

                    <div className="contact-info-card">
                        <div className="contact-info-icon">📧</div>
                        <div>
                            <small>Email</small>
                            <strong>hello@petcarewebsite.com</strong>
                        </div>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-info-icon">📞</div>
                        <div>
                            <small>Phone</small>
                            <strong>+91 98765 43210</strong>
                        </div>
                    </div>

                    <div className="contact-info-card">
                        <div className="contact-info-icon">🕐</div>
                        <div>
                            <small>Working Hours</small>
                            <strong>Mon - Sat · 9 AM - 6 PM</strong>
                        </div>
                    </div>

                    <div className="contact-pet-note">
                        <span>🐶</span>
                        <p>
                            Your message matters to us. We're here to make
                            pet care easier.
                        </p>
                    </div>
                </div>

                <div className="contact-form-card">
                    <span className="eyebrow">SEND A MESSAGE</span>

                    <h2>How can we help?</h2>

                    {success && (
                        <div className="form-success">
                            ✓ {success}
                        </div>
                    )}

                    {error && (
                        <div className="form-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="What is this about?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Your Message</label>
                            <textarea
                                name="message"
                                rows="6"
                                placeholder="Tell us how we can help..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="contact-submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send Message →"}
                        </button>
                    </form>
                </div>
            </section>

            <section className="contact-bottom">
                <div>
                    <span className="eyebrow">LOOKING FOR SOMETHING?</span>

                    <h2>
                        Explore PetCareWebsite
                        <span> while you're here.</span>
                    </h2>
                </div>

                <div className="contact-bottom-links">
                    <Link to="/shop">Shop Products →</Link>
                    <Link to="/services">View Services →</Link>
                    <Link to="/about">About Us →</Link>
                </div>
            </section>
        </div>
    );
}

export default Contact;