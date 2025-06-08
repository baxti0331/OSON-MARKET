import { reactive } from "react";

export const cart = {
  items: [],
  addItem(product) {
    const exist = this.items.find(item => item.product.id === product.id);
    if (exist) {
      exist.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }
  },
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  },
  clear() {
    this.items = [];
  },
  get totalPrice() {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
};
