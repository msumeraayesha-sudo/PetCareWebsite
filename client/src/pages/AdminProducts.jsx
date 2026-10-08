import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3000/api/products";

const emptyForm = {
    name: "",
    category: "Dogs",
    description: "",
    price: "",
    rating: "4.5",
    stock: "",
    image: "",
};

const categories = [
    "All",
    "Dogs",
    "Cats",
    "Nutrition",
    "Grooming & Care",
    "Play & Enrichment",
];

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load products."
                );
            }

            setProducts(data.products || []);
        } catch (err) {
            console.error("Products error:", err);
            setError(
                err.message || "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return products.filter((product) => {
            const matchesSearch =
                !searchText ||
                product.name
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.description
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.category
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, category]);

    const totalStock = products.reduce(
        (sum, product) =>
            sum + Number(product.stock || 0),
        0
    );

    const totalValue = products.reduce(
        (sum, product) =>
            sum +
            Number(product.price || 0) *
                Number(product.stock || 0),
        0
    );

    const lowStockCount = products.filter(
        (product) =>
            Number(product.stock || 0) > 0 &&
            Number(product.stock || 0) <= 5
    ).length;

    const outOfStockCount = products.filter(
        (product) => Number(product.stock || 0) === 0
    ).length;

    const openAddModal = () => {
        setEditingProduct(null);
        setForm({ ...emptyForm });
        setError("");
        setSuccess("");
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);

        setForm({
            name: product.name || "",
            category: product.category || "Dogs",
            description: product.description || "",
            price: product.price ?? "",
            rating: product.rating ?? "4.5",
            stock: product.stock ?? "",
            image: product.image || "",
        });

        setError("");
        setSuccess("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingProduct(null);
        setForm({ ...emptyForm });
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!form.category) {
            setError("Please select a category.");
            return;
        }

        if (
            form.price === "" ||
            Number(form.price) < 0
        ) {
            setError("Please enter a valid price.");
            return;
        }

        if (
            form.stock === "" ||
            Number(form.stock) < 0
        ) {
            setError("Please enter a valid stock quantity.");
            return;
        }

        if (
            form.rating !== "" &&
            (Number(form.rating) < 0 ||
                Number(form.rating) > 5)
        ) {
            setError("Rating must be between 0 and 5.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const productData = {
                name: form.name.trim(),
                category: form.category,
                description: form.description.trim(),
                price: Number(form.price),
                rating:
                    form.rating === ""
                        ? 4.5
                        : Number(form.rating),
                stock: Number(form.stock),
                image: form.image.trim(),
            };

            const url = editingProduct
                ? `${API_URL}/${editingProduct.id}`
                : API_URL;

            const method = editingProduct
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "Failed to save product."
                );
            }

            await fetchProducts();

            setShowModal(false);
            setEditingProduct(null);
            setForm({ ...emptyForm });

            setSuccess(
                editingProduct
                    ? "Product updated successfully! ✓"
                    : "Product added successfully! ✓"
            );

            setTimeout(() => {
                setSuccess("");
            }, 3500);
        } catch (err) {
            console.error(
                "Save product error:",
                err
            );

            setError(
                err.message ||
                    "Failed to save product."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeletingId(product.id);
            setError("");

            const response = await fetch(
                `${API_URL}/${product.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "Failed to delete product."
                );
            }

            setProducts((current) =>
                current.filter(
                    (item) =>
                        item.id !== product.id
                )
            );

            setSuccess(
                `"${product.name}" deleted successfully.`
            );

            setTimeout(() => {
                setSuccess("");
            }, 3500);
        } catch (err) {
            console.error(
                "Delete product error:",
                err
            );

            setError(
                err.message ||
                    "Failed to delete product."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const getStockStatus = (stock) => {
        const value = Number(stock || 0);

        if (value === 0) {
            return {
                label: "Out of stock",
                className: "out",
            };
        }

        if (value <= 5) {
            return {
                label: "Low stock",
                className: "low",
            };
        }

        return {
            label: "In stock",
            className: "good",
        };
    };

    const getCategoryIcon = (item) => {
        const icons = {
            Dogs: "🐶",
            Cats: "🐱",
            Nutrition: "🥣",
            "Grooming & Care": "🧴",
            "Play & Enrichment": "🎾",
        };

        return icons[item] || "🐾";
    };

    return (
        <section className="admin-products-page">
            {/* HEADER */}
            <div className="admin-page-header">
                <div>
                    <span className="admin-page-eyebrow">
                        🛍️ STORE MANAGEMENT
                    </span>

                    <h1>Products</h1>

                    <p>
                        Manage your pet-care products,
                        inventory and pricing.
                    </p>
                </div>

                <button
                    className="admin-add-product-btn"
                    onClick={openAddModal}
                >
                    <span>＋</span>
                    Add Product
                </button>
            </div>

            {/* SUCCESS */}
            {success && (
                <div className="admin-products-success">
                    <span>✓</span>
                    {success}
                </div>
            )}

            {/* ERROR */}
            {error && !showModal && (
                <div className="admin-products-error">
                    ⚠️
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* STATS */}
            <div className="admin-product-stats">
                <div className="admin-product-stat">
                    <div className="admin-product-stat-icon">
                        🛍️
                    </div>

                    <div>
                        <span>Total Products</span>
                        <strong>
                            {products.length}
                        </strong>
                    </div>
                </div>

                <div className="admin-product-stat">
                    <div className="admin-product-stat-icon">
                        📦
                    </div>

                    <div>
                        <span>Total Stock</span>
                        <strong>{totalStock}</strong>
                    </div>
                </div>

                <div className="admin-product-stat">
                    <div className="admin-product-stat-icon warning">
                        ⚠️
                    </div>

                    <div>
                        <span>Low Stock</span>
                        <strong>
                            {lowStockCount}
                        </strong>
                    </div>
                </div>

                <div className="admin-product-stat">
                    <div className="admin-product-stat-icon danger">
                        🚨
                    </div>

                    <div>
                        <span>Out of Stock</span>
                        <strong>
                            {outOfStockCount}
                        </strong>
                    </div>
                </div>

                <div className="admin-product-stat admin-product-stat-wide">
                    <div className="admin-product-stat-icon money">
                        ₹
                    </div>

                    <div>
                        <span>Inventory Value</span>
                        <strong>
                            ₹
                            {totalValue.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="admin-products-card">
                <div className="admin-products-toolbar">
                    <div className="admin-products-toolbar-heading">
                        <div>
                            <h2>Product Inventory</h2>
                            <p>
                                {filteredProducts.length}{" "}
                                products displayed
                            </p>
                        </div>
                    </div>

                    <div className="admin-products-search">
                        <span>🔎</span>

                        <input
                            type="text"
                            placeholder="Search name, category..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {search && (
                            <button
                                onClick={() =>
                                    setSearch("")
                                }
                                type="button"
                                title="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        className="admin-products-refresh"
                        onClick={fetchProducts}
                        disabled={loading}
                    >
                        ↻
                        <span>Refresh</span>
                    </button>
                </div>

                {/* CATEGORY FILTERS */}
                <div className="admin-product-category-filters">
                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={
                                category === item
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setCategory(item)
                            }
                        >
                            {item !== "All" && (
                                <span>
                                    {getCategoryIcon(
                                        item
                                    )}
                                </span>
                            )}

                            {item === "All"
                                ? "All Products"
                                : item}
                        </button>
                    ))}
                </div>

                {/* PRODUCTS */}
                {loading ? (
                    <div className="admin-products-loading">
                        <div className="admin-spinner"></div>
                        <h3>
                            Loading products...
                        </h3>
                        <p>
                            Getting your inventory ready.
                        </p>
                    </div>
                ) : filteredProducts.length ===
                  0 ? (
                    <div className="admin-products-empty">
                        <div className="admin-products-empty-icon">
                            🐾
                        </div>

                        <h3>
                            No products found
                        </h3>

                        <p>
                            Try another search or add a
                            new product.
                        </p>

                        <div>
                            {search && (
                                <button
                                    type="button"
                                    className="admin-empty-secondary"
                                    onClick={() => {
                                        setSearch("");
                                        setCategory(
                                            "All"
                                        );
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}

                            <button
                                type="button"
                                className="admin-empty-primary"
                                onClick={
                                    openAddModal
                                }
                            >
                                ＋ Add Product
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="admin-products-table-wrapper">
                        <table className="admin-products-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>RATING</th>
                                    <th>STOCK</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map(
                                    (product) => {
                                        const stockStatus =
                                            getStockStatus(
                                                product.stock
                                            );

                                        return (
                                            <tr
                                                key={
                                                    product.id
                                                }
                                            >
                                                <td>
                                                    <div className="admin-product-info">
                                                        <div className="admin-product-image">
                                                            {product.image ? (
                                                                <img
                                                                    src={
                                                                        product.image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                        e.currentTarget.nextElementSibling.style.display =
                                                                            "flex";
                                                                    }}
                                                                />
                                                            ) : null}

                                                            <span
                                                                style={{
                                                                    display:
                                                                        product.image
                                                                            ? "none"
                                                                            : "flex",
                                                                }}
                                                            >
                                                                {getCategoryIcon(
                                                                    product.category
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    product.name
                                                                }
                                                            </strong>

                                                            <p>
                                                                ID #
                                                                {
                                                                    product.id
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="admin-product-category">
                                                        {
                                                            product.category
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong className="admin-product-price">
                                                        ₹
                                                        {Number(
                                                            product.price ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span className="admin-product-rating">
                                                        ★{" "}
                                                        {Number(
                                                            product.rating ||
                                                                0
                                                        ).toFixed(
                                                            1
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            product.stock
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`admin-stock-badge ${stockStatus.className}`}
                                                    >
                                                        <span></span>
                                                        {
                                                            stockStatus.label
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="admin-product-actions">
                                                        <button
                                                            type="button"
                                                            className="admin-product-edit"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    product
                                                                )
                                                            }
                                                            title="Edit product"
                                                        >
                                                            ✏️
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-product-delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                product.id
                                                            }
                                                            title="Delete product"
                                                        >
                                                            {deletingId ===
                                                            product.id
                                                                ? "..."
                                                                : "🗑️"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading &&
                    filteredProducts.length > 0 && (
                        <div className="admin-products-footer">
                            <span>
                                Showing{" "}
                                <strong>
                                    {
                                        filteredProducts.length
                                    }
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {products.length}
                                </strong>{" "}
                                products
                            </span>

                            <span>
                                💳 Prices shown in Indian
                                Rupees
                            </span>
                        </div>
                    )}
            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (
                <div
                    className="admin-product-modal-overlay"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >
                    <div className="admin-product-modal">
                        <div className="admin-product-modal-header">
                            <div>
                                <span>
                                    {editingProduct
                                        ? "✏️ EDIT PRODUCT"
                                        : "✨ NEW PRODUCT"}
                                </span>

                                <h2>
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h2>

                                <p>
                                    Enter the product details
                                    below.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>
                        </div>

                        {error && (
                            <div className="admin-products-error modal-error">
                                ⚠️
                                <span>{error}</span>
                            </div>
                        )}

                        <form
                            className="admin-product-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="admin-form-grid">
                                <div className="admin-form-field full">
                                    <label>
                                        Product Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Premium Dog Treats"
                                    />
                                </div>

                                <div className="admin-form-field">
                                    <label>
                                        Category *
                                    </label>

                                    <select
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        {categories
                                            .filter(
                                                (item) =>
                                                    item !==
                                                    "All"
                                            )
                                            .map(
                                                (item) => (
                                                    <option
                                                        key={
                                                            item
                                                        }
                                                        value={
                                                            item
                                                        }
                                                    >
                                                        {getCategoryIcon(
                                                            item
                                                        )}{" "}
                                                        {item}
                                                    </option>
                                                )
                                            )}
                                    </select>
                                </div>

                                <div className="admin-form-field">
                                    <label>
                                        Price (₹) *
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="price"
                                        value={form.price}
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="599"
                                    />
                                </div>

                                <div className="admin-form-field">
                                    <label>
                                        Rating
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        name="rating"
                                        value={
                                            form.rating
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="4.5"
                                    />
                                </div>

                                <div className="admin-form-field">
                                    <label>
                                        Stock *
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="stock"
                                        value={form.stock}
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="25"
                                    />
                                </div>

                                <div className="admin-form-field full">
                                    <label>
                                        Image URL
                                    </label>

                                    <input
                                        type="url"
                                        name="image"
                                        value={form.image}
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://images.unsplash.com/..."
                                    />

                                    {form.image && (
                                        <div className="admin-product-image-preview">
                                            <img
                                                src={
                                                    form.image
                                                }
                                                alt="Product preview"
                                                onError={(
                                                    e
                                                ) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                            <span>
                                                Image Preview
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="admin-form-field full">
                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="4"
                                        placeholder="Describe this product..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="admin-product-modal-actions">
                                <button
                                    type="button"
                                    className="admin-modal-cancel"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-modal-save"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                        ? "✓ Update Product"
                                        : "＋ Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminProducts;