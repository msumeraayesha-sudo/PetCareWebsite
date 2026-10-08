import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* HERO */}
            <section className="hero">

                <div className="hero-content">

                    <span className="eyebrow">
                        🐾 BETTER CARE. HAPPIER PETS.
                    </span>

                    <h1>
                        Everything Your
                        <span> Pet Deserves.</span>
                    </h1>

                    <p>
                        Discover quality products, trusted services and
                        everyday essentials designed to keep your furry
                        companions healthy, happy and loved.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/shop"
                            className="btn btn-primary"
                        >
                            Shop for Pets →
                        </Link>

                        <Link
                            to="/services"
                            className="btn btn-secondary"
                        >
                            Explore Services
                        </Link>

                    </div>

                    <div className="hero-trust">
                        <span>✓ Quality Products</span>
                        <span>✓ Pet Friendly</span>
                        <span>✓ Easy Checkout</span>
                    </div>

                </div>

                <div className="hero-image">

                    <img
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85"
                        alt="Happy dogs"
                    />

                    <div className="floating-card">

                        <span className="floating-icon">
                            ❤️
                        </span>

                        <div>
                            <strong>Happy Pets</strong>
                            <small>Happy Families</small>
                        </div>

                    </div>

                </div>

            </section>

            {/* BENEFITS */}
            <section className="benefits">

                <div className="benefit-card">

                    <span>🌿</span>

                    <div>
                        <h3>Healthy Choices</h3>
                        <p>
                            Products selected with pet wellness
                            in mind.
                        </p>
                    </div>

                </div>

                <div className="benefit-card">

                    <span>🚚</span>

                    <div>
                        <h3>Easy Delivery</h3>
                        <p>
                            Get your pet essentials delivered
                            conveniently.
                        </p>
                    </div>

                </div>

                <div className="benefit-card">

                    <span>🐾</span>

                    <div>
                        <h3>Made for Pets</h3>
                        <p>
                            Thoughtfully chosen for dogs and cats.
                        </p>
                    </div>

                </div>

            </section>

            {/* CATEGORIES */}
            <section className="categories-section">

                <div className="section-heading">

                    <span className="eyebrow">
                        SHOP BY NEED
                    </span>

                    <h2>
                        Find Something
                        <span> Special</span>
                    </h2>

                    <p>
                        From nutritious food to playful toys and
                        everyday essentials, find what your companion
                        needs.
                    </p>

                </div>

                <div className="category-grid">

                    {/* DOGS */}
                    <Link
    to="/shop?category=Dogs"
    className="category-card"
>

                        <img
                            src="https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
                            alt="Dog"
                        />

                        <div className="category-overlay">

                            <span>01</span>

                            <h3>For Dogs</h3>

                            <p>
                                Food, toys & essentials →
                            </p>

                        </div>

                    </Link>

                    {/* CATS */}
                    <Link
    to="/shop?category=Cats"
    className="category-card"
>

                        <img
                            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
                            alt="Cat"
                        />

                        <div className="category-overlay">

                            <span>02</span>

                            <h3>For Cats</h3>

                            <p>
                                Comfort, care & fun →
                            </p>

                        </div>

                    </Link>

                    {/* NUTRITION */}
                    <Link
    to="/shop?category=Nutrition"
    className="category-card"
>

                        <img
                            src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80"
                            alt="Pet food"
                        />

                        <div className="category-overlay">

                            <span>03</span>

                            <h3>Nutrition</h3>

                            <p>
                                Healthy food choices →
                            </p>

                        </div>

                    </Link>

                    {/* PLAY */}
                    <Link
    to="/shop?category=Play%20%26%20Enrichment"
    className="category-card"
>
    <img
        src="https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80"
        alt="Dog playing"
    />

    <div className="category-overlay">
        <span>04</span>
        <h3>Play & Fun</h3>
        <p>Toys for happy moments →</p>
    </div>
</Link>

                </div>

            </section>

            {/* ABOUT */}
            <section className="home-about">

                <div className="about-image">

                    <img
                        src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85"
                        alt="Happy pet"
                    />

                </div>

                <div className="about-content">

                    <span className="eyebrow">
                        CARE BEYOND PRODUCTS
                    </span>

                    <h2>
                        Because They Are
                        <span> Family.</span>
                    </h2>

                    <p>
                        PetCareWebsite is built around one simple
                        idea: pets deserve the same care, comfort
                        and happiness that they bring into our lives.
                    </p>

                    <p>
                        Explore our products and services designed
                        to make caring for your companion easier
                        every day.
                    </p>

                    <Link
                        to="/about"
                        className="btn btn-primary"
                    >
                        Learn More About Us →
                    </Link>

                </div>

            </section>

            {/* FINAL CTA */}
            <section className="final-cta">

                <div>

                    <span className="eyebrow">
                        YOUR PET WILL THANK YOU
                    </span>

                    <h2>
                        Ready to Make
                        <span> Tails Wag?</span>
                    </h2>

                    <p>
                        Find everything you need for a healthier,
                        happier companion.
                    </p>

                </div>

                <Link
                    to="/shop"
                    className="btn btn-light"
                >
                    Start Shopping →
                </Link>

            </section>

        </div>
    );
}

export default Home;