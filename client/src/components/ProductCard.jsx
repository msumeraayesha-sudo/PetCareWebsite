
import { Link, useNavigate } from "react-router-dom";
import { usePetCare } from "../context/PetCareContext";

function ProductCard({ product }) {
    const {
        addToCart,
        toggleWishlist,
        isInWishlist,
    } = usePetCare();

    const navigate = useNavigate();

    const image =
        product.name === "Interactive Rope Toy"
            ? "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=85"
            : product.image ||
              "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80";

    const handleBuyNow = () => {
        addToCart(product);
        navigate("/checkout");
    };

    return (
        <div className="product-card">

            {/* Product Image */}
            <div className="product-image-wrapper">

                <Link
                    to={`/shop/product/${product.id}`}
                    className="product-image-link"
                >
                    <img
                        src={image}
                        alt={product.name}
                        className="product-image"
                    />
                </Link>

                {/* Wishlist */}
                <button
                    className={`wishlist-btn ${
                        isInWishlist(product.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
                    title={
                        isInWishlist(product.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    {isInWishlist(product.id) ? "♥" : "♡"}
                </button>

            </div>

            {/* Product Information */}
            <div className="product-info">

                <span className="product-category">
                    {product.category}
                </span>

                <Link
                    to={`/shop/product/${product.id}`}
                    className="product-title-link"
                >
                    <h3>{product.name}</h3>
                </Link>

                {/* Rating */}
                <div className="product-rating">
                    ⭐ {product.rating || "4.5"}
                </div>

                {/* Price */}
                <p className="product-price">
                    ₹
                    {Number(product.price).toLocaleString("en-IN")}
                </p>

                {/* Actions */}
                <div className="product-actions">

                    {/* Add to Cart */}
                    <button
                        className="add-cart-btn"
                        onClick={() => addToCart(product)}
                    >
                        🛒 Add to Cart
                    </button>

                    {/* Buy Now */}
                    <button
                        className="buy-btn"
                        onClick={handleBuyNow}
                    >
                        ⚡ Buy Now
                    </button>

                </div>

                {/* View Details */}
                <Link
                    to={`/shop/product/${product.id}`}
                    className="view-product-link"
                >
                    View Details →
                </Link>

            </div>
        </div>
    );
}

export default ProductCard;
