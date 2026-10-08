
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePetCare } from "../context/PetCareContext";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        addToCart,
        toggleWishlist,
        isInWishlist,
    } = usePetCare();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:3000/api/products/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Product not found"
                    );
                }

                setProduct(data.product);
            } catch (err) {
                console.error("Product details error:", err);

                setError(
                    err.message ||
                        "Unable to load this product."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const increaseQuantity = () => {
        if (!product) return;

        if (quantity < product.stock) {
            setQuantity((current) => current + 1);
        }
    };

    const decreaseQuantity = () => {
        setQuantity((current) =>
            Math.max(1, current - 1)
        );
    };

    const addSelectedQuantityToCart = () => {
        if (!product || product.stock <= 0) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const handleAddToCart = () => {
        addSelectedQuantityToCart();
    };

    const handleBuyNow = () => {
        if (!product || product.stock <= 0) return;

        addSelectedQuantityToCart();

        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="product-details-state">
                <div className="shop-loader"></div>

                <h2>Loading product...</h2>

                <p>
                    Getting the details ready for you 🐾
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-details-state">
                <div className="shop-error-icon">
                    ⚠️
                </div>

                <h2>Product not found</h2>

                <p>
                    {error ||
                        "We couldn't find this product."}
                </p>

                <Link
                    to="/shop"
                    className="btn btn-primary"
                >
                    ← Back to Shop
                </Link>
            </div>
        );
    }

    const image =
        product.name === "Interactive Rope Toy"
            ? "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1000&q=85"
            : product.image ||
              "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1000&q=85";

    const saved = isInWishlist(product.id);

    return (
        <div className="product-details-page">

            {/* Breadcrumb */}
            <div className="product-breadcrumb">
                <Link to="/">Home</Link>

                <span>›</span>

                <Link to="/shop">Shop</Link>

                <span>›</span>

                <strong>{product.name}</strong>
            </div>

            {/* Product */}
            <section className="product-details-container">

                {/* Image */}
                <div className="product-details-image">

                    <img
                        src={image}
                        alt={product.name}
                    />

                    <button
                        className={`product-details-wishlist ${
                            saved ? "active" : ""
                        }`}
                        onClick={() =>
                            toggleWishlist(product)
                        }
                        title={
                            saved
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                    >
                        {saved ? "♥" : "♡"}
                    </button>

                </div>

                {/* Information */}
                <div className="product-details-info">

                    <span className="product-details-category">
                        {product.category}
                    </span>

                    <h1>{product.name}</h1>

                    {/* Rating */}
                    <div className="product-details-rating">

                        <span>
                            ⭐ {product.rating || "4.5"}
                        </span>

                        <span className="rating-text">
                            Highly rated by pet parents
                        </span>

                    </div>

                    {/* Price */}
                    <div className="product-details-price">
                        ₹
                        {Number(
                            product.price
                        ).toLocaleString("en-IN")}
                    </div>

                    {/* Description */}
                    <p className="product-details-description">
                        {product.description ||
                            `Give your furry friend something they'll love. This carefully selected ${product.name.toLowerCase()} is designed to support everyday comfort, happiness, and healthy routines.`}
                    </p>

                    {/* Stock */}
                    <div className="product-stock">

                        <span className="stock-dot"></span>

                        {product.stock > 0
                            ? `${product.stock} items available`
                            : "Currently out of stock"}

                    </div>

                    <div className="product-detail-divider"></div>

                    {/* Quantity + Buttons */}
                    {product.stock > 0 ? (
                        <>
                            <div className="quantity-section">

                                <span>
                                    Quantity
                                </span>

                                <div className="quantity-selector">

                                    <button
                                        onClick={
                                            decreaseQuantity
                                        }
                                        disabled={
                                            quantity <= 1
                                        }
                                    >
                                        −
                                    </button>

                                    <strong>
                                        {quantity}
                                    </strong>

                                    <button
                                        onClick={
                                            increaseQuantity
                                        }
                                        disabled={
                                            quantity >=
                                            product.stock
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                            <div className="product-detail-actions">

                                <button
                                    className="detail-cart-btn"
                                    onClick={
                                        handleAddToCart
                                    }
                                >
                                    🛒 Add to Cart
                                </button>

                                <button
                                    className="detail-buy-btn"
                                    onClick={
                                        handleBuyNow
                                    }
                                >
                                    ⚡ Buy Now →
                                </button>

                            </div>
                        </>
                    ) : (
                        <div className="out-of-stock-message">
                            ❌ This product is currently
                            unavailable.
                        </div>
                    )}

                    {/* Guarantees */}
                    <div className="product-guarantees">

                        <div>
                            <span>🚚</span>

                            <div>
                                <strong>
                                    Fast Delivery
                                </strong>

                                <small>
                                    Reliable delivery
                                </small>
                            </div>
                        </div>

                        <div>
                            <span>🔒</span>

                            <div>
                                <strong>
                                    Secure Checkout
                                </strong>

                                <small>
                                    Safe & simple ordering
                                </small>
                            </div>
                        </div>

                        <div>
                            <span>🐾</span>

                            <div>
                                <strong>
                                    Pet Friendly
                                </strong>

                                <small>
                                    Selected with care
                                </small>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* Bottom CTA */}
            <section className="product-details-bottom">

                <div>
                    <span className="eyebrow">
                        NEED MORE?
                    </span>

                    <h2>
                        Find more things
                        <span> they'll love.</span>
                    </h2>
                </div>

                <Link
                    to="/shop"
                    className="btn btn-primary"
                >
                    Continue Shopping →
                </Link>

            </section>

        </div>
    );
}

export default ProductDetails;
