import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { FaEnvelope, FaInstagram, FaPhoneAlt } from "react-icons/fa";

// PUBLIC
import AboutUs from "./components/AboutUs.jsx";
import Flowers from "./components/Flowers";
import Bouquets from "./components/Bouquets";
import Occasions from "./components/Occasions";
import Reviews from "./components/Reviews";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import FlowerStore from "./components/FlowerStore";
import SearchResults from "./pages/SearchResults";

// ADMIN DASHBOARD
import AdminDashboard from "./components/AdminDashboard";

// CRUD
import FlowerCRUD from "./components/FlowerCRUD";
import BouquetCRUD from "./components/BouquetCRUD";
import OccasionCRUD from "./components/OccasionCRUD";
import SupplierCRUD from "./components/SupplierCRUD";
import OrderPage from "./components/OrderPage";
import CategoriesCRUD from "./components/CategoriesCRUD";
import InventoryCRUD from "./components/InventoryCRUD";
import OrderDetails from "./components/OrderDetails";
import PaymentsCrud from "./components/PaymentsCrud";
import SupplyOrders from "./components/SupplyOrders";
import CustomerCRUD from "./components/CustomerCRUD";
import DeliveriesCRUD from "./components/DeliveriesCRUD.jsx";
import ReviewsCRUD from "./components/ReviewsCRUD";
import OrderCRUD from "./components/OrderCRUD";

// AUTH
import PrivateRoute from "./components/PrivateRoute";

// CART
import { useCart } from "./context/CartContext.jsx";

/* ================= CART ================= */
const CartPageComponent = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    city: "Prishtinë",
    address: "",
    phone: "",
    paymentMethod: "Cash",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (
      !shippingDetails.fullName ||
      !shippingDetails.address ||
      !shippingDetails.phone
    ) {
      alert("Plotëso të gjitha fushat!");
      return;
    }

    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000),
      customer: shippingDetails.fullName,
      date: new Date().toLocaleDateString("sq-AL"),
      deliveryAddress: `${shippingDetails.address}, ${shippingDetails.city}`,
      totalRevenue: total.toFixed(2),
      status: "PENDING",
    };

    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem(
      "orders",
      JSON.stringify([...existing, newOrder])
    );

    setOrderSuccess(true);

    setTimeout(() => {
      clearCart();
      setShowCheckoutModal(false);
      setOrderSuccess(false);
    }, 3000);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Shporta</h2>

      {cartItems.length === 0 ? (
        <Link to="/">Kthehu te dyqani</Link>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <h4>{item.name}</h4>
              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ${total.toFixed(2)}</h3>

          <button onClick={clearCart}>Clear</button>

          <button onClick={() => setShowCheckoutModal(true)}>
            Checkout
          </button>
        </>
      )}

      {showCheckoutModal && (
        <div>
          {!orderSuccess ? (
            <form onSubmit={handlePlaceOrder}>
              <input
                name="fullName"
                value={shippingDetails.fullName}
                onChange={handleInputChange}
                placeholder="Name"
              />

              <input
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                placeholder="Address"
              />

              <input
                name="phone"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />

              <button type="submit">Submit</button>
            </form>
          ) : (
            <h3>Order sukses!</h3>
          )}
        </div>
      )}
    </div>
  );
};

/* ================= FOOTER ================= */
const AppFooter = () => (
  <footer style={{ background: "#2B1A4A", color: "white", padding: 40 }}>
    <p>Flower Shop</p>
  </footer>
);

/* ================= APP CONTENT ================= */
function AppContent() {
  const location = useLocation();
  const isAuth =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!isAuth && <Navbar />}

      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <FlowerStore />
            </PrivateRoute>
          }
        />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/user/flowers" element={<Flowers />} />
        <Route path="/user/bouquets" element={<Bouquets />} />
        <Route path="/user/occasions" element={<Occasions />} />
        <Route path="/user/reviews" element={<Reviews />} />

        {/* CART */}
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <CartPageComponent />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* CRUD ADMIN */}
        <Route path="/flowers" element={<PrivateRoute adminOnly><FlowerCRUD /></PrivateRoute>} />
        <Route path="/bouqet-flowers" element={<PrivateRoute adminOnly><BouquetCRUD /></PrivateRoute>} />
        <Route path="/bouquets" element={<PrivateRoute adminOnly><BouquetCRUD /></PrivateRoute>} />
        <Route path="/occasions" element={<PrivateRoute adminOnly><OccasionCRUD /></PrivateRoute>} />
        <Route path="/suppliers" element={<PrivateRoute adminOnly><SupplierCRUD /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute adminOnly><OrderPage /></PrivateRoute>} />
        <Route path="/order-details" element={<PrivateRoute adminOnly><OrderDetails /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute adminOnly><PaymentsCrud /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute adminOnly><CustomerCRUD /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute adminOnly><InventoryCRUD /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute adminOnly><CategoriesCRUD /></PrivateRoute>} />
        <Route path="/deliveries" element={<PrivateRoute adminOnly><DeliveriesCRUD /></PrivateRoute>} />
        <Route path="/reviews" element={<PrivateRoute adminOnly><ReviewsCRUD /></PrivateRoute>} />
        <Route path="/supply-orders" element={<PrivateRoute adminOnly><SupplyOrders /></PrivateRoute>} />

        {/* SEARCH */}
        <Route path="/search" element={<SearchResults />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!isAuth && <AppFooter />}
    </>
  );
}

/* ================= ROOT ================= */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}