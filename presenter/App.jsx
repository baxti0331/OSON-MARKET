import React from "react";
import { products } from "../model/products";
import { useCartController } from "../controller/cartController";
import { ProductList } from "./ProductList";
import { Cart } from "./Cart";

export function App() {
  const cartController = useCartController();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>Маркетплейс</h1>
      <ProductList products={products} addItem={cartController.addItem} />
      <Cart
        items={cartController.items}
        removeItem={cartController.removeItem}
        clearCart={cartController.clearCart}
        totalPrice={cartController.totalPrice}
      />
    </div>
  );
}
