
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* BRAND */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <span>🐾</span>
                        <strong>PetCare</strong>
                        <strong className="footer-logo-orange">
                            Website
                        </strong>
                    </Link>

                    <p>
                        Better care for happier pets.
                    </p>

                    <p className="footer-description">
                        Quality products, trusted services and thoughtful
                        care for every pet.
                    </p>
                </div>

                {/* EXPLORE */}
                <div className="footer-column">
                    <h3>Explore</h3>

                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/about">About Us</Link>
                </div>

                {/* SUPPORT */}
                <div className="footer-column">
                    <h3>Support</h3>

                    <Link to="/contact">Contact</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/cart">Cart</Link>
                </div>

                {/* CONTACT */}
                <div className="footer-column footer-contact">
                    <h3>Contact</h3>

                    <p>📍 Bengaluru, Karnataka</p>
                    <p>📞 +91 98765 43210</p>
                    <p>✉️ hello@petcarewebsite.com</p>
                </div>

            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
                <p>
                    © 2026 <strong>PetCareWebsite</strong>. All rights reserved.
                </p>

                <p>
                    Made with ❤️ for pets
                </p>
            </div>
        </footer>
    );
}

export default Footer;
