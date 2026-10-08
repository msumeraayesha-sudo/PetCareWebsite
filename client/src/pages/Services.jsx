import { Link } from "react-router-dom";

const services = [
    {
        icon: "✂️",
        title: "Pet Grooming",
        description:
            "Gentle grooming sessions that keep your pet clean, comfortable, and looking their best.",
        features: ["Bath & Dry", "Brushing", "Nail Care", "Ear Cleaning"],
    },
    {
        icon: "🩺",
        title: "Pet Wellness",
        description:
            "Everyday wellness guidance to help you build healthier routines for your furry companion.",
        features: ["Wellness Guidance", "Nutrition Advice", "Routine Planning", "Care Tips"],
    },
    {
        icon: "🦴",
        title: "Nutrition Guidance",
        description:
            "Get practical guidance on choosing balanced food, treats, and feeding routines for your pet.",
        features: ["Food Selection", "Feeding Plans", "Treat Guidance", "Puppy & Kitten Care"],
    },
    {
        icon: "🎾",
        title: "Play & Enrichment",
        description:
            "Discover fun ways to keep pets active, entertained, mentally stimulated, and happy.",
        features: ["Play Ideas", "Toy Guidance", "Mental Games", "Exercise Tips"],
    },
];

function Services() {
    return (
        <div className="services-page">

            <section className="services-hero">
                <div className="services-hero-content">
                    <span className="eyebrow">CARE THAT MATTERS</span>

                    <h1>
                        Everything Your Pet
                        <span> Needs to Thrive.</span>
                    </h1>

                    <p>
                        From grooming and nutrition to everyday wellness and
                        enrichment, PetCareWebsite is here to make pet care
                        simpler and happier.
                    </p>

                    <div className="services-hero-buttons">
                        <a href="#services-list" className="btn btn-primary">
                            Explore Services ↓
                        </a>

                        <Link to="/contact" className="btn btn-secondary">
                            Talk to Us
                        </Link>
                    </div>
                </div>

                <div className="services-hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=85"
                        alt="Happy dog receiving care"
                    />
                </div>
            </section>

            <section className="services-intro">
                <span className="eyebrow">OUR APPROACH</span>
                <h2>
                    Thoughtful care for
                    <span> every kind of pet.</span>
                </h2>
                <p>
                    We believe good pet care is about more than products.
                    It's about understanding your pet's needs and creating
                    routines that help them live happier lives.
                </p>
            </section>

            <section className="services-grid-section" id="services-list">
                <div className="services-grid">
                    {services.map((service) => (
                        <article className="service-card" key={service.title}>
                            <div className="service-icon">
                                {service.icon}
                            </div>

                            <span className="service-number">
                                {String(
                                    services.indexOf(service) + 1
                                ).padStart(2, "0")}
                            </span>

                            <h3>{service.title}</h3>

                            <p>{service.description}</p>

                            <ul>
                                {service.features.map((feature) => (
                                    <li key={feature}>
                                        <span>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={`/contact?service=${encodeURIComponent(
                                    service.title
                                )}`}
                                className="service-link"
                            >
                                Enquire Now →
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="services-care-banner">
                <div className="services-care-image">
                    <img
                        src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=85"
                        alt="Happy dog outdoors"
                    />
                </div>

                <div className="services-care-content">
                    <span className="eyebrow">HAPPY PETS, HAPPY HOMES</span>

                    <h2>
                        Small moments of care
                        <span> make a big difference.</span>
                    </h2>

                    <p>
                        Whether your companion needs a grooming refresh,
                        better nutrition, or simply more playtime, we're here
                        to help you make every day better.
                    </p>

                    <Link to="/shop" className="btn btn-primary">
                        Shop Pet Essentials →
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Services;