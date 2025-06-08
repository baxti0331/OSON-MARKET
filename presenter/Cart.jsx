import React from "react";

export function Cart({ items, removeItem, clearCart, totalPrice }) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Корзина</h2>
      {items.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <>
          <ul>
            {items.map(({ product, quantity }) => (
              <li key={product.id} style={{ marginBottom: "10px" }}>
                {product.name} — {quantity} шт. — {(product.price * quantity).toLocaleString()} ₽
                <button
                  onClick={() => removeItem(product.id)}
                  style={{
                    marginLeft: "10px",
                    padding: "4px 8px",
                    backgroundColor: "#FF4D4F",
                    border: "none",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <b>Итого: {totalPrice.toLocaleString()} ₽</b>
          <br />
          <button
            onClick={clearCart}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "#FF4D4F",
              border: "none",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Очистить корзину
          </button>
        </>
      )}
    </div>
  );
}
