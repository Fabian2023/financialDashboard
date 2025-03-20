
import { NavLink } from "react-router-dom";
import { BarChart3, Receipt, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container max-w-[1600px] h-16 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-finance-blue" />
          <h1 className="text-xl font-montserrat font-semibold text-finance-blue hidden sm:block">
            Dashboard Financiero
          </h1>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-4">
          <NavItem to="/" icon={<BarChart3 className="h-4 w-4 sm:mr-2" />} label="Dashboard" />
          <NavItem to="/transactions" icon={<Receipt className="h-4 w-4 sm:mr-2" />} label="Transacciones" />
          <NavItem to="/savings-calculator" icon={<Calculator className="h-4 w-4 sm:mr-2" />} label="Calculadora" />
        </div>
      </div>
    </nav>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
      "hover:bg-slate-100",
      isActive 
        ? "text-finance-blue bg-slate-100" 
        : "text-slate-600"
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </NavLink>
);

export default Navbar;
