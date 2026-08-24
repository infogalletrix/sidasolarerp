import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Calendar, MapPin, Users, CheckCircle, Clock, X, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeClasses } from '../hooks/useThemeClasses';

export default function WorkOrdersPage() {
  const t = useThemeClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const workOrders = [
    { id: 'WO-1051', project: 'Sharma Residence 5kW', type: 'Installation', status: 'In Progress', date: '2024-06-25', team: 'Alpha Team (Rajesh)', location: 'Indiranagar, Bangalore' },
    { id: 'WO-1052', project: 'GreenTech Factory 50kW', type: 'Site Survey', status: 'Pending', date: '2024-06-26', team: 'Survey Team 1', location: 'Peenya Industrial Area' },
    { id: 'WO-1053', project: 'Desai Villa 10kW', type: 'Maintenance', status: 'Completed', date: '2024-06-20', team: 'Service Team B', location: 'Whitefield, Bangalore' },
    { id: 'WO-1054', project: 'Orchid School 20kW', type: 'Installation', status: 'Scheduled', date: '2024-06-28', team: 'Beta Team (Suresh)', location: 'Jayanagar, Bangalore' }
  ];

  return (
    <div className="space-y-6 page-wrapper p-4 md:p-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Work Orders</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Manage deployment tasks, installation schedules, and assigned teams.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Active", val: workOrders.length, color: "text-blue-500" },
          { label: "In Progress", val: workOrders.filter(w => w.status === 'In Progress').length, color: "text-amber-500" },
          { label: "Scheduled", val: workOrders.filter(w => w.status === 'Scheduled').length, color: "text-indigo-500" },
          { label: "Completed (Week)", val: workOrders.filter(w => w.status === 'Completed').length, color: "text-emerald-500" },
        ].map((k, i) => (
          <div key={i} className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${k.color}`}>{k.label}</div>
            <div className={`text-3xl font-black ${t.heading}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)]`}>
        <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
          <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><FileText size={18}/> Job List</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input type="text" placeholder="Search work orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-transparent text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
            </div>
            <button className={`p-2 rounded-xl border border-[var(--border-color)] ${t.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition`}><Filter size={16}/></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={t.tableHead}>
              <tr>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">WO ID</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Project</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Type</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Assigned Team</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Schedule Date</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo, idx) => (
                <tr key={idx} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                  <td className={`p-4 font-black text-indigo-500`}>{wo.id}</td>
                  <td className={`p-4`}>
                    <div className={`font-bold ${t.heading}`}>{wo.project}</div>
                    <div className={`text-xs font-bold ${t.muted} flex items-center gap-1 mt-1`}><MapPin size={10}/> {wo.location}</div>
                  </td>
                  <td className={`p-4 font-bold ${t.muted}`}>{wo.type}</td>
                  <td className={`p-4 font-bold ${t.muted} flex items-center gap-2 mt-2`}><Users size={14}/> {wo.team}</td>
                  <td className={`p-4 font-bold ${t.muted}`}>
                    <div className="flex items-center gap-1.5"><Calendar size={14}/> {wo.date}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max ${
                      wo.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      wo.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' :
                      wo.status === 'Pending' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {wo.status === 'Completed' && <CheckCircle size={10}/>}
                      {wo.status === 'In Progress' && <Clock size={10}/>}
                      {wo.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedOrder(wo)}
                      className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl ${t.card} rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden`}
            >
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-indigo-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-lg">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-black ${t.heading}`}>{selectedOrder.id}</h3>
                    <p className={`text-xs font-bold text-indigo-500 uppercase tracking-widest mt-0.5`}>{selectedOrder.status}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className={`p-2 rounded-full hover:bg-[var(--bg-surface)] transition ${t.muted}`}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Project Name</p>
                    <p className={`text-base font-bold ${t.text}`}>{selectedOrder.project}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Work Type</p>
                    <p className={`text-base font-bold ${t.text}`}>{selectedOrder.type}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Assigned Team</p>
                    <p className={`text-base font-bold ${t.text}`}>{selectedOrder.team}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Scheduled Date</p>
                    <p className={`text-base font-bold ${t.text}`}>{selectedOrder.date}</p>
                  </div>
                  <div className="col-span-2">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Location</p>
                    <p className={`text-base font-bold ${t.text} flex items-center gap-1.5`}>
                      <MapPin size={14} className="text-indigo-500" /> {selectedOrder.location}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex justify-end gap-3">
                  <button onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[var(--bg-surface)] border border-[var(--border-color)] hover:opacity-80 transition">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
