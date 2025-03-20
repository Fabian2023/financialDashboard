
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    document.title = "Página no encontrada | Dashboard Financiero";
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl md:text-7xl font-bold text-finance-blue mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! Página no encontrada</p>
      <p className="text-gray-500 max-w-md mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/">
        <Button className="bg-finance-blue hover:bg-finance-blue/90">
          <Home className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
