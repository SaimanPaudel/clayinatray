import { useNavigate } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div style={styles.page}>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>Clay in a Tray</div>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </nav>

      {/* CONTENT */}
      <div style={styles.container}>
        <h2 style={styles.title}>Your Cart</h2>

        {cart.length === 0 ? (
          <p style={styles.empty}>Your cart is empty</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} style={styles.card}>
                <img src={item.image} alt={item.name} style={styles.image} />

                <div style={styles.info}>
                  <h3 style={styles.name}>{item.name}</h3>
                  <p style={styles.location}>{item.location}</p>
                  <p style={styles.price}>${item.price} / night</p>
                </div>

                <button
                  className="btn-secondary"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div style={styles.totalBox}>
              <h3>Total: ${totalPrice}</h3>
              <button className="btn-primary">Checkout</button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Georgia', serif",
    background: "#f5f0eb",
    minHeight: "100vh",
    color: "#2c2c2c",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    height: 64,
    borderBottom: "1px solid #e8e2db",
    background: "#f5f0eb",
  },

  navLogo: {
    color: "#3a7a8c",
    fontStyle: "italic",
    fontWeight: 600,
    fontSize: "1.2rem",
  },

  container: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "40px 20px",
  },

  title: {
    fontSize: "1.6rem",
    marginBottom: 20,
  },

  empty: {
    color: "#777",
  },

  card: {
    display: "flex",
    gap: 20,
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  image: {
    width: 120,
    height: 80,
    objectFit: "cover",
    borderRadius: 8,
  },

  info: {
    flex: 1,
  },

  name: {
    margin: "0 0 6px",
    fontSize: "1rem",
  },

  location: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#777",
  },

  price: {
    marginTop: 6,
    fontWeight: 600,
    color: "#c0533a",
  },

  totalBox: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e8e2db",
    paddingTop: 20,
  },
};