import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios";

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [occasion, setOccasion] = useState("Birthday");

  const { addToCart } = useCart();

  const isAdmin = localStorage.getItem("role") === "ADMIN";

  // PRODUCTS
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // POPUP
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  // REVIEWS
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [newReview, setNewReview] = useState({
    customerId: "",
    comment: "",
  });

  useEffect(() => {
    setIsVisible(true);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/products/all"
        );

        setDeals(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter((product) => {
      if (!occasion) return true;

      return (
        product.occasion?.toLowerCase() ===
        occasion.toLowerCase()
      );
    });
  }, [deals, occasion]);

  const circularCategories = [
    {
      name: "Birthday",
      img: "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=300",
    },
    {
      name: "Sympathy",
      img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=300",
    },
    {
      name: "Occasions",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300",
    },
    {
      name: "Flowers",
      img: "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=300",
    },
    {
      name: "Plants",
      img: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=300",
    },
    {
      name: "Gifts",
      img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300",
    },
  ];

  const testimonials = [
    {
      name: "Pamela",
      title: "Beautiful",
      text: `"I bought these for my Nana's birthday she said they were amazingly beautiful!"`,
    },
    {
      name: "Michelle",
      title: "Best Flowers",
      text: `"These flowers are beautiful and just as vibrant as the picture."`,
    },
    {
      name: "Betty",
      title: "Very Happy!",
      text: `"I love how the recipient can plant the roses and enjoy them."`,
    },
    {
      name: "Brian",
      title: "Sweet Anniversary",
      text: `"The strawberries arrived on time and were fantastic."`,
    },
  ];

  const handleSearchGift = (e) => {
    e.preventDefault();
  };

  const openQuantityPopup = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowPopup(true);
  };

  const handleConfirmAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct);
    }

    setShowPopup(false);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#FAF8F5",
        color: "#1F1F1F",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.5s ease",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          background: "#110D1A",
          color: "#FAF8F5",
          fontSize: "11px",
          letterSpacing: "2px",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Same-Day Delivery Available • Freshness Guaranteed •
          Premium Quality Standards
        </div>

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                background: "#0E5A5B",
                color: "white",
                padding: "8px 16px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "600",
                borderRadius: "4px",
                transition: "0.3s ease",
              }}
            >
              Admin Dashboard
            </button>
          </Link>
        )}
      </div>

      {/* NAV */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          justifyContent: "center",
          padding: "22px 20px",
          borderBottom: "1px solid #E6E0D8",
          background: "#FFFFFF",
          flexWrap: "wrap",
        }}
      >
        {["flowers", "bouquets", "occasions"].map((item) => (
          <Link
            key={item}
            to={`/user/${item}`}
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#1F1F1F",
              textDecoration: "none",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              transition: "0.3s ease",
            }}
          >
            {item}
          </Link>
        ))}
      </div>

      {/* SEARCH */}
      <div
        style={{
          background: "#0E5A5B",
          color: "#FFFFFF",
          padding: "30px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          Find the Perfect Gift
        </div>

        <form
          onSubmit={handleSearchGift}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="Delivery ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #FFFFFF",
              outline: "none",
              minWidth: "220px",
              borderRadius: "4px",
            }}
          />

          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            style={{
              padding: "12px 16px",
              background: "#FFFFFF",
              borderRadius: "4px",
              border: "none",
              minWidth: "180px",
            }}
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Romance">Romance</option>
            <option value="Sympathy">Sympathy</option>
          </select>

          <button
            type="submit"
            style={{
              background: "#110D1A",
              color: "#FFFFFF",
              border: "none",
              padding: "12px 28px",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "0.3s ease",
              fontWeight: "600",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* HERO */}
      <section
        style={{
          display: "flex",
          background: "#F5F0EB",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 500px" }}>
          <img
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=900"
            alt="Summer"
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            flex: "1 1 400px",
            padding: "60px 5%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "34px",
              marginBottom: "12px",
            }}
          >
            Summer In Bloom Sale
          </div>

          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "64px",
              fontWeight: "700",
              color: "#2B1A4A",
            }}
          >
            Save 20%
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        style={{
          padding: "60px 6%",
          textAlign: "center",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
            justifyContent: "center",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          {circularCategories.map((cat) => (
            <div
              key={cat.name}
              style={{
                flex: "0 0 130px",
                transition: "0.3s ease",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto 14px auto",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        style={{
          padding: "70px 6%",
          background: "#FAF8F5",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "32px",
            textAlign: "center",
            marginBottom: "45px",
            color: "#110D1A",
          }}
        >
          Seasonal Pricing Tiers
        </h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading products...</p>
        ) : error ? (
          <p
            style={{
              textAlign: "center",
              color: "red",
            }}
          >
            {error}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "28px",
              maxWidth: "1300px",
              margin: "0 auto",
            }}
          >
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E6E0D8",
                  textAlign: "center",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.06)",
                  transition: "0.3s ease",
                }}
              >
                <div style={{ height: "240px" }}>
                  <img
                    src={deal.imageUrl}
                    alt={deal.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=Flowers";
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ padding: "22px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {deal.name}
                  </div>

                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "22px",
                      color: "#0E5A5B",
                      marginBottom: "12px",
                    }}
                  >
                    {deal.description}
                  </div>

                  <div
                    style={{
                      marginBottom: "18px",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    ${deal.price}
                  </div>

                  <button
                    onClick={() => openQuantityPopup(deal)}
                    style={{
                      background: "#2B1A4A",
                      color: "white",
                      border: "none",
                      padding: "12px 18px",
                      cursor: "pointer",
                      width: "100%",
                      fontSize: "13px",
                      borderRadius: "6px",
                      transition: "0.3s ease",
                      fontWeight: "600",
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section
        style={{
          padding: "70px 6%",
          background: "#FFFFFF",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "30px",
            marginBottom: "40px",
          }}
        >
          Verified Client Feedback
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "30px",
            maxWidth: "1300px",
            margin: "0 auto",
          }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: "#FAF8F5",
                padding: "30px",
                borderRadius: "10px",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "12px",
                }}
              >
                {t.title}
              </div>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "#555",
                }}
              >
                {t.text}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          style={{
            marginTop: "35px",
            background: "#0E5A5B",
            color: "white",
            border: "none",
            padding: "14px 24px",
            cursor: "pointer",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          Leave A Review
        </button>
      </section>

      {/* QUANTITY MODAL */}
      {showPopup && selectedProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFF",
              padding: "35px",
              width: "100%",
              maxWidth: "420px",
              borderRadius: "12px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                fontSize: "28px",
                marginBottom: "14px",
                color: "#2B1A4A",
              }}
            >
              Zgjedh Sasinë
            </h3>

            <p
              style={{
                marginBottom: "24px",
                color: "#666",
              }}
            >
              Sa paketa të{" "}
              <strong>{selectedProduct.name}</strong> dëshironi?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
                marginBottom: "25px",
              }}
            >
              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                -
              </button>

              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
                fontWeight: "700",
                color: "#0E5A5B",
              }}
            >
              Total: $
              {(selectedProduct.price * quantity).toFixed(2)}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #999",
                  background: "transparent",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAdd}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#2B1A4A",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "6px",
                  fontWeight: "600",
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFF",
              padding: "35px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                color: "#2B1A4A",
              }}
            >
              Lini Vlerësimin
            </h3>

            <input
              placeholder="Emri"
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
              onChange={(e) =>
                setNewReview({
                  ...newReview,
                  customerId: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Komentoni këtu..."
              style={{
                width: "100%",
                padding: "14px",
                height: "120px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                resize: "none",
              }}
              onChange={(e) =>
                setNewReview({
                  ...newReview,
                  comment: e.target.value,
                })
              }
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid #333",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                Anulo
              </button>

              <button
                onClick={() => {
                  if (!newReview.comment.trim()) return;

                  const existingReviews = JSON.parse(
                    localStorage.getItem("reviews") || "[]"
                  );

                  const newReviewEntry = {
                    id: Date.now(),
                    customerId:
                      newReview.customerId || "Anonim",
                    comment: newReview.comment,
                    score: 5,
                  };

                  localStorage.setItem(
                    "reviews",
                    JSON.stringify([
                      ...existingReviews,
                      newReviewEntry,
                    ])
                  );

                  setShowReviewModal(false);

                  alert(
                    "Faleminderit për vlerësimin!"
                  );
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#0E5A5B",
                  color: "#FFF",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "6px",
                  fontWeight: "600",
                }}
              >
                Dërgo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;

