import { useState } from "react";

export const Home = () => {
  const [amount, setAmount] = useState(200);
  const [from, setFrom] = useState("ES");
  const [to, setTo] = useState("CO");
  const [results, setResults] = useState([]);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  const handleCompare = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/compare?from=${from}&to=${to}&amount=${amount}`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      alert("Error al comparar envíos");
    }
  };

  const handleSend = async (providerId) => {
    try {
      const response = await fetch(`${backendUrl}/api/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: providerId,
          from,
          to,
          amount
        })
      });

      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        alert("No se pudo redirigir");
      }
    } catch (error) {
      alert("Error al redirigir");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Comparador de envíos</h1>

      <div style={{ marginBottom: "15px" }}>
        <label>Origen</label><br />
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="ES">España</option>
          <option value="US">Estados Unidos</option>
          <option value="CA">Canadá</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Destino</label><br />
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="CO">Colombia</option>
          <option value="PE">Perú</option>
          <option value="MX">México</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Monto (€)</label><br />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button onClick={handleCompare}>
        Comparar
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Resultados</h2>

          {results.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong>{r.name}</strong><br />
                Recibe: {r.receive} €<br />
                Tiempo: {r.time}<br />
                Comisión: {r.fee}
              </div>

              <button onClick={() => handleSend(r.id)}>
                Ir a enviar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
