import React from "react";

export function ProductList({ products, addItem }) {
  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {products.map(product => (
        <div key={product.id} style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          maxWidth: "220px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <b>{product.price.toLocaleString()} ₽</b>
          <button
            onClick={() => addItem(product)}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "8px",
              backgroundColor: "#008CFF",
              border: "none",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            В корзину
          </button>
        </div>
      ))}
    </div>
  );
}
