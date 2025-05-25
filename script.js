import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const orange = '#ff6600';
const darkBg = '#121417';
const cardBg = '#1f2028';

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
      <div style={{
        width: 60,
        height: 60,
        border: '8px solid #333',
        borderTop: `8px solid ${orange}`,
        borderRadius: '50%',
        animation: 'spin 1.5s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}

function App() {
  const [packages, setPackages] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [editPriceId, setEditPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/packages')
      .then(res => res.json())
      .then(setPackages)
      .catch(() => alert('Ошибка загрузки пакетов'));
  }, []);

  const login = () => {
    if (passwordInput === 'supersecret') {
      setIsAdmin(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const updatePrice = async (id) => {
    if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
      alert('Введите корректную цену');
      return;
    }
    const response = await fetch('http://localhost:4000/api/update-price', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput, id, newPrice: parseFloat(newPrice) }),
    });
    const data = await response.json();
    if (data.success) {
      setPackages(data.packages);
      setEditPriceId(null);
      setNewPrice('');
      alert('Цена обновлена');
    } else {
      alert(data.error || 'Ошибка');
    }
  };

  if (!packages) return <Loader />;

  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{
          fontWeight: '900',
          fontSize: '3rem',
          color: orange,
          textShadow: '0 0 10px #ff7c00',
          letterSpacing: '0.15em',
          fontFamily: "'Orbitron', sans-serif",
        }}>
          PUBG MOBILE UC STORE
        </h1>
        <p style={{ fontStyle: 'italic', color: '#aaa', marginTop: -10 }}>
          Быстрая и безопасная покупка UC
        </p>
      </header>

      {!isAdmin ? (
        <div style={{ maxWidth: 320, margin: '0 auto' }}>
          <input
            type="password"
            placeholder="Пароль администратора"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: 'none',
              marginBottom: 12,
              fontSize: 16,
              boxShadow: '0 0 6px #ff6600',
              backgroundColor: '#22232e',
              color: '#eee',
            }}
          />
          <button
            onClick={login}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: 'none',
              backgroundColor: orange,
              color: '#111',
              fontWeight: 'bold',
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 0 10px #ff6600',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ff7f1a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = orange}
          >
            Войти как админ
          </button>
        </div>
      ) : (
        <section style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            color: orange,
            textShadow: '0 0 8px #ff6600',
            marginBottom: 20,
            textAlign: 'center',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '0.1em',
          }}>
            Админка — Изменение цен
          </h2>
          {packages.map(pack => (
            <div key={pack.id} style={{
              backgroundColor: cardBg,
              marginBottom: 16,
              padding: 15,
              borderRadius: 12,
              boxShadow: '0 0 8px #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#eee',
              transition: 'box-shadow 0.3s',
            }}>
              <div style={{ fontWeight: '700', fontSize: 18 }}>{pack.name}</div>
              {editPriceId === pack.id ? (
                <>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    style={{
                      width: 90,
                      padding: 6,
                      borderRadius: 6,
                      border: '1px solid #444',
                      fontSize: 16,
                      marginRight: 12,
                      backgroundColor: '#2a2b38',
                      color: '#fff',
                    }}
                  />
                  <button
                    onClick={() => updatePrice(pack.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 0 8px #4caf50',
                      marginRight: 8,
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#66bb6a'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4caf50'}
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setEditPriceId(null)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: '#f44336',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 0 8px #f44336',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e57373'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f44336'}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 18, minWidth: 80 }}>${pack.price.toFixed(2)}</div>
                  <button
                    onClick={() => { setEditPriceId(pack.id); setNewPrice(pack.price); }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 6,
                      border: 'none',
                      backgroundColor: '#ff9800',
                      color: '#111',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 0 10px #ff9800',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ffb74d'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ff9800'}
                  >
                    Изменить
                  </button>
                </>
              )}
            </div>
          ))}
          <button
            onClick={() => { setIsAdmin(false); setPasswordInput(''); }}
            style={{
              display: 'block',
              margin: '30px auto 0',
              padding: '12px 30px',
              borderRadius: 30,
              backgroundColor: '#555',
              border: 'none',
              color: '#ccc',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 0 8px #555',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#777'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#555'}
          >
            Выйти из админки
          </button>
        </section>
      )}

      <section style={{ marginTop: 50 }}>
        <h2 style={{
          textAlign: 'center',
          color: orange,
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: '0.15em',
          fontSize: '2rem',
          textShadow: '0 0 12px #ff6600',
          marginBottom: 30,
        }}>
          Выберите пакет UC
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          {packages.map(pack => (
            <div
              key={pack.id}
              onClick={() => alert(`Вы выбрали пакет ${pack.name} за $${pack.price.toFixed(2)}\n(Добавь оплату)`)}
              style={{
                backgroundColor: cardBg,
                width: 160,
                padding: 25,
                borderRadius: 20,
                boxShadow: `0 0 15px #ff6600`,
                color: '#fff',
                fontWeight: '700',
                fontSize: 20,
                textAlign: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.07)';
                e.currentTarget.style.boxShadow = '0 0 25px #ff8533';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 15px #ff6600';
              }}
            >
              {pack.name}
              <div style={{ marginTop: 12, fontSize: 18, color: '#ffbb33' }}>
                ${pack.price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          div[style*="display: flex"][style*="justify-content: center"] {
            flex-direction: column !important;
            align-items: center !important;
          }
          div[style*="width: 160px"] {
            width: 90% !important;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);