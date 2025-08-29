import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, auth } from './../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Monitorar login do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const cartRef = doc(db, 'carts', user.uid);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          setCartItems(cartSnap.data().items || []);
        } else {
          await setDoc(cartRef, { items: [] });
          setCartItems([]);
        }
      } else {
        setUserId(null);
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveCartToFirebase = async (items) => {
    if (!userId) return;
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { items }, { merge: true });
  };

  useEffect(() => {
    saveCartToFirebase(cartItems);
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, quantity) =>
    setCartItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
    );

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount, // <-- agora disponível
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
