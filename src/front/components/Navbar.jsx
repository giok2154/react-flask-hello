export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
        
        {/* Icono */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          €
        </div>

        {/* Nombre */}
        <span className="text-base font-semibold text-gray-900 tracking-tight">
          Cambio Justo Hoy
        </span>

      </div>
    </nav>
  );
};
