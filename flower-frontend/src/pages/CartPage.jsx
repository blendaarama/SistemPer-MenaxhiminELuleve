import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import axios from "axios";

const FONT = "'Inter', system-ui, sans-serif";
const SERIF = "'Georgia', serif";

const C = {
  bg: "#FAF8F5",
  white: "#FFFFFF",
  dark: "#1C1917",
  teal: "#0D5C5C",
  tealLight: "#E6F0F0",
  border: "#EAE4DC",
  muted: "#78716C",
  mutedLight: "#A8A29E",
  success: "#15803D",
  successBg: "#F0FDF4",
  red: "#DC2626",
  redBg: "#FEF2F2",
};

const API_URL = "http://localhost:8080/api/porosi";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  },
});

const Step = ({ n, label, active, done }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: done ? C.teal : active ? C.dark : C.border,
        color: done || active ? "#fff" : C.mutedLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "600",
        flexShrink: 0,
      }}
    >
      {done ? "✓" : n}
    </div>
    <span
      style={{
        fontSize: "13px",
        fontWeight: active || done ? "600" : "400",
        color: active ? C.dark : done ? C.teal : C.mutedLight,
      }}
    >
      {label}
    </span>
  </div>
);

const StepDivider = () => (
  <div style={{ flex: 1, height: 1, background: C.border, margin: "0 8px" }} />
);

const Badge = ({ children, color = C.teal, bg = C.tealLight }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: "11px",
      fontWeight: "600",
      color,
      background: bg,
      padding: "3px 9px",
      borderRadius: "999px",
      letterSpacing: "0.3px",
    }}
  >
    {children}
  </span>
);

const Input = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: C.muted,
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        marginBottom: "6px",
      }}
    >
      {label}
    </label>

    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px 14px",
        border: `1.5px solid ${C.border}`,
        borderRadius: "10px",
        background: C.white,
        fontSize: "14px",
        fontFamily: FONT,
        color: C.dark,
        outline: "none",
        boxSizing: "border-box",
      }}
      onFocus={(e) => (e.target.style.borderColor = C.teal)}
      onBlur={(e) => (e.target.style.borderColor = C.border)}
    />
  </div>
);

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subtotal = cartItems.reduce(
    (s, item) => s + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shipping = subtotal > 50 ? 0 : 4.99;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const itemCount = cartItems.reduce(
    (s, item) => s + Number(item.quantity || 0),
    0
  );

  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === "BLOOM10") {
      setPromoApplied(true);
    } else {
      alert("Kodi i promovimit është i pavlefshëm.");
    }
  };

 const handleCheckout = async () => {
  if (!customerName.trim() || !phone.trim() || !address.trim()) {
    alert("Ju lutem plotësoni emrin, numrin dhe adresën.");
    return;
  }

  setSubmitting(true);
  setSubmitError("");

  const nameParts = customerName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";

  const orderPayload = {
    adresaDorezimit: address.trim(),
    mesazhiKartoline: notes || "",
    shumeTotale: Number(total.toFixed(2)),
    statusi: "PRITJE",
    dataPorosise: new Date().toISOString().slice(0, 19),

    klienti: {
      emri: firstName,
      mbiemri: lastName,
      telefoni: phone.trim(),
      adresa: address.trim(),
      email:
        localStorage.getItem("userEmail") ||
        `${Date.now()}@customer.com`,
    },
  };

  try {
    const orderRes = await axios.post(API_URL, orderPayload, authHeaders());
    const savedOrder = orderRes.data;
    
    for (const item of cartItems) {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || item.cmimi || 0);

      const isBouquet =
        item.type === "BOUQUET" ||
        item.productType === "BOUQUET" ||
        item.category === "Bouquet" ||
        item.category === "Buqete";

      const detailPayload = {
        porosia: { id: savedOrder.id },
        flower: isBouquet ? null : { id: Number(item.id) },
        buqeta: isBouquet ? { id: Number(item.id) } : null,
        sasia: quantity,
        cmimi_njesi: price,
        shuma: Number((quantity * price).toFixed(2)),
      };

      await axios.post(
        "http://localhost:8080/api/order-details",
        detailPayload,
        authHeaders()
      );
    }

    // 2. KRIJO PAYMENT AUTOMATIKISHT
    const paymentPayload = {
      amount: Number(total.toFixed(2)),
      paymentMethod: paymentMethod === "card" ? "CARD" : "CASH",
      status: paymentMethod === "card" ? "COMPLETED" : "PENDING",
      porosia: {
        id: savedOrder.id,
      },
    };

    await axios.post(
      "http://localhost:8080/api/payments",
      paymentPayload,
      authHeaders()
    );

    clearCart();
    setStep(3);
  } catch (err) {
    console.error("Checkout error:", err.response?.data || err.message);

    const status = err.response?.status;

    if (status === 401 || status === 403) {
      setSubmitError("Sesioni ka skaduar. Ju lutem kyçuni sërish.");
    } else {
      setSubmitError("Porosia, detajet ose pagesa nuk u ruajtën. Kontrollo backend-in.");
    }
  } finally {
    setSubmitting(false);
  }
};

  if (step === 3) {
    return (
      <div
        style={{
          fontFamily: FONT,
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "420px", padding: "40px 24px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: C.successBg,
              border: `2px solid ${C.success}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "28px",
            }}
          >
            ✓
          </div>

          <h1
            style={{
              fontFamily: SERIF,
              fontSize: "28px",
              fontWeight: "700",
              color: C.dark,
              marginBottom: "12px",
            }}
          >
            Porosia u Konfirmua!
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: C.muted,
              lineHeight: "1.7",
              marginBottom: "8px",
            }}
          >
            Faleminderit, <strong>{customerName}</strong>! Porosia juaj u pranua.
          </p>

          <p
            style={{
              fontSize: "13px",
              color: C.mutedLight,
              marginBottom: "32px",
            }}
          >
            Numri: {phone} • Adresa: {address}
          </p>

          <Link
            to="/"
            style={{
              display: "inline-flex",
              padding: "12px 24px",
              background: C.dark,
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            ← Kthehu te Dyqani
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && step === 1) {
    return (
      <div
        style={{
          fontFamily: FONT,
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "40px 24px" }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>🛒</div>

          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "24px",
              fontWeight: "700",
              color: C.dark,
              marginBottom: "10px",
            }}
          >
            Shporta juaj është bosh
          </h2>

          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "13px 28px",
              background: C.dark,
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Shfletoni Produktet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, background: C.bg, minHeight: "100vh", color: C.dark }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 6%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: C.mutedLight,
              marginBottom: "20px",
            }}
          >
            <Link to="/" style={{ color: C.teal, textDecoration: "none", fontWeight: "500" }}>
              Ballina
            </Link>
            <span>›</span>
            <span style={{ color: C.dark }}>Shporta</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", maxWidth: "420px" }}>
            <Step n={1} label="Shporta" active={step === 1} done={step > 1} />
            <StepDivider />
            <Step n={2} label="Dorëzimi" active={step === 2} done={step > 2} />
            <StepDivider />
            <Step n={3} label="Konfirmimi" active={step === 3} done={false} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 6% 80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "30px",
                fontWeight: "700",
                margin: "0 0 4px",
              }}
            >
              {step === 1 ? "Shporta Ime" : "Detajet e Porosisë"}
            </h1>

            <p style={{ fontSize: "13px", color: C.muted, margin: 0 }}>
              {itemCount} artikuj • €{subtotal.toFixed(2)}
            </p>
          </div>

          {step === 1 && (
            <button
              onClick={clearCart}
              style={{
                background: "none",
                border: "none",
                color: C.mutedLight,
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: FONT,
              }}
            >
              Pastro shportën
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.dark,
                fontSize: "13px",
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "8px",
                fontFamily: FONT,
              }}
            >
              ← Ndrysho shportën
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "40px",
            alignItems: "start",
          }}
        >
          <div>
            {step === 1 && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1px",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {cartItems.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "96px 1fr auto",
                        gap: "20px",
                        alignItems: "center",
                        background: C.white,
                        padding: "20px",
                        borderBottom:
                          idx < cartItems.length - 1 ? `1px solid ${C.border}` : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 96,
                          height: 96,
                          borderRadius: "10px",
                          overflow: "hidden",
                          background: "#F5F1EC",
                        }}
                      >
                        {item.img ? (
                          <img
                            src={item.img}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "28px",
                            }}
                          >
                            🌸
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 style={{ fontSize: "15px", fontWeight: "600", margin: 0 }}>
                          {item.title || "Produkt"}
                        </h3>

                        {item.category && <Badge>{item.category}</Badge>}

                        <p style={{ fontSize: "13px", color: C.mutedLight }}>
                          €{Number(item.price || 0).toFixed(2)} / copë
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={() =>
                              item.quantity === 1
                                ? removeFromCart(item.id)
                                : updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            +
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: C.mutedLight,
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Hiq
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", fontWeight: "700" }}>
                        €{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  <p style={{ fontSize: "13px", fontWeight: "600" }}>Kodi i Promovimit</p>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder='Provo "BLOOM10"'
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        border: `1.5px solid ${promoApplied ? C.success : C.border}`,
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />

                    {!promoApplied ? (
                      <button onClick={handlePromo}>Apliko</button>
                    ) : (
                      <span style={{ color: C.success, fontWeight: "600" }}>✓ −10%</span>
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px",
                  padding: "28px",
                }}
              >
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontSize: "20px",
                    fontWeight: "700",
                    margin: "0 0 24px",
                  }}
                >
                  Detajet e Dorëzimit
                </h2>

                <Input
                  label="Emri i plotë *"
                  placeholder="p.sh. Ardita Krasniqi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <Input
                  label="Numri telefonit *"
                  placeholder="+383 4X XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />

                <Input
                  label="Adresa e dorëzimit *"
                  placeholder="Rr. Nënë Tereza, Nr. 12, Prishtinë"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: C.muted,
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Shënime
                  </label>

                  <textarea
                    placeholder="p.sh. Dorëzoje pas orës 16:00..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "88px",
                      padding: "12px 14px",
                      border: `1.5px solid ${C.border}`,
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontFamily: FONT,
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: C.muted,
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Metoda e Pagesës
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    style={{
                      padding: "14px 16px",
                      border: `2px solid ${paymentMethod === "card" ? C.teal : C.border}`,
                      borderRadius: "10px",
                      background: paymentMethod === "card" ? C.tealLight : C.white,
                    }}
                  >
                    💳 Kartë Bankare
                  </button>

                  <button
                    onClick={() => setPaymentMethod("cash")}
                    style={{
                      padding: "14px 16px",
                      border: `2px solid ${paymentMethod === "cash" ? C.teal : C.border}`,
                      borderRadius: "10px",
                      background: paymentMethod === "cash" ? C.tealLight : C.white,
                    }}
                  >
                    💵 Cash
                  </button>
                </div>

                {submitError && (
                  <div
                    style={{
                      marginTop: "16px",
                      background: C.redBg,
                      border: `1px solid ${C.red}33`,
                      borderRadius: "8px",
                      padding: "12px 14px",
                      fontSize: "13px",
                      color: C.red,
                    }}
                  >
                    ⚠️ {submitError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ position: "sticky", top: "24px" }}>
            <div
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "18px",
                  fontWeight: "700",
                  margin: "0 0 20px",
                }}
              >
                Përmbledhja e Porosisë
              </h2>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span>
                    {item.quantity} × {item.title || "Produkt"}
                  </span>
                  <strong>
                    €{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                  </strong>
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span>Nëntotali</span>
                  <strong>€{subtotal.toFixed(2)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span>Transporti</span>
                  <strong>{shipping === 0 ? "Falas" : `€${shipping.toFixed(2)}`}</strong>
                </div>

                {promoApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span>Zbritja</span>
                    <strong style={{ color: C.success }}>−€{discount.toFixed(2)}</strong>
                  </div>
                )}

                <div
                  style={{
                    borderTop: `1.5px solid ${C.dark}`,
                    paddingTop: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px",
                  }}
                >
                  <span>Totali</span>
                  <strong>€{total.toFixed(2)}</strong>
                </div>
              </div>

              {step === 1 ? (
                <button
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "14px",
                    background: C.teal,
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Vazhdo me Dorëzimin →
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "14px",
                    background: submitting ? C.muted : C.dark,
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Duke dërguar…" : "Konfirmo Porosinë →"}
                </button>
              )}

              <Link
                to="/"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: "13px",
                  color: C.mutedLight,
                  textDecoration: "none",
                  marginTop: "12px",
                }}
              >
                ← Vazhdo Blerjet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;