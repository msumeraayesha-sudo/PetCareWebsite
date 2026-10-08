import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { usePetCare } from "../context/PetCareContext";

function Wishlist() {
    const { wishlist } = usePetCare();

    return (
        <div className="wishlist-page">

            <section className="wishlist-header">
                <span className="eyebrow">PETCAREWEBSITE</span>

                <h1>
                    Your
                    <span> Wishlist</span>
                </h1>

                <p>
                    Keep your favourite pet essentials close by.
                </p>
            </section>

            {wishlist.length === 0 ? (
                <section className="empty-wishlist">

                    <div className="empty-wishlist-icon">
                        ♡
                    </div>

                    <span className="eyebrow">
                        YOUR WISHLIST IS EMPTY
                    </span>

                    <h2>
                        Nothing here
                        <span> yet.</span>
                    </h2>

                    <p>
                        Tap the heart on products you love and they'll
                        appear here.
                    </p>

                    <Link to="/shop" className="btn btn-primary">
                        Explore Products →
                    </Link>
                </section>
            ) : (
                <section className="wishlist-content">

                    <div className="wishlist-topbar">
                        <div>
                            <span className="eyebrow">
                                SAVED FOR LATER
                            </span>

                            <h2>
                                {wishlist.length}{" "}
                                {wishlist.length === 1
                                    ? "Favourite"
                                    : "Favourites"}
                            </h2>
                        </div>

                        <Link to="/shop" className="wishlist-shop-link">
                            Continue Shopping →
                        </Link>
                    </div>

                    <div className="products-grid wishlist-grid">
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="wishlist-bottom">

                <div className="wishlist-bottom-image">
                    <img
                        src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85"
                        alt="Happy dog"
                    />
                </div>

                <div className="wishlist-bottom-content">
                    <span className="eyebrow">A LITTLE REMINDER</span>

                    <h2>
                        The best things
                        <span> are worth saving.</span>
                    </h2>

                    <p>
                        Found something your furry friend will love?
                        Save it here so you can easily find it later.
                    </p>

                    <Link to="/shop" className="btn btn-primary">
                        Find More Favourites →
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Wishlist;