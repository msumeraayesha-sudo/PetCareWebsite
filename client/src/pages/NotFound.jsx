import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">

                <div className="not-found-icon">
                    🐾
                </div>

                <p className="not-found-number">404</p>

                <h1>Oops! This page wandered off.</h1>

                <p>
                    The page you're looking for doesn't exist or may have
                    moved somewhere else.
                </p>

                <div className="not-found-buttons">
                    <Link to="/" className="not-found-primary">
                        🏠 Back to Home
                    </Link>

                    <Link to="/shop" className="not-found-secondary">
                        🛍️ Visit Shop
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default NotFound;