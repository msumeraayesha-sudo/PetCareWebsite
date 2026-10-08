import { Link } from "react-router-dom";

function About() {
    return (
        <div className="about-page">

            <section className="about-hero">
                <div className="about-hero-content">
                    <span className="eyebrow">ABOUT PETCAREWEBSITE</span>

                    <h1>
                        Better Care.
                        <span> Happier Pets.</span>
                    </h1>

                    <p>
                        PetCareWebsite was created with one simple idea:
                        making everyday pet care easier, more thoughtful,
                        and more enjoyable for both pets and their humans.
                    </p>
                </div>

                <div className="about-hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=85"
                        alt="Happy pet with owner"
                    />
                </div>
            </section>

            <section className="about-story">
                <div className="about-story-image">
                    <img
                        src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85"
                        alt="Happy golden retriever"
                    />
                </div>

                <div className="about-story-content">
                    <span className="eyebrow">OUR STORY</span>

                    <h2>
                        Because pets are
                        <span> family.</span>
                    </h2>

                    <p>
                        Taking care of a pet comes with countless little
                        decisions every day. What should they eat? Which toy
                        is right? How often should they be groomed?
                    </p>

                    <p>
                        PetCareWebsite brings useful products, helpful
                        services, and simple care guidance together in one
                        friendly place.
                    </p>

                    <div className="about-values">
                        <div>
                            <strong>01</strong>
                            <span>Pet First</span>
                        </div>

                        <div>
                            <strong>02</strong>
                            <span>Simple Care</span>
                        </div>

                        <div>
                            <strong>03</strong>
                            <span>Happy Homes</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-values-section">
                <div className="about-section-heading">
                    <span className="eyebrow">WHAT WE BELIEVE</span>

                    <h2>
                        Care with
                        <span> purpose.</span>
                    </h2>
                </div>

                <div className="belief-grid">
                    <div className="belief-card">
                        <span>🐾</span>
                        <h3>Pet First</h3>
                        <p>
                            Every product and service should contribute to
                            your pet's comfort, health, or happiness.
                        </p>
                    </div>

                    <div className="belief-card">
                        <span>🌿</span>
                        <h3>Thoughtful Choices</h3>
                        <p>
                            We focus on practical essentials that make
                            everyday pet care easier.
                        </p>
                    </div>

                    <div className="belief-card">
                        <span>❤️</span>
                        <h3>Built With Love</h3>
                        <p>
                            Because caring for animals should always come
                            from a place of patience and compassion.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <div>
                    <span className="eyebrow">READY TO EXPLORE?</span>

                    <h2>
                        Let's make pet care
                        <span> a little easier.</span>
                    </h2>
                </div>

                <div className="about-cta-buttons">
                    <Link to="/shop" className="btn btn-primary">
                        Visit Our Shop
                    </Link>

                    <Link to="/services" className="btn btn-secondary">
                        Explore Services
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default About;