import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { Plus, ShoppingCart, Truck, FileText, CheckCircle2, Factory, ExternalLink } from "lucide-react";

export default function ProcurementPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "orders";
  });
  const t = useThemeClasses();

  const [rfqs] = useState([
    { id: 'RFQ-2024-001', item: '540W Mono PERC Panels (50kW)', deadline: '2024-07-15', status: 'Open' },
    { id: 'RFQ-2024-002', item: 'String Inverters (50kW)', deadline: '2024-07-10', status: 'Evaluating' },
    { id: 'RFQ-2024-003', item: 'Mounting Structures (100kW)', deadline: '2024-06-25', status: 'Closed' }
  ]);

  const [grns] = useState([
    { id: 'GRN-2024-081', poRef: 'PO-2024-001', supplier: 'Adani Solar', date: '2024-06-28', receivedBy: 'Warehouse Manager', status: 'Verified', items: '100x 540W Mono PERC Panels' },
    { id: 'GRN-2024-082', poRef: 'PO-2024-002', supplier: 'Waaree Energies', date: '2024-07-01', receivedBy: 'Site Engineer', status: 'Pending QA', items: '5x String Inverters (50kW)' }
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    fetchProcurementData();
  }, []);

  const fetchProcurementData = async () => {
    try {
      const [oRes, sRes] = await Promise.all([
        fetch('/api/procurement/orders'),
        fetch('/api/procurement/suppliers')
      ]);
      if (oRes.ok) setOrders(await oRes.json());
      if (sRes.ok) setSuppliers(await sRes.json());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getSupplierName = (id) => suppliers.find(s => s.id === id)?.name || "Unknown Supplier";

  return (
    <div className={`min-h-screen p-8 ${t.isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Procurement & GRN</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage Suppliers, Purchase Orders, and Goods Receipts</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold transition">
            <Factory size={18} /> New Supplier
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95">
            <Plus size={18} /> Create PO
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab("orders")} className={`px-6 py-2 whitespace-nowrap rounded-full font-bold text-sm transition ${activeTab === 'orders' ? 'bg-emerald-500 text-white shadow-md' : t.isDark ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 border shadow-sm'}`}>Purchase Orders</button>
        <button onClick={() => setActiveTab("grn")} className={`px-6 py-2 whitespace-nowrap rounded-full font-bold text-sm transition ${activeTab === 'grn' ? 'bg-emerald-500 text-white shadow-md' : t.isDark ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 border shadow-sm'}`}>Goods Receipts (GRN)</button>
        <button onClick={() => setActiveTab("rfq")} className={`px-6 py-2 whitespace-nowrap rounded-full font-bold text-sm transition ${activeTab === 'rfq' ? 'bg-emerald-500 text-white shadow-md' : t.isDark ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 border shadow-sm'}`}>Request For Quotations (RFQ)</button>
        <button onClick={() => setActiveTab("suppliers")} className={`px-6 py-2 whitespace-nowrap rounded-full font-bold text-sm transition ${activeTab === 'suppliers' ? 'bg-emerald-500 text-white shadow-md' : t.isDark ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 border shadow-sm'}`}>Suppliers Directory</button>
      </div>

      <div className={`rounded-3xl overflow-hidden ${t.isDark ? "bg-slate-900 border border-white/5" : "bg-white border border-slate-200 shadow-xl"}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={t.isDark ? "bg-slate-800/50" : "bg-slate-50"}>
              {activeTab === 'orders' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">PO Number</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Supplier</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-right">Amount</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Action</th>
                </>
              ) : activeTab === 'rfq' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">RFQ Ref</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Item Requested</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Deadline</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Action</th>
                </>
              ) : activeTab === 'grn' ? (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">GRN No.</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">PO Reference</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Supplier</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Received On</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Action</th>
                </>
              ) : (
                <>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Supplier Name</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider">GST No.</th>
                  <th className="p-4 font-bold text-sm text-slate-500 uppercase tracking-wider text-center">Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-bold">Loading data...</td></tr>
            ) : activeTab === 'orders' && orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-16 text-center text-slate-500">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">No Purchase Orders found.</p>
                </td>
              </tr>
            ) : activeTab === 'rfq' && rfqs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-16 text-center text-slate-500">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">No Active RFQs.</p>
                  <button className="mt-4 px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-lg font-bold text-sm hover:bg-indigo-500/20">Generate RFQ</button>
                </td>
              </tr>
            ) : activeTab === 'rfq' ? (
              rfqs.map(rfq => (
                <tr key={rfq.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition`}>
                  <td className="p-4 font-black text-indigo-500">{rfq.id}</td>
                  <td className="p-4 font-bold">{rfq.item}</td>
                  <td className="p-4 font-bold text-slate-500">{rfq.deadline}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      rfq.status === 'Open' ? 'bg-emerald-500/20 text-emerald-500' :
                      rfq.status === 'Closed' ? 'bg-slate-500/20 text-slate-500' :
                      'bg-amber-500/20 text-amber-500'
                    }`}>{rfq.status}</span>
                  </td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button className="px-3 py-1.5 bg-indigo-500 text-white rounded font-bold text-xs shadow-sm hover:bg-indigo-600 transition">
                      View Bids
                    </button>
                  </td>
                </tr>
              ))
            ) : activeTab === 'grn' ? (
              grns.map(grn => (
                <tr key={grn.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition`}>
                  <td className="p-4 font-black text-emerald-500">{grn.id}</td>
                  <td className="p-4 font-bold text-slate-500">{grn.poRef}</td>
                  <td className="p-4 font-bold">{grn.supplier}</td>
                  <td className="p-4 font-bold text-slate-500">{grn.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      grn.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-500' :
                      'bg-amber-500/20 text-amber-500'
                    }`}>{grn.status}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-bold text-xs transition">
                      View Document
                    </button>
                  </td>
                </tr>
              ))
            ) : activeTab === 'suppliers' && suppliers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-16 text-center text-slate-500">
                  <Factory size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">No Suppliers registered yet.</p>
                </td>
              </tr>
            ) : activeTab === 'orders' ? (
              orders.map(order => (
                <tr key={order.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition`}>
                  <td className="p-4 font-black">{order.poNumber}</td>
                  <td className="p-4 font-medium text-slate-400">{getSupplierName(order.supplierId)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                      order.status === 'Received' ? 'bg-emerald-500/20 text-emerald-500' :
                      order.status === 'Draft' ? 'bg-slate-500/20 text-slate-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>{order.status}</span>
                  </td>
                  <td className="p-4 font-black text-right">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="p-4 flex justify-center gap-2">
                    {order.status !== 'Received' && (
                      <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded font-bold text-xs flex items-center gap-1 transition">
                        <Truck size={14} /> Process GRN
                      </button>
                    )}
                    <button className={`p-1.5 rounded ${t.isDark ? "hover:bg-white/10" : "hover:bg-slate-200"} text-slate-400`} title="View PDF">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              suppliers.map(sup => (
                <tr key={sup.id} className={`border-t ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition`}>
                  <td className="p-4">
                    <p className="font-black">{sup.name}</p>
                    <p className="text-xs font-bold text-slate-400">{sup.address}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-sm">{sup.contactPerson}</p>
                    <p className="text-xs text-slate-500">{sup.phone}</p>
                  </td>
                  <td className="p-4 font-medium text-slate-400 tracking-widest text-sm">{sup.gstNumber || 'N/A'}</td>
                  <td className="p-4 text-center">
                    <button className="text-blue-500 hover:underline text-xs font-bold">Edit Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
