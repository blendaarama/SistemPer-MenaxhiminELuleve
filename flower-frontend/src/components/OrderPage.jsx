import { useEffect, useState } from "react";
import axios from "axios";

function OrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/porosi");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/porosi/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Orders</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Klienti</th>
            <th>Data</th>
            <th>Adresa</th>
            <th>Shuma</th>
            <th>Statusi</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.klienti?.emri}</td>
              <td>{o.dataPorosise ? new Date(o.dataPorosise).toLocaleDateString() : ""}</td>
              <td>{o.adresaDorezimit}</td>
              <td>{o.shumeTotale} €</td>
              <td>{o.statusi}</td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(o.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderPage;