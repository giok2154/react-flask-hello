import { useState } from "react";

export const Home = () => {
  const [amount, setAmount] = useState(200);
  const [from, setFrom] = useState("ES");
  const [to, setTo] = useState("CO");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/compare?from=${from}&to=${to}&amount=${amount}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      alert("No se pudo obtener la comparación.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (providerId) => {
    try {
      const res = await fetch(`${backendUrl}/api/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_id: providerId, from, to, amount }),
      });
      const data = await res.json();
      if (data.redirect_url) window.location.href = data.redirect_url;
    } catch {
      alert("Error al redirigir al proveedor.");
    }
  };

  const COUNTRIES_FROM = [
    { code: "ES", name: "España", flag: "🇪🇸" },
    { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "CA", name: "Canadá", flag: "🇨🇦" },
  ];

  const COUNTRIES_TO = [
    { code: "CO", name: "Colombia", flag: "🇨🇴" },
    { code: "PE", name: "Perú", flag: "🇵🇪" },
    { code: "MX", name: "México", flag: "🇲🇽" },
  ];

  const PROVIDER_LOGOS = {
    remitly: "/providers/remitly.svg",
    wise: "/providers/wise.svg",
    ria: "/providers/ria.svg",
    worldremit: "/providers/worldremit.svg",
    xoom: "/providers/xoom.svg",
  };



  return (
    <div className="min-h-screen bg-slate-50">
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-6 sm:px-6 md:px-8 py-12">

        {/* HERO */}
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            Compara envíos de dinero y quédate con el mejor cambio
          </h1>

          <p className="text-gray-600 mb-6 max-w-2xl">
            Tu trabajo cuesta esfuerzo. No lo pierdas en comisiones ni malos cambios.
          </p>

          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-blue-600"></i>
              Proveedores regulados
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-scale-balanced text-blue-600"></i>
              Comparación imparcial
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-eye text-blue-600"></i>
              Sin cargos ocultos
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-lock text-blue-600"></i>
              Redirección segura
            </li>
          </ul>
        </section>

        {/* FORMULARIO */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 mb-12">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Comprueba cuánto llegará realmente
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Pequeñas diferencias entre proveedores pueden significar menos dinero recibido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                <i className="fa-solid fa-briefcase text-slate-400"></i>
                Origen
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {COUNTRIES_FROM.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                <i className="fa-solid fa-house text-slate-400"></i>
                Destino
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {COUNTRIES_TO.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                <i className="fa-solid fa-coins text-slate-400"></i>
                Importe (€)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleCompare}
              disabled={loading}
              className="h-[42px] bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Buscando opciones…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-chart-line"></i>
                  Ver quién paga mejor
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            No gestionamos tu dinero. Te redirigimos de forma segura al proveedor seleccionado.
          </p>
        </section>

        {/* RESULTADOS */}
        {results.length > 0 && (
          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 mb-4">
              <i className="fa-solid fa-hand-holding-dollar text-slate-500"></i>
              Proveedores disponibles
            </h2>

            <div className="space-y-4">
              {results.map((r, index) => (
                <div
                  key={r.id}
                  className={`relative bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${index === 0
                      ? "border-blue-600 ring-1 ring-blue-600"
                      : "border-slate-200"
                    }`}
                >
                  {/* MEJOR OPCIÓN */}
                  {index === 0 && (
                    <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Mejor opción
                    </span>
                  )}

                  {/* IZQUIERDA: LOGO + INFO */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-8 flex items-center">
                      <img
                        src={PROVIDER_LOGOS[r.id]}
                        alt={r.name}
                        className="max-h-8 object-contain"
                      />
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">Proveedor</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {r.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        Tiempo: {r.time} · Comisión {r.fee}
                      </div>
                    </div>
                  </div>

                  {/* CENTRO: DINERO */}
                  <div className="md:text-center">
                    <div className="text-sm text-slate-500">Recibes aprox.</div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {r.receive} €
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleSend(r.id)}
                    className="self-start md:self-center text-blue-600 font-medium hover:underline"
                  >
                    Enviar con {r.name} →
                  </button>
                </div>

              ))}
            </div>
          </section>
        )}

        {/* BLOQUE DE CONFIANZA */}
        <section className="border-t border-slate-200 pt-6 text-sm text-slate-600">
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i>
              Proveedores regulados
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-scale-balanced"></i>
              Comparación imparcial
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-lock"></i>
              Redirección segura
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-eye"></i>
              Sin cargos ocultos
            </li>
          </ul>
        </section>

      </div>
    </div>
  );

};
