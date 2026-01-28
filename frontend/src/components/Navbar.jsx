import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 IMPORTANT: dashboard par navbar hi nahi dikhana
  if (location.pathname === "/dashboard") {
    return null;
  }
   if (location.pathname === "/todos") {
    return null;
  }
   if (location.pathname === "/notes") {
    return null;
  }
   if (location.pathname === "/summary") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-slate-800 cursor-pointer"
        >
          StudySync
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/summary")}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            AI Summary
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
