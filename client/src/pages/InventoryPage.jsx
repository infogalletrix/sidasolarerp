import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Plus, Package, ArrowUpRight, ArrowDownRight, AlertTriangle, Barcode, FileCheck, Layers, Boxes, QrCode, Warehouse, Activity } from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "products";
  });
  const t = useThemeClasses();

  const [stockItems] = useState([
    { id: 'STK1', code: 'PNL-540', description: '540W Mono PERC Panel', warehouse: 'Main Warehouse - WH1', qty: 150 },
    { id: 'STK2', code: 'INV-50K', description: '50kW String Inverter', warehouse: 'Main Warehouse - WH1', qty: 12 },
    { id: 'STK3', code: 'CBL-4MM', description: '4sqmm DC Cable (Roll)', warehouse: 'Secondary Hub - WH2', qty: 45 }
  ]);

  const [warehouses] = useState([
    { id: 'WH1', name: 'Main Warehouse', location: 'Industrial Area, Bangalore', capacity: '10,000 sqft', status: 'Active' },
    { id: 'WH2', name: 'Secondary Hub', location: 'Electronic City, Bangalore', capacity: '5,000 sqft', status: 'Active' },
    { id: 'WH3', name: 'Service Depot', location: 'Whitefield', capacity: '2,000 sqft', status: 'Maintenance' }
  ]);

  const [movements] = useState([
    { id: 'MV-1001', date: '2024-07-15', product: '540W Mono PERC Panel', type: 'IN (GRN-081)', qty: 100, ref: 'PO-2024-001' },
    { id: 'MV-1002', date: '2024-07-16', product: '50kW String Inverter', type: 'OUT (Dispatch)', qty: -2, ref: 'MDN-5012' },
    { id: 'MV-1003', date: '2024-07-18', product: '4sqmm DC Cable', type: 'TRANSFER', qty: 10, ref: 'WH1 -> WH2' }
  ]);

  const [serials] = useState([
    { id: 'SN-9981234', product: '50kW String Inverter', status: 'In Stock', location: 'WH1', expiry: '2034-07-15' },
    { id: 'SN-9981235', product: '50kW String Inverter', status: 'Dispatched', location: 'Site-A', expiry: '2034-07-16' },
    { id: 'SN-8821100', product: '540W Mono PERC Panel', status: 'In Stock', location: 'WH1', expiry: '2049-07-15' }
  ]);

  const [reservations] = useState([
    { id: 'RES-001', project: 'Sharma Residence 5kW', material: '540W Mono PERC Panel', qty: 10, expected: '2024-07-25' },
    { id: 'RES-002', project: 'GreenTech Factory 50kW', material: '50kW String Inverter', qty: 2, expected: '2024-07-28' },
    { id: 'RES-003', project: 'Orchid School 20kW', material: 'Solar Mounting Structure', qty: 40, expected: '2024-07-22' }
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleViewEquipment = async (product) => {
    setSelectedProduct(product);
    try {
      const res = await fetch(`/api/inventory/equipment?productId=${product.id}`);
      if (res.ok) {
        const data = await res.json();
        setEquipmentItems(data);
      }
    } catch (err) {
      console.error(err);
    }
    setIsEquipmentModalOpen(true);
  };

  return (
    <div className={`min-h-screen p-8 ${t.isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Inventory Management</h1>
          <p className="text-slate-400 mt-2 font-medium">Track solar panels, inverters, and components</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105 active:scale-95">
          <Plus size={20} />
          {activeTab === 'products' ? 'Add Product' : 
           activeTab === 'stock' ? 'Adjust Stock' : 
           activeTab === 'warehouses' ? 'Add Warehouse' : 
           activeTab === 'serial' ? 'Register Serial' : 
           activeTab === 'reservation' ? 'Reserve Material' : 
           'New Record'}
        </button>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {["products", "stock", "warehouses", "serial", "movement", "reservation"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)} 
            className={`px-6 py-2 whitespace-nowrap rounded-full font-bold text-sm transition ${activeTab === tab ? 'bg-orange-500 text-white shadow-md' : t.isDark ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 border shadow-sm capitalize'}`}
          >
            {tab === "movement" ? "Stock Movement" : tab === "serial" ? "Serial Numbers" : tab === "reservation" ? "Project Reservations" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Products", value: products.length, icon: <Package size={24} className="text-blue-500" /> },
          { title: "Low Stock Items", value: products.filter(p => p.stockQuantity <= (p.minimumStockAlert || 5)).length, icon: <AlertTriangle size={24} className="text-orange-500" /> },
          { title: "Total Value", value: `$${products.reduce((acc, p) => acc + (p.stockQuantity * p.unitPrice), 0).toLocaleString()}`, icon: <ArrowUpRight size={24} className="text-green-500" /> }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl ${t.isDark ? "bg-slate-900/80 border border-white/10" : "bg-white shadow-xl shadow-slate-200/50"} flex items-center justify-between transition-transform hover:-translate-y-1`}>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-black mt-2">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${t.isDark ? "bg-white/5" : "bg-slate-50"}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl overflow-hidden ${t.isDark ? "bg-slate-900/80 border border-white/10" : "bg-white shadow-xl shadow-slate-200/50"}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {activeTab === 'products' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Product Info</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Stock Level</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </>
              ) : activeTab === 'movement' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-right">Reference</th>
                </>
              ) : activeTab === 'warehouses' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Warehouse Name</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Capacity</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </>
              ) : activeTab === 'stock' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Item Code</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Warehouse</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Available Qty</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </>
              ) : activeTab === 'serial' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Serial No.</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Status & Location</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Warranty Expiry</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </>
              ) : activeTab === 'reservation' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Project / Work Order</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Material</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Reserved Qty</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Expected Dispatch</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </>
              ) : (
                <th colSpan="5" className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Data for {activeTab}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading inventory...</td></tr>
            ) : activeTab === 'products' ? (
              products.map((product) => (
                <tr key={product.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                  <td className="p-4">
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.brand}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                      product.category === 'Panel' ? 'bg-blue-500/20 text-blue-500' :
                      product.category === 'Inverter' ? 'bg-purple-500/20 text-purple-500' :
                      'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-black ${product.stockQuantity <= (product.minimumStockAlert || 5) ? 'text-red-500' : ''}`}>
                        {product.stockQuantity}
                      </span>
                      {product.stockQuantity <= (product.minimumStockAlert || 5) && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">
                    ${product.unitPrice.toLocaleString()}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => handleViewEquipment(product)} className={`p-2 rounded-lg ${t.isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-slate-200 text-slate-600"} transition-colors text-xs font-bold flex items-center gap-1`} title="View Serial Numbers">
                      <Package size={16} /> Serials
                    </button>
                    <button className={`p-2 rounded-lg ${t.isDark ? "hover:bg-white/10" : "hover:bg-slate-200"} text-green-500 transition-colors`} title="Stock In">
                      <ArrowUpRight size={18} />
                    </button>
                    <button className={`p-2 rounded-lg ${t.isDark ? "hover:bg-white/10" : "hover:bg-slate-200"} text-orange-500 transition-colors`} title="Stock Out">
                      <ArrowDownRight size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : activeTab === "reservation" ? (
              reservations.map(res => (
                <tr key={res.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                  <td className="p-4 font-black text-indigo-500">{res.project}</td>
                  <td className="p-4 font-bold">{res.material}</td>
                  <td className="p-4 font-black">{res.qty} Units</td>
                  <td className="p-4 font-medium text-slate-500">{res.expected}</td>
                  <td className="p-4 text-center">
                    <button className="text-blue-500 hover:underline text-xs font-bold mr-3">Edit</button>
                    <button className="text-red-500 hover:underline text-xs font-bold">Release</button>
                  </td>
                </tr>
              ))
            ) : activeTab === "serial" ? (
              serials.map(serial => (
                <tr key={serial.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                  <td className="p-4 font-black">{serial.id}</td>
                  <td className="p-4 font-medium text-slate-500">{serial.product}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${serial.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'}`}>{serial.status}</span>
                    <span className="text-xs font-bold text-slate-400">@ {serial.location}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-500">{serial.expiry}</td>
                  <td className="p-4 text-center">
                    <button className="text-blue-500 hover:underline text-xs font-bold">Edit</button>
                  </td>
                </tr>
              ))
            ) : activeTab === 'movement' ? (
              movements.map(mov => (
                <tr key={mov.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                  <td className="p-4 font-medium text-slate-500">{mov.date}</td>
                  <td className="p-4 font-bold">{mov.product}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${mov.type.includes('IN') ? 'bg-emerald-500/20 text-emerald-500' : mov.type.includes('OUT') ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>{mov.type}</span>
                  </td>
                  <td className="p-4 font-black">{mov.qty > 0 ? `+${mov.qty}` : mov.qty}</td>
                  <td className="p-4 text-right font-medium text-slate-400">{mov.ref}</td>
                </tr>
              ))
            ) : activeTab === 'warehouses' ? (
              warehouses.map(wh => (
                <tr key={wh.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                  <td className="p-4 font-black">{wh.name} <span className="text-xs text-slate-500 ml-1">({wh.id})</span></td>
                  <td className="p-4 font-medium text-slate-500">{wh.location}</td>
                  <td className="p-4 font-medium">{wh.capacity}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${wh.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>{wh.status}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-blue-500 hover:underline text-xs font-bold">Edit</button>
                  </td>
                </tr>
              ))
            ) : activeTab === 'stock' ? (
              stockItems.map(item => (
                <tr key={item.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                  <td className="p-4 font-black text-slate-500">{item.code}</td>
                  <td className="p-4 font-bold">{item.description}</td>
                  <td className="p-4 font-medium text-slate-500">{item.warehouse}</td>
                  <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{item.qty} Units</td>
                  <td className="p-4 text-center">
                    <button className="text-blue-500 hover:underline text-xs font-bold">Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-16 text-center text-slate-500 font-bold">Module under construction.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Equipment Serial Numbers Modal */}
      {isEquipmentModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl ${t.isDark ? "bg-slate-900 border border-white/10" : "bg-white"}`}>
            <div className={`p-6 flex justify-between items-center border-b ${t.isDark ? "border-white/10" : "border-slate-100"}`}>
              <div>
                <h2 className="text-xl font-black">{selectedProduct.name} - Serial Tracking</h2>
                <p className="text-sm font-medium text-slate-400">Total in Stock: {selectedProduct.stockQuantity}</p>
              </div>
              <button onClick={() => setIsEquipmentModalOpen(false)} className="text-slate-400 hover:text-red-500">Close</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Plus size={16} /> Register New Serial Number
                </button>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={t.isDark ? "bg-slate-800/50" : "bg-slate-50"}>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Serial No.</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase">Warranty Exp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentItems.length === 0 ? (
                      <tr><td colSpan="3" className="p-4 text-center text-slate-500 text-sm">No specific serial numbers registered yet.</td></tr>
                    ) : (
                      equipmentItems.map(item => (
                        <tr key={item.id} className={`border-t ${t.isDark ? "border-white/5" : "border-slate-100"}`}>
                          <td className="p-3 font-bold text-sm">{item.serialNumber}</td>
                          <td className="p-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-slate-400">{item.warrantyExpiryDate || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
