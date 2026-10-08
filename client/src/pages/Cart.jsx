
import { Link } from "react-router-dom";
import { usePetCare } from "../context/PetCareContext";

function Cart() {
    const {
        cart,
        cartCount,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = usePetCare();

    // Delivery is free above ₹1000
    const delivery =
        cartTotal >= 1000 || cartTotal === 0 ? 0 : 49;

    const total = cartTotal + delivery;

    /* =========================================
       EMPTY CART
    ========================================= */

    if (cart.length === 0) {
        return (
            <div className="cart-page">

                <section className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <span className="eyebrow">
                        YOUR SHOPPING CART
                    </span>

                    <h1>
                        Your Cart Is Empty
                    </h1>

                    <p>
                        Looks like you haven't added anything
                        for your furry friend yet.
                    </p>

                    <Link
                        to="/shop"
                        className="btn btn-primary"
                    >
                        Browse Products →
                    </Link>

                </section>

            </div>
        );
    }

    /* =========================================
       CART PAGE
    ========================================= */

    return (
        <div className="cart-page">

            {/* =================================
                HEADER
            ================================= */}

            <section className="cart-header">

                <span className="eyebrow">
                    PETCAREWEBSITE
                </span>

                <h1>
                    Your <span>Cart</span>
                </h1>

                <p>
                    Everything your pet needs,
                    all in one place. 🐾
                </p>

            </section>


            {/* =================================
                CART CONTENT
            ================================= */}

            <section className="cart-container">

                {/* =================================
                    CART ITEMS
                ================================= */}

                <div className="cart-items">

                    {/* Cart Items Header */}

                    <div className="cart-items-header">

                        <h2>
                            Cart Items
                            <span>
                                {" "}({cartCount})
                            </span>
                        </h2>

                        <Link to="/shop">
                            ← Continue Shopping
                        </Link>

                    </div>


                    {/* =================================
                        PRODUCTS
                    ================================= */}

                    {cart.map((item) => {

                        const image =
                            item.name ===
                            "Interactive Rope Toy"
                                ? "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=85"
                                : item.image ||
                                  "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80";

                        const itemTotal =
                            Number(item.price) *
                            Number(item.quantity);

                        return (
                            <div
                                className="cart-item"
                                key={item.id}
                            >

                                {/* PRODUCT IMAGE */}

                                <div className="cart-item-image">

                                    <img
                                        src={image}
                                        alt={item.name}
                                    />

                                </div>


                                {/* PRODUCT DETAILS */}

                                <div className="cart-item-details">

                                    <span>
                                        {item.category}
                                    </span>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        ₹
                                        {Number(
                                            item.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                </div>


                                {/* QUANTITY */}

                                <div className="quantity-control">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            decreaseQuantity(
                                                item.id
                                            )
                                        }
                                        aria-label={`Decrease ${item.name} quantity`}
                                    >
                                        −
                                    </button>

                                    <strong>
                                        {item.quantity}
                                    </strong>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            increaseQuantity(
                                                item.id
                                            )
                                        }
                                        aria-label={`Increase ${item.name} quantity`}
                                    >
                                        +
                                    </button>

                                </div>


                                {/* ITEM TOTAL */}

                                <div className="cart-item-total">

                                    <strong>
                                        ₹
                                        {itemTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-item"
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                    >
                                        🗑️ Remove
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>


                {/* =================================
                    ORDER SUMMARY
                ================================= */}

                <aside className="cart-summary">

                    <span className="eyebrow">
                        ORDER SUMMARY
                    </span>

                    <h2>
                        Summary
                    </h2>


                    {/* SUBTOTAL */}

                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹
                            {cartTotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    {/* DELIVERY */}

                    <div className="summary-row">

                        <span>
                            Delivery
                        </span>

                        <strong>
                            {delivery === 0
                                ? "FREE"
                                : `₹${delivery}`}
                        </strong>

                    </div>


                    {/* FREE DELIVERY MESSAGE */}

                    {cartTotal < 1000 && (
                        <p className="delivery-note">
                            Add ₹
                            {(1000 - cartTotal).toLocaleString(
                                "en-IN"
                            )}{" "}
                            more to unlock
                            <strong> FREE delivery!</strong>
                        </p>
                    )}

                    {cartTotal >= 1000 && (
                        <p className="delivery-note">
                            🎉 Congratulations!
                            You've unlocked
                            <strong> FREE delivery.</strong>
                        </p>
                    )}


                    {/* DIVIDER */}

                    <div className="summary-divider"></div>


                    {/* TOTAL */}

                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹
                            {total.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    {/* CHECKOUT */}

                    <Link
                        to="/checkout"
                        className="checkout-btn"
                    >
                        Proceed to Checkout →
                    </Link>


                    {/* SECURITY */}

                    <div className="secure-checkout">
                        🔒 Secure Checkout
                    </div>

                </aside>

            </section>

        </div>
    );
}

export default Cart;
