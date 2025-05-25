import React from "react";

const packages = [
  { id: 1, name: "100 UC", price: 1.99 },
  { id: 2, name: "300 UC", price: 4.99 },
  { id: 3, name: "600 UC", price: 8.99 },
  { id: 4, name: "1200 UC", price: 16.99 },
  { id: 5, name: "2500 UC", price: 34.99 },
];

export default function App() {
  return (
    <div style={{
      maxWidth: 600,
      margin: "20px auto",
      padding: 20,
      backgroundColor: "#0b132b",
      color: "white",
      fontFamily: "'Arial', sans-serif",
      borderRadius: 10
    }}>
      <h1 style={{ textAlign: "center" }}>PUBG Mobile UC Store</h1>
      {packages.map(pkg => (
        <div key={pkg.id} style={{
          backgroundColor: "#1c2541",
          padding: 15,
          margin: "10px 0",
          borderRadius: 8,
          boxShadow: "0 0 8px #d90429"
        }}>
          <strong style={{ fontSize: 18 }}>{pkg.name}</strong>
          <div style={{ marginTop: 8, fontSize: 16 }}>
            Цена: <span style={{ color: "#d90429" }}>${pkg.price.toFixed(2)}</span>
          </div>
          <button style={{
            marginTop: 12,
            backgroundColor: "#d90429",
            border: "none",
            color: "white",
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer"
          }}>
            Купить
          </button>
        </div>
      ))}
    </div>
  );
}