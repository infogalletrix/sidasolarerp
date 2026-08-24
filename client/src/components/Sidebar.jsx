import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, ShoppingCart, FolderKanban, 
  PackageSearch, Truck, Wrench, Landmark, BarChart3, Settings,
  ChevronLeft, ChevronDown, ChevronRight, Moon, Sun, FileBadge, Handshake
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useThemeClasses } from "../hooks/useThemeClasses";
import logoImage from "../assets/logo.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const t = useThemeClasses();

  // Track which menus are expanded
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "s") toggleSidebar();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const toggleSubmenu = (menuName) => {
    if (!isOpen) toggleSidebar(); // auto open sidebar if closed
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuTree = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { 
      name: "CRM", icon: <Users size={20} />, 
      subItems: [
        { name: "Leads", path: "/crm?tab=leads" },
        { name: "Customers", path: "/crm?tab=contacts" },
        { name: "Sales Pipeline", path: "/crm?tab=deals" },
        { name: "Follow-ups", path: "/crm?tab=activities" },
        { name: "Document Vault", path: "/crm?tab=documents" },
        { name: "Telecalling", path: "/crm?tab=telecalling" },
        { name: "Marketing Campaigns", path: "/crm?tab=campaigns" },
        { name: "Site Surveys", path: "/crm?tab=site-surveys" }
      ]
    },
    { 
      name: "Solar Sales", icon: <ShoppingCart size={20} />, 
      subItems: [
        { name: "Proposals", path: "/quotations" },
        { name: "Quotations", path: "/invoices?tab=quotations" },
        { name: "Agreements", path: "/agreements" },
        { name: "Work Orders", path: "/work-orders" },
        { name: "Project Costing", path: "/project-costing" }
      ]
    },
    { 
      name: "Projects", icon: <FolderKanban size={20} />, 
      subItems: [
        { name: "Projects", path: "/projects" },
        { name: "Work Orders", path: "/work-orders" },
        { name: "Waiting Floor", path: "/projects?tab=waiting-floor" },
        { name: "Installation", path: "/installation" },
        { name: "Teams", path: "/teams" },
        { name: "Material Dispatch", path: "/material-dispatch" }
      ]
    },
    { 
      name: "Procurement", icon: <Truck size={20} />, 
      subItems: [
        { name: "Suppliers", path: "/procurement?tab=suppliers" },
        { name: "RFQ", path: "/procurement?tab=rfq" },
        { name: "Purchase Orders", path: "/procurement?tab=orders" },
        { name: "GRN", path: "/procurement?tab=grn" }
      ]
    },
    { 
      name: "Inventory", icon: <PackageSearch size={20} />, 
      subItems: [
        { name: "Products", path: "/inventory?tab=products" },
        { name: "Stock", path: "/inventory?tab=stock" },
        { name: "Warehouses", path: "/inventory?tab=warehouses" },
        { name: "Serial Numbers", path: "/inventory?tab=serial" },
        { name: "Stock Movement", path: "/inventory?tab=movement" }
      ]
    },
    { 
      name: "Finance", icon: <Landmark size={20} />, 
      subItems: [
        { name: "Billing", path: "/billing" },
        { name: "Invoices", path: "/invoices" },
        { name: "Payments", path: "/receipts" },
        { name: "Expenses", path: "/expenses" },
        { name: "Receivables", path: "/accounts?tab=receivables" },
        { name: "Payables", path: "/accounts?tab=payables" },
        { name: "Profitability", path: "/accounts?tab=profitability" }
      ]
    },
    { 
      name: "Government Compliance", icon: <FileBadge size={20} />, 
      subItems: [
        { name: "PM Surya Ghar", path: "/compliance?tab=surya-ghar" },
        { name: "Subsidy", path: "/compliance?tab=subsidy" },
        { name: "Net Metering", path: "/compliance?tab=net-metering" }
      ]
    },
    { 
      name: "Service", icon: <Wrench size={20} />, 
      subItems: [
        { name: "Service Tickets", path: "/service-tickets?tab=tickets" },
        { name: "AMC", path: "/service-tickets?tab=amc" },
        { name: "Warranty", path: "/service-tickets?tab=warranty" }
      ]
    },
    { 
      name: "HR", icon: <Users size={20} />, 
      subItems: [
        { name: "Employees", path: "/employees" },
        { name: "Attendance", path: "/attendance?tab=daily" },
        { name: "Leave", path: "/attendance?tab=leave" },
        { name: "Payroll", path: "/salary?tab=payroll" },
        { name: "Commissions", path: "/salary?tab=commissions" }
      ]
    },
    { 
      name: "Partners", icon: <Handshake size={20} />, 
      subItems: [
        { name: "Vendors", path: "/partners?tab=vendors" },
        { name: "Finance Partners", path: "/partners?tab=finance" },
        { name: "Dealers", path: "/partners?tab=dealers" },
        { name: "Franchises", path: "/partners?tab=franchises" },
        { name: "Branches", path: "/partners?tab=branches" }
      ]
    },
    { 
      name: "Reports", icon: <BarChart3 size={20} />, 
      subItems: [
        { name: "MIS Reports", path: "/reports?tab=mis" },
        { name: "Analytics", path: "/analytics?tab=sales" }
      ]
    },
    { 
      name: "Settings", icon: <Settings size={20} />, 
      subItems: [
        { name: "Users", path: "/settings?tab=users" },
        { name: "Roles", path: "/settings?tab=roles" },
        { name: "Permissions", path: "/settings?tab=permissions" },
        { name: "Notifications", path: "/settings?tab=notifications" },
        { name: "Email", path: "/settings?tab=email" },
        { name: "API Integrations", path: "/settings?tab=api" },
        { name: "Audit Logs", path: "/settings?tab=audit" }
      ]
    }
  ];

  const renderMenuItem = (item) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus[item.name];
    
    // Check if current route is active in this menu or its children
    const currentPathWithSearch = location.pathname + location.search;
    const isExactMatch = currentPathWithSearch === item.path || (location.pathname === item.path && !item.path.includes("?"));
    const isChildMatch = hasSubItems && item.subItems.some(sub => currentPathWithSearch === sub.path || (location.pathname === sub.path && !sub.path.includes("?")));
    const isActive = isExactMatch || (isChildMatch && !isExpanded); // highlight parent if child is active and menu is collapsed

    return (
      <li key={item.name} className="relative group/nav-item select-none">
        {hasSubItems ? (
          <div 
            onClick={() => toggleSubmenu(item.name)}
            className={`flex items-center justify-between cursor-pointer ${isOpen ? "px-3" : "justify-center px-2"} py-2.5 rounded-xl transition-all duration-200 ${
              isChildMatch && t.isDark ? "bg-white/5" : ""
            } ${
              isActive
                ? t.isDark
                  ? "bg-orange-600/80 text-white shadow-lg shadow-orange-900/40"
                  : "bg-white/10 text-[#D4AF37] shadow-lg shadow-black/20"
                : t.isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="whitespace-nowrap text-[14px] font-medium">{item.name}</span>}
            </div>
            {isOpen && (
              <span className="opacity-50">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
          </div>
        ) : (
          <Link
            to={item.path}
            title={!isOpen ? item.name : ""}
            className={`flex items-center ${isOpen ? "justify-start gap-3 px-3" : "justify-center px-2"} py-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? t.isDark
                  ? "bg-orange-600/80 text-white shadow-lg shadow-orange-900/40"
                  : "bg-white/10 text-[#D4AF37] shadow-lg shadow-black/20"
                : t.isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isOpen && <span className="whitespace-nowrap text-[14px] font-medium">{item.name}</span>}
          </Link>
        )}

        {/* Submenu rendering */}
        {hasSubItems && isOpen && isExpanded && (
          <ul className="mt-1 ml-9 pl-3 space-y-1 relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-700/50">
            {item.subItems.map(sub => {
              const isSubActive = currentPathWithSearch === sub.path || (location.pathname === sub.path && !sub.path.includes("?"));
              return (
                <li key={sub.name}>
                  <Link
                    to={sub.path}
                    className={`block py-1.5 px-3 rounded-lg text-[13px] font-medium transition-colors ${
                      isSubActive 
                        ? (t.isDark ? "text-orange-400 bg-white/5" : "text-[#D4AF37] bg-white/10")
                        : (t.isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-white")
                    }`}
                  >
                    {sub.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav
      className={`${isOpen ? "w-[260px]" : "w-20"} ${ t.isDark
        ? "bg-slate-900/80 backdrop-blur-xl border-r border-white/10 text-slate-200"
        : "bg-[#111827] border-r border-slate-800 text-slate-100"
      } flex flex-col h-screen transition-all duration-300 relative shadow-2xl flex-shrink-0 z-20`}
    >
      {/* Header */}
      <div
        onClick={toggleSidebar}
        className={`py-5 px-4 flex items-center cursor-pointer group transition ${ t.isDark ? "hover:bg-white/5 border-b border-white/10" : "hover:bg-slate-800 border-b border-slate-800"}`}
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <div className={`flex items-center gap-3 ${!isOpen ? "justify-center w-full" : ""}`}>
          <div className={`flex-shrink-0 ${ t.isDark ? "text-orange-400" : "text-[#D4AF37]"}`}>
            {isOpen ? <ChevronLeft size={22} /> : <img src={logoImage} alt="Logo" className="w-12 h-auto max-h-8 object-contain bg-white p-1 rounded-md" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />}
          </div>
          {isOpen && (
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="Sida Solar" className="w-28 h-auto max-h-10 object-contain bg-white p-1.5 rounded-lg shadow-sm" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ul className="space-y-1.5 flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
        {menuTree.map(renderMenuItem)}
      </ul>

      {/* Footer */}
      <div className={`p-4 flex flex-col items-center gap-2 border-t ${ t.isDark ? "border-white/10" : "border-slate-800"}`}>
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${ t.isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-300 hover:text-white hover:bg-white/10"} ${isOpen ? "w-full gap-3" : "w-10 h-10"}`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isOpen && <span className="font-semibold text-sm">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
