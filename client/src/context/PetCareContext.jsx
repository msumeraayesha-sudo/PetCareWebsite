import { createContext, useContext, useEffect, useState } from "react";

const PetCareContext = createContext();

export function PetCareProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("petCareCart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("petCareWishlist");
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem("petCareCart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("petCareWishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    // ADD TO CART
    const addToCart = (product) => {
        setCart((currentCart) => {
            const existingProduct = currentCart.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    };

    // REMOVE FROM CART
    const removeFromCart = (productId) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item.id !== productId)
        );
    };

    // INCREASE QUANTITY
    const increaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // DECREASE QUANTITY
    const decreaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity: Math.max(1, item.quantity - 1),
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // CLEAR CART
    const clearCart = () => {
        setCart([]);
    };

    // ADD / REMOVE WISHLIST
    const toggleWishlist = (product) => {
        setWishlist((currentWishlist) => {
            const exists = currentWishlist.some(
                (item) => item.id === product.id
            );

            if (exists) {
                return currentWishlist.filter(
                    (item) => item.id !== product.id
                );
            }

            return [...currentWishlist, product];
        });
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item.id === productId);
    };

    // TOTAL ITEMS
    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // TOTAL PRICE
    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <PetCareContext.Provider
            value={{
                cart,
                wishlist,
                cartCount,
                cartTotal,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                toggleWishlist,
                isInWishlist,
            }}
        >
            {children}
        </PetCareContext.Provider>
    );
}

export function usePetCare() {
    return useContext(PetCareContext);
}