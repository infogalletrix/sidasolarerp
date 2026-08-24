import React, { useState, useEffect } from 'react';
import { Hammer, Search, Filter, Calendar, MapPin, Users, CheckCircle, Clock, PlayCircle, X, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeClasses } from '../hooks/useThemeClasses';

export default function InstallationPage() {
  const t = useThemeClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstall, setSelectedInstall] = useState(null);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [installations, setInstallations] = useState([]);

  useEffect(() => {
    fetchInstallations();
  }, []);

  const fetchInstallations = async () => {
    try {
      const res = await fetch('/api/solarprojects');
      if (res.ok) {
        const data = await res.json();
        const activeInstalls = data
          .filter(p => (p.assignedTeam && p.assignedTeam !== "Unassigned") || p.stage === "Installation" || p.stage === "In Progress" || p.stage === "Completed")
          .map(p => {
             let prog = 0;
             if (p.stage === "Completed") prog = 100;
             else if (p.stage === "In Progress" || p.stage === "Installation") prog = 45;

             let stat = "Scheduled";
             if (p.stage === "Completed") stat = "Completed";
             else if (p.stage === "In Progress" || p.stage === "Installation") stat = "In Progress";
             
             return {
                id: `INST-${p.id}`,
                projectId: p.id,
                project: `${p.title} ${p.systemSizeKw ? p.systemSizeKw+'kW' : ''}`,
                status: stat,
                startDate: p.startDate || 'TBD',
                endDate: p.expectedCompletionDate || 'TBD',
                team: p.assignedTeam || 'Unassigned',
                location: p.address || 'N/A',
                progress: prog
             };
          });
        setInstallations(activeInstalls);
      }
    } catch (err) {
      console.error("Failed to load installations", err);
    }
  };

  return (
    <div className="space-y-6 page-wrapper p-4 md:p-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Installations</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Track active and scheduled solar installations across all project sites.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Installations", val: installations.filter(w => w.status === 'In Progress').length, color: "text-amber-500" },
          { label: "Scheduled", val: installations.filter(w => w.status === 'Scheduled').length, color: "text-indigo-500" },
          { label: "Pending Materials", val: installations.filter(w => w.status === 'Pending Materials').length, color: "text-rose-500" },
          { label: "Completed (Week)", val: installations.filter(w => w.status === 'Completed').length, color: "text-emerald-500" },
        ].map((k, i) => (
          <div key={i} className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${k.color}`}>{k.label}</div>
            <div className={`text-3xl font-black ${t.heading}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)]`}>
        <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
          <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Hammer size={18}/> Installation Queue</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-transparent text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
            </div>
            <button className={`p-2 rounded-xl border border-[var(--border-color)] ${t.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition`}><Filter size={16}/></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={t.tableHead}>
              <tr>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Install ID</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Project Details</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Progress</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Assigned Team</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Timeline</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {installations.map((inst, idx) => (
                <tr key={idx} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                  <td className={`p-4 font-black text-amber-500`}>{inst.id}</td>
                  <td className={`p-4`}>
                    <div className={`font-bold ${t.heading}`}>{inst.project}</div>
                    <div className={`text-xs font-bold ${t.muted} flex items-center gap-1 mt-1`}><MapPin size={10}/> {inst.location}</div>
                  </td>
                  <td className={`p-4`}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${inst.progress}%` }}></div>
                      </div>
                      <span className={`text-xs font-black ${t.muted}`}>{inst.progress}%</span>
                    </div>
                  </td>
                  <td className={`p-4 font-bold ${t.muted}`}><div className="flex items-center gap-2"><Users size={14}/> {inst.team}</div></td>
                  <td className={`p-4 font-bold ${t.muted}`}>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[11px]"><Calendar size={12}/> Start: {inst.startDate}</div>
                      <div className="flex items-center gap-1.5 text-[11px]"><CheckCircle size={12}/> End: {inst.endDate}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max ${
                      inst.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      inst.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' :
                      inst.status === 'Pending Materials' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {inst.status === 'Completed' && <CheckCircle size={10}/>}
                      {inst.status === 'In Progress' && <PlayCircle size={10}/>}
                      {inst.status === 'Scheduled' && <Clock size={10}/>}
                      {inst.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => {
                        setSelectedInstall(inst);
                        setUpdateProgress(inst.progress);
                      }}
                      className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-amber-600 dark:text-amber-500"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE MODAL */}
      <AnimatePresence>
        {selectedInstall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedInstall(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md ${t.card} rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden`}
            >
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-amber-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg">
                    <Sliders size={20} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-black ${t.heading}`}>Update Status</h3>
                    <p className={`text-xs font-bold text-amber-600 uppercase tracking-widest mt-0.5`}>{selectedInstall.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedInstall(null)}
                  className={`p-2 rounded-full hover:bg-[var(--bg-surface)] transition ${t.muted}`}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1.5`}>Installation Progress ({updateProgress}%)</label>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={updateProgress} 
                    onChange={(e) => setUpdateProgress(e.target.value)}
                    className="w-full accent-amber-500"
                  />
                </div>
                
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1.5`}>Status</label>
                  <select defaultValue={selectedInstall.status} className="w-full border border-[var(--border-color)] themed-input p-3 rounded-xl outline-none font-bold text-sm">
                    <option>Scheduled</option>
                    <option>Pending Materials</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1.5`}>Update Notes</label>
                  <textarea rows={3} placeholder="Add notes about the installation..." className="w-full border border-[var(--border-color)] themed-input p-3 rounded-xl outline-none font-medium text-sm"></textarea>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)] flex justify-end gap-3">
                  <button onClick={() => setSelectedInstall(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[var(--bg-surface)] border border-[var(--border-color)] hover:opacity-80 transition">
                    Cancel
                  </button>
                  <button onClick={() => setSelectedInstall(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-600 text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition">
                    Save Changes
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
