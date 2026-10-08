
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Shop() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    // Read category from URL
    useEffect(() => {
        const urlCategory = searchParams.get("category");

        if (urlCategory) {
            setCategory(urlCategory);
        } else {
            setCategory("All");
        }
    }, [searchParams]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "/api/products"
                );

                if (!response.ok) {
                    throw new Error("Failed to load products");
                }
                const text = await response.text();

if (!text) {
    throw new Error("The server returned an empty response.");
}

                const data = JSON.parse(text);

if (!data.success) {
    throw new Error(data.message || "Failed to load products.");
}

setProducts(data.products || []);

            } catch (err) {
                console.error("Shop error:", err);

                setError(
                    "Unable to load products. Please make sure the backend is running."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const categories = useMemo(() => {
        return [
            "All",
            ...new Set(
                products.map(
                    (product) => product.category
                )
            ),
        ];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText) ||
                product.category
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        });
    }, [
        products,
        search,
        category
    ]);

    // Change category and update URL
    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);

        if (newCategory === "All") {
            setSearchParams({});
        } else {
            setSearchParams({
                category: newCategory,
            });
        }
    };

    if (loading) {
        return (
            <div className="shop-state">

                <div className="shop-loader"></div>

                <h2>
                    Loading pet products...
                </h2>

                <p>
                    Finding the best things for your furry friends 🐾
                </p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="shop-state">

                <div className="shop-error-icon">
                    ⚠️
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Try Again
                </button>

            </div>
        );
    }

    return (
        <div className="shop-page">

            {/* HERO */}

            <section className="shop-hero">

                <div className="shop-hero-content">

                    <span className="eyebrow">
                        PETCAREWEBSITE SHOP
                    </span>

                    <h1>
                        Everything They
                        <span> Love.</span>
                    </h1>

                    <p>
                        From nutritious food to playful toys and
                        everyday essentials, find carefully selected
                        products for your pets.
                    </p>

                </div>

                <div className="shop-hero-image">

                    <img
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85"
                        alt="Happy dogs"
                    />

                </div>

            </section>

            {/* SEARCH + FILTER */}

            <section className="shop-controls">

                <div className="search-wrapper">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ✕
                        </button>
                    )}

                </div>

                <div className="category-filters">

                    {categories.map((item) => (
                        <button
                            key={item}
                            className={
                                category === item
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleCategoryChange(
                                    item
                                )
                            }
                        >
                            {item}
                        </button>
                    ))}

                </div>

            </section>

            {/* PRODUCTS */}

            <section className="products-section">

                <div className="products-heading">

                    <div>

                        <span className="eyebrow">
                            OUR COLLECTION
                        </span>

                        <h2>
                            Pet
                            <span> Essentials</span>
                        </h2>

                    </div>

                    <p>
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1
                            ? "product"
                            : "products"}{" "}
                        found
                    </p>

                </div>

                {filteredProducts.length > 0 ? (

                    <div className="products-grid">

                        {filteredProducts.map(
                            (product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            )
                        )}

                    </div>

                ) : (

                    <div className="empty-products">

                        <div className="empty-icon">
                            🐾
                        </div>

                        <h3>
                            No products found
                        </h3>

                        <p>
                            We couldn't find anything
                            matching your search.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSearch("");
                                handleCategoryChange(
                                    "All"
                                );
                            }}
                        >
                            View All Products
                        </button>

                    </div>

                )}

            </section>

            {/* BOTTOM CTA */}

            <section className="shop-bottom">

                <div>

                    <span className="eyebrow">
                        NEED HELP?
                    </span>

                    <h2>
                        Can't decide what
                        <span> your pet needs?</span>
                    </h2>

                    <p>
                        Explore our services or contact us
                        for pet-care guidance.
                    </p>

                </div>

                <div className="shop-bottom-buttons">

                    <Link
                        to="/services"
                        className="btn btn-primary"
                    >
                        Explore Services
                    </Link>

                    <Link
                        to="/contact"
                        className="btn btn-secondary"
                    >
                        Contact Us
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default Shop;
