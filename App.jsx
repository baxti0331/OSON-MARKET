import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const API_URL = "http://localhost:4000/api/packages";

function App() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setPackages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <h2>Загрузка пакетов UC...</h2>;

  return (
    <div>
      <h1>PUBG Mobile UC Store</h1>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {packages.map(p => (
          <li key={p.id} style={{
            background: "#1c2541",
            marginBottom: "10px",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 0 8px #d90429"
          }}>
            <strong style={{ fontSize: "1.2rem" }}>{p.name}</strong>
            <div style={{ fontSize: "1rem", marginTop: "5px" }}>
              Цена: <span style={{ color: "#d90429" }}>${p.price.toFixed(2)}</span>
            </div>
            <button style={{
              marginTop: "10px",
              background: "#d90429",
              border: "none",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer"
            }}>
              Купить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));