import { useState } from "react";

export function useCartController() {
  const [items, setItems] = useState([]);

  function addItem(product) {
    setItems(prev => {
      const exist = prev.find(i => i.product.id === product.id);
      if (exist) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  }

  function removeItem(productId) {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    totalPrice,
  };
}
