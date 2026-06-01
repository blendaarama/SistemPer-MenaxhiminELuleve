import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const FLOWERS_API = "http://localhost:8080/api/flowers";

const UserBouquetCrud = () => {
  const { addToCart } = useCart();

  const [flowers, setFlowers] = useState([]);

  const [form, setForm] = useState({
    emertimi: "",
    pershkrimi: "",
    madhesia: "Medium",
    eshteAktiv: true,
    flowers: []
  });

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await axios.get(FLOWERS_API);
        setFlowers(res.data);
      } catch (err) {
        console.log("Error loading flowers", err);
      }
    };

    fetchFlowers();
  }, []);

  const addFlower = (flowerId) => {
    setForm((prev) => {
      const exists = prev.flowers.find((f) => f.flowerId === flowerId);

      if (exists) {
        return {
          ...prev,
          flowers: prev.flowers.map((f) =>
            f.flowerId === flowerId
              ? { ...f, sasia: f.sasia + 1 }
              : f
          )
        };
      }

      return {
        ...prev,
        flowers: [...prev.flowers, { flowerId, sasia: 1 }]
      };
    });
  };

  const removeFlower = (flowerId) => {
    setForm((prev) => {
      const updated = prev.flowers
        .map((f) =>
          f.flowerId === flowerId
            ? { ...f, sasia: f.sasia - 1 }
            : f
        )
        .filter((f) => f.sasia > 0);

      return {
        ...prev,
        flowers: updated
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let totalPrice = 0;

    form.flowers.forEach((f) => {
      const flower = flowers.find((fl) => fl.id === f.flowerId);

      if (flower) {
        totalPrice += flower.cmimi * f.sasia;
      }
    });

    const customBouquet = {
      id: "custom-" + Date.now(),
      name: form.emertimi,
      description: form.pershkrimi,
      image: null,
      price: totalPrice,
      type: "custom_bouquet",
      flowers: form.flowers
    };

    addToCart(customBouquet);

    alert("🌸 Bouquet added to cart!");

    setForm({
      emertimi: "",
      pershkrimi: "",
      madhesia: "Medium",
      eshteAktiv: true,
      flowers: []
    });
  };

  return (
    <div className="container py-5">

      <h2 className="text-center mb-4"  style={{color: "#000",fontStyle: "italic"}}>
        Create your own Bouquet
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">

        <input
          className="form-control mb-2"
          placeholder="Emertimi"
          value={form.emertimi}
          onChange={(e) =>
            setForm({ ...form, emertimi: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Pershkrimi"
          value={form.pershkrimi}
          onChange={(e) =>
            setForm({ ...form, pershkrimi: e.target.value })
          }
        />

        <select
          className="form-select mb-3"
          value={form.madhesia}
          onChange={(e) =>
            setForm({ ...form, madhesia: e.target.value })
          }
        >
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>

        <button className="btn btn-danger w-100"  style={{backgroundColor: "#4c1d95",border: "none"}}>
          Add to Cart
        </button>
      </form>

      {/* FLOWERS */}
      <h4 className="mb-3">🌼 Select Flowers</h4>

      <div className="row g-3 mb-4">

        {flowers.map((flower) => (
          <div key={flower.id} className="col-md-4">

            <div className="card p-3 shadow-sm h-100">

              <h5>{flower.emertimi}</h5>
              <p>Price: {flower.cmimi}</p>

              <div className="d-flex gap-2">

                 <button 
                  className="btn btn-outline-success btn-sm"
                  onClick={() => addFlower(flower.id)}
                  type="button"
                >
                  Add
                </button>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFlower(flower.id)}
                  type="button"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* SELECTED */}
      <div className="card p-3 shadow-sm bg-light">

        <h4>Your Bouquet</h4>

        {form.flowers.length === 0 && (
          <p className="text-muted">No flowers selected</p>
        )}

        {form.flowers.map((f) => {
          const flower = flowers.find((fl) => fl.id === f.flowerId);

          return (
            <div key={f.flowerId}>
              {flower?.emertimi} x {f.sasia}
            </div>
          );
        })}

        {/* TOTAL PREVIEW */}
        <hr />
        <strong>
          Total will be calculated on add to cart
        </strong>

      </div>

    </div>
  );
};

export default UserBouquetCrud;