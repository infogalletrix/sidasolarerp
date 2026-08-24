import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, PackageOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { useThemeClasses } from '../hooks/useThemeClasses';
import PrintableMDN from '../components/PrintableMDN';

export default function MaterialDispatchPage() {
  const t = useThemeClasses();
  const [searchTerm, setSearchTerm] = useState("");

  const [dispatches, setDispatches] = useState([
    { id: 'MDN-5011', project: 'Sharma Residence 5kW', to: 'Indiranagar, Bangalore', date: '2024-06-25', status: 'Delivered', items: '10x Panels, 1x Inverter, BOS' },
    { id: 'MDN-5012', project: 'Orchid School 20kW', to: 'Jayanagar, Bangalore', date: '2024-06-27', status: 'In Transit', items: '40x Panels' },
    { id: 'MDN-5013', project: 'GreenTech Factory 50kW', to: 'Peenya Industrial Area', date: '2024-06-30', status: 'Pending', items: '100x Panels, 2x Inverter' },
    { id: 'MDN-5014', project: 'Desai Villa 10kW', to: 'Whitefield, Bangalore', date: '2024-06-22', status: 'Delivered', items: 'BOS & Cables' }
  ]);
  const [selectedMDN, setSelectedMDN] = useState(null);

  const mdnRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => mdnRef.current,
  });

  return (
    <div className="space-y-6 page-wrapper p-4 md:p-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Material Dispatch</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Manage and track inventory shipments from warehouse to site.</p>
        </div>
        <button 
          onClick={() => alert("New Dispatch Note creation will be available in the next release.")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={16} /> New Dispatch Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Dispatch", val: dispatches.filter(d => d.status === 'Pending').length, color: "text-rose-500" },
          { label: "In Transit", val: dispatches.filter(d => d.status === 'In Transit').length, color: "text-amber-500" },
          { label: "Delivered (Week)", val: dispatches.filter(d => d.status === 'Delivered').length, color: "text-emerald-500" },
          { label: "Total Shipments", val: dispatches.length, color: "text-blue-500" },
        ].map((k, i) => (
          <div key={i} className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${k.color}`}>{k.label}</div>
            <div className={`text-3xl font-black ${t.heading}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)]`}>
        <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
          <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Truck size={18}/> Delivery Ledger</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input type="text" placeholder="Search dispatches..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-transparent text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
            </div>
            <button className={`p-2 rounded-xl border border-[var(--border-color)] ${t.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition`}><Filter size={16}/></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={t.tableHead}>
              <tr>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">MDN ID</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Project & Destination</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Date</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Items</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((disp, idx) => (
                <tr key={idx} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                  <td className={`p-4 font-black text-indigo-500`}>{disp.id}</td>
                  <td className={`p-4`}>
                    <div className={`font-bold ${t.heading}`}>{disp.project}</div>
                    <div className={`text-xs font-bold ${t.muted} flex items-center gap-1 mt-1`}><ArrowRight size={10}/> {disp.to}</div>
                  </td>
                  <td className={`p-4 font-bold ${t.muted}`}>{disp.date}</td>
                  <td className={`p-4 font-bold ${t.muted} flex items-center gap-2 mt-2 max-w-[200px] truncate`}><PackageOpen size={14}/> {disp.items}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max ${
                      disp.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                      disp.status === 'In Transit' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {disp.status === 'Delivered' && <CheckCircle2 size={10}/>}
                      {disp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedMDN(disp)}
                      className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest"
                    >
                      View MDN
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MDN Modal */}
      {selectedMDN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-lg rounded-[2rem] shadow-2xl border border-[var(--border-color)] ${t.card} overflow-hidden`}
          >
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)]">
              <div>
                <h2 className={`text-xl font-black ${t.heading}`}>Material Dispatch Note</h2>
                <p className={`text-xs font-bold ${t.muted} mt-1 uppercase tracking-widest`}>{selectedMDN.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                selectedMDN.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                selectedMDN.status === 'In Transit' ? 'bg-amber-500/10 text-amber-500' :
                'bg-rose-500/10 text-rose-500'
              }`}>
                {selectedMDN.status}
              </span>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-[var(--border-color)] pb-4">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Project</p>
                  <p className={`text-sm font-bold ${t.heading}`}>{selectedMDN.project}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Date</p>
                  <p className={`text-sm font-bold ${t.heading}`}>{selectedMDN.date}</p>
                </div>
              </div>
              
              <div className="border-b border-[var(--border-color)] pb-4">
                <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Destination</p>
                <p className={`text-sm font-bold ${t.heading}`}>{selectedMDN.to}</p>
              </div>
              
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-2`}>Items Shipped</p>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-xl">
                  <p className={`text-sm font-bold ${t.text}`}>{selectedMDN.items}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-surface)]">
              <button 
                onClick={() => setSelectedMDN(null)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${t.text}`}
              >
                Close
              </button>
              <button 
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Print MDN
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hidden Printable Component */}
      <div className="hidden">
        <PrintableMDN ref={mdnRef} mdn={selectedMDN} />
      </div>
    </div>
  );
}
