import { useState } from "react";
import { Link } from "react-router-dom";
import { usePetCare } from "../context/PetCareContext";

function Checkout() {
    const { cart, cartTotal, clearCart } = usePetCare();

    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");

    const delivery = cartTotal >= 1000 ? 0 : 49;
    const total = cartTotal + delivery;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        if (formData.pincode.length !== 6) {
            setError("Please enter a valid 6-digit PIN code.");
            return;
        }

        if (cart.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        setLoading(true);

        try {
            const savedUser = localStorage.getItem("petCareUser");
            const user = savedUser ? JSON.parse(savedUser) : null;

            const orderData = {
                userId: user?.id || null,

                customerName: formData.customerName.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),

                paymentMethod: "Cash on Delivery",

                items: cart.map((item) => ({
                    productId: item.id,
                    productName: item.name,
                    price: Number(item.price),
                    quantity: Number(item.quantity),
                })),

                total: Number(total),
            };

            console.log("📦 Sending order:", orderData);

            const response = await fetch(
                "http://localhost:3000/api/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                }
            );

            const data = await response.json();

            console.log("📥 Backend response:", data);

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Failed to place order"
                );
            }

            setOrderId(
                data.orderId ||
                data.id ||
                "SUCCESS"
            );

            setOrderPlaced(true);
            clearCart();

        } catch (err) {
            console.error("❌ Checkout error:", err);

            setError(
                err.message ||
                "Something went wrong while placing your order."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       ORDER SUCCESS
    ===================================================== */

    if (orderPlaced) {
        return (
            <div className="pc-checkout-page">

                <style>{`
                    .pc-checkout-page {
                        min-height: 100vh;
                        background: #fffdf9;
                        padding: 70px 20px;
                        box-sizing: border-box;
                    }

                    .pc-success {
                        width: min(650px, 100%);
                        margin: 40px auto;
                        padding: 55px 40px;
                        background: white;
                        border: 1px solid #dfe5dc;
                        border-radius: 24px;
                        text-align: center;
                        box-shadow: 0 20px 50px rgba(41,67,52,.08);
                        box-sizing: border-box;
                    }

                    .pc-success-icon {
                        width: 75px;
                        height: 75px;
                        margin: 0 auto 25px;
                        border-radius: 50%;
                        background: #e6eee5;
                        color: #46634f;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 38px;
                        font-weight: 900;
                    }

                    .pc-success h1 {
                        margin: 0 0 15px;
                        color: #243027;
                        font-size: 40px;
                    }

                    .pc-success h1 span {
                        color: #c97958;
                    }

                    .pc-success p {
                        color: #59635b;
                        line-height: 1.7;
                    }

                    .pc-order-id {
                        margin: 25px 0;
                        padding: 15px;
                        background: #f7f2e8;
                        border-radius: 10px;
                        color: #243027;
                    }

                    .pc-cod {
                        padding: 16px;
                        border-radius: 10px;
                        background: #e6eee5;
                        color: #294334;
                    }

                    .pc-success-buttons {
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                        margin-top: 30px;
                    }

                    .pc-success-buttons a {
                        text-decoration: none;
                        padding: 14px 22px;
                        border-radius: 10px;
                        font-weight: 700;
                    }

                    .pc-success-primary {
                        background: #46634f;
                        color: white;
                    }

                    .pc-success-secondary {
                        background: #f7f2e8;
                        color: #294334;
                    }

                    @media(max-width:600px) {
                        .pc-success {
                            padding: 40px 20px;
                        }

                        .pc-success h1 {
                            font-size: 30px;
                        }

                        .pc-success-buttons {
                            flex-direction: column;
                        }
                    }
                `}</style>

                <section className="pc-success">

                    <div className="pc-success-icon">
                        ✓
                    </div>

                    <h1>
                        Thank You! <span>🐾</span>
                    </h1>

                    <p>
                        Your pet's goodies are on their way.
                        Your order has been successfully placed.
                    </p>

                    <div className="pc-order-id">
                        Order ID: <strong>#{orderId}</strong>
                    </div>

                    <div className="pc-cod">
                        💵 <strong>Cash on Delivery</strong>
                        <br />
                        Pay when your order arrives.
                    </div>

                    <div className="pc-success-buttons">

                        <Link
                            to="/shop"
                            className="pc-success-primary"
                        >
                            Continue Shopping →
                        </Link>

                        <Link
                            to="/"
                            className="pc-success-secondary"
                        >
                            Back to Home
                        </Link>

                    </div>

                </section>
            </div>
        );
    }

    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (cart.length === 0) {
        return (
            <div className="pc-checkout-page">

                <style>{`
                    .pc-empty {
                        min-height: 500px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    }

                    .pc-empty-icon {
                        font-size: 60px;
                        margin-bottom: 20px;
                    }

                    .pc-empty h1 {
                        color: #243027;
                    }

                    .pc-empty p {
                        color: #59635b;
                        margin-bottom: 25px;
                    }

                    .pc-empty a {
                        text-decoration: none;
                        padding: 14px 24px;
                        border-radius: 10px;
                        background: #46634f;
                        color: white;
                        font-weight: 700;
                    }
                `}</style>

                <section className="pc-empty">

                    <div className="pc-empty-icon">
                        🛒
                    </div>

                    <h1>Your Cart Is Empty</h1>

                    <p>
                        Add some products before proceeding
                        to checkout.
                    </p>

                    <Link to="/shop">
                        Browse Products →
                    </Link>

                </section>

            </div>
        );
    }

    /* =====================================================
       MAIN CHECKOUT
    ===================================================== */

    return (
        <div className="pc-checkout-page">

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .pc-checkout-page {
                    width: 100%;
                    min-height: 100vh;
                    background: #fffdf9;
                    color: #243027;
                    padding-bottom: 80px;
                }

                /* HEADER */

                .pc-checkout-header {
                    width: 100%;
                    background: #f7f2e8;
                    padding: 65px 20px 55px;
                    text-align: center;
                    border-bottom: 1px solid #dfe5dc;
                }

                .pc-eyebrow {
                    display: block;
                    margin-bottom: 12px;
                    color: #8b6247;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 2px;
                }

                .pc-checkout-header h1 {
                    margin: 0;
                    color: #243027;
                    font-size: clamp(36px, 5vw, 58px);
                    line-height: 1.1;
                    font-weight: 800;
                }

                .pc-checkout-header h1 span {
                    color: #c97958;
                }

                .pc-checkout-header p {
                    margin: 15px auto 0;
                    color: #59635b;
                    font-size: 15px;
                }

                .pc-back-cart {
                    display: inline-block;
                    margin-top: 18px;
                    color: #46634f;
                    text-decoration: none;
                    font-weight: 700;
                }

                /* LAYOUT */

                .pc-checkout-container {
                    width: min(1180px, calc(100% - 40px));
                    margin: 40px auto;
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 380px;
                    gap: 30px;
                    align-items: start;
                }

                /* FORM */

                .pc-form-card {
                    width: 100%;
                    background: white;
                    border: 1px solid #dfe5dc;
                    border-radius: 22px;
                    padding: 35px;
                    box-shadow: 0 15px 40px rgba(41,67,52,.07);
                }

                .pc-section-title {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    margin-bottom: 25px;
                }

                .pc-number {
                    width: 38px;
                    height: 38px;
                    flex: 0 0 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #46634f;
                    color: white;
                    border-radius: 50%;
                    font-size: 13px;
                    font-weight: 800;
                }

                .pc-section-title h2 {
                    margin: 0 0 5px;
                    color: #243027;
                    font-size: 22px;
                }

                .pc-section-title p {
                    margin: 0;
                    color: #59635b;
                    font-size: 13px;
                }

                /* INPUTS */

                .pc-form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 18px;
                }

                .pc-field {
                    width: 100%;
                    margin-bottom: 20px;
                }

                .pc-field label {
                    display: block;
                    margin-bottom: 8px;
                    color: #243027;
                    font-size: 13px;
                    font-weight: 700;
                }

                .pc-field input,
                .pc-field textarea {
                    display: block;
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;

                    padding: 14px 15px;

                    border: 1px solid #dfe5dc;
                    border-radius: 11px;

                    background: white;
                    color: #243027;

                    font-family: inherit;
                    font-size: 14px;

                    outline: none;
                }

                .pc-field input {
                    height: 48px;
                }

                .pc-field textarea {
                    min-height: 115px;
                    resize: vertical;
                }

                .pc-field input:focus,
                .pc-field textarea:focus {
                    border-color: #46634f;
                    box-shadow: 0 0 0 3px rgba(70,99,79,.12);
                }

                /* PAYMENT */

                .pc-payment-title {
                    margin-top: 30px;
                }

                .pc-payment {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 17px;
                    border: 2px solid #46634f;
                    border-radius: 14px;
                    background: #e6eee5;
                }

                .pc-radio {
                    width: 26px;
                    height: 26px;
                    flex: 0 0 26px;
                    border-radius: 50%;
                    background: #46634f;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                }

                .pc-money {
                    font-size: 27px;
                }

                .pc-payment strong {
                    display: block;
                    color: #243027;
                }

                .pc-payment p {
                    margin: 4px 0 0;
                    color: #59635b;
                    font-size: 12px;
                }

                /* ERROR */

                .pc-error {
                    margin: 20px 0;
                    padding: 13px 15px;
                    border-radius: 10px;
                    background: #fff0ed;
                    border: 1px solid #f0c8be;
                    color: #a84e3d;
                    font-size: 13px;
                }

                /* BUTTON */

                .pc-place-order {
                    width: 100%;
                    height: 55px;
                    margin-top: 22px;
                    border: none;
                    border-radius: 12px;
                    background: #46634f;
                    color: white;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .pc-place-order:hover {
                    background: #294334;
                }

                .pc-place-order:disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }

                /* SUMMARY */

                .pc-summary {
                    position: sticky;
                    top: 100px;
                    width: 100%;
                    background: #f7f2e8;
                    border: 1px solid #e2ded3;
                    border-radius: 22px;
                    padding: 28px;
                }

                .pc-summary h2 {
                    margin: 7px 0 25px;
                    color: #243027;
                    font-size: 24px;
                }

                .pc-item {
                    display: grid;
                    grid-template-columns: 62px minmax(0,1fr) auto;
                    gap: 12px;
                    align-items: center;
                    padding: 13px 0;
                    border-bottom: 1px solid #ddd8ce;
                }

                .pc-item img {
                    width: 62px;
                    height: 62px;
                    object-fit: cover;
                    border-radius: 12px;
                }

                .pc-item h3 {
                    margin: 0 0 5px;
                    font-size: 13px;
                    color: #243027;
                }

                .pc-item span {
                    color: #7b847c;
                    font-size: 11px;
                }

                .pc-item strong {
                    white-space: nowrap;
                    font-size: 13px;
                }

                .pc-divider {
                    height: 1px;
                    background: #ddd8ce;
                    margin: 20px 0;
                }

                .pc-total-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 13px 0;
                    color: #59635b;
                    font-size: 14px;
                }

                .pc-total-row strong {
                    color: #243027;
                }

                .pc-grand-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .pc-grand-total span {
                    font-size: 18px;
                    font-weight: 800;
                }

                .pc-grand-total strong {
                    color: #c97958;
                    font-size: 25px;
                }

                .pc-security {
                    margin-top: 22px;
                    padding-top: 18px;
                    border-top: 1px solid #ddd8ce;
                    text-align: center;
                    color: #59635b;
                    font-size: 12px;
                }

                /* RESPONSIVE */

                @media(max-width: 900px) {

                    .pc-checkout-container {
                        grid-template-columns: 1fr;
                    }

                    .pc-summary {
                        position: static;
                        order: 2;
                    }

                    .pc-form-card {
                        order: 1;
                    }
                }

                @media(max-width: 600px) {

                    .pc-checkout-header {
                        padding: 45px 18px;
                    }

                    .pc-checkout-header h1 {
                        font-size: 34px;
                    }

                    .pc-checkout-container {
                        width: calc(100% - 24px);
                        margin-top: 25px;
                    }

                    .pc-form-card,
                    .pc-summary {
                        padding: 20px;
                        border-radius: 17px;
                    }

                    .pc-form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }

                    .pc-payment {
                        align-items: flex-start;
                    }

                    .pc-item {
                        grid-template-columns: 52px minmax(0,1fr);
                    }

                    .pc-item img {
                        width: 52px;
                        height: 52px;
                    }

                    .pc-item strong {
                        grid-column: 2;
                    }
                }

            `}</style>

            {/* HEADER */}

            <section className="pc-checkout-header">

                <span className="pc-eyebrow">
                    🐾 SECURE CHECKOUT
                </span>

                <h1>
                    Complete Your <span>Order</span>
                </h1>

                <p>
                    You're just a few steps away from happy pets.
                </p>

                <Link
                    to="/cart"
                    className="pc-back-cart"
                >
                    ← Back to Cart
                </Link>

            </section>

            {/* MAIN */}

            <section className="pc-checkout-container">

                {/* FORM */}

                <div className="pc-form-card">

                    <div className="pc-section-title">

                        <span className="pc-number">
                            01
                        </span>

                        <div>
                            <h2>Delivery Details</h2>

                            <p>
                                Where should we deliver your order?
                            </p>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="pc-form-row">

                            <div className="pc-field">

                                <label>
                                    Full Name *
                                </label>

                                <input
                                    type="text"
                                    name="customerName"
                                    placeholder="Enter your name"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="pc-field">

                                <label>
                                    Phone Number *
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="10-digit phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    inputMode="numeric"
                                    required
                                />

                            </div>

                        </div>

                        <div className="pc-field">

                            <label>
                                Delivery Address *
                            </label>

                            <textarea
                                name="address"
                                placeholder="House / Flat number, street, area"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="pc-form-row">

                            <div className="pc-field">

                                <label>
                                    City *
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="pc-field">

                                <label>
                                    State *
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        <div className="pc-field">

                            <label>
                                Pincode *
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                placeholder="6-digit pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                maxLength="6"
                                pattern="[0-9]{6}"
                                inputMode="numeric"
                                required
                            />

                        </div>

                        {/* PAYMENT */}

                        <div className="pc-section-title pc-payment-title">

                            <span className="pc-number">
                                02
                            </span>

                            <div>

                                <h2>
                                    Payment Method
                                </h2>

                                <p>
                                    Select your preferred payment option.
                                </p>

                            </div>

                        </div>

                        <div className="pc-payment">

                            <div className="pc-radio">
                                ✓
                            </div>

                            <div className="pc-money">
                                💵
                            </div>

                            <div>

                                <strong>
                                    Cash on Delivery
                                </strong>

                                <p>
                                    Pay when your order arrives.
                                </p>

                            </div>

                        </div>

                        {error && (
                            <div className="pc-error">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="pc-place-order"
                            disabled={loading}
                        >
                            {loading
                                ? "⏳ Placing Order..."
                                : `✓ Place Order • ₹${total.toLocaleString("en-IN")}`
                            }
                        </button>

                    </form>

                </div>

                {/* SUMMARY */}

                <aside className="pc-summary">

                    <span className="pc-eyebrow">
                        YOUR ORDER
                    </span>

                    <h2>
                        Order Summary
                    </h2>

                    {cart.map((item) => {

                        const image =
                            item.name === "Interactive Rope Toy"
                                ? "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=85"
                                : item.image ||
                                  "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80";

                        return (
                            <div
                                className="pc-item"
                                key={item.id}
                            >

                                <img
                                    src={image}
                                    alt={item.name}
                                />

                                <div>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <span>
                                        Qty: {item.quantity}
                                    </span>

                                </div>

                                <strong>
                                    ₹
                                    {(
                                        Number(item.price) *
                                        Number(item.quantity)
                                    ).toLocaleString("en-IN")}
                                </strong>

                            </div>
                        );
                    })}

                    <div className="pc-divider"></div>

                    <div className="pc-total-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹{cartTotal.toLocaleString("en-IN")}
                        </strong>

                    </div>

                    <div className="pc-total-row">

                        <span>
                            Delivery
                        </span>

                        <strong>
                            {delivery === 0
                                ? "FREE"
                                : `₹${delivery}`}
                        </strong>

                    </div>

                    <div className="pc-divider"></div>

                    <div className="pc-grand-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{total.toLocaleString("en-IN")}
                        </strong>

                    </div>

                    <div className="pc-security">
                        🔒 Your order information is secure
                    </div>

                </aside>

            </section>

        </div>
    );
}

export default Checkout;