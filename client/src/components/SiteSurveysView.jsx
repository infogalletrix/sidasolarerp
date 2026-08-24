import React, { useState, useEffect } from 'react';
import { Map, CheckCircle2, Search, Filter, Calendar, X, Eye, FileText, Zap, Home, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useNavigate } from 'react-router-dom';

function Modal({ open, onClose, children, size = "max-w-2xl" }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className={`themed-card bg-[var(--bg-surface)] rounded-[2rem] shadow-2xl p-8 w-full ${size} relative max-h-[90vh] overflow-y-auto border border-[var(--border-color)]`}>
            <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-red-400 text-3xl leading-none transition-colors">&times;</button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function SiteSurveysView() {
  const t = useThemeClasses();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projRes, surRes] = await Promise.all([
        fetch('/api/solarprojects'),
        fetch('/api/sitesurveys')
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (surRes.ok) setSurveys(await surRes.json());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted font-bold">Loading surveys...</div>;
  }

  // Combine project info with survey info
  const surveyList = projects.map(proj => {
    const srv = surveys.find(s => s.solarProjectId === proj.id);
    return {
      projectId: proj.id,
      projectName: proj.title || proj.clientName || srv?.CustomerName || 'New Survey',
      customerPhone: srv?.customerPhone || 'N/A',
      address: proj.address || 'Unknown Address',
      status: srv ? srv.status : 'Not Started',
      date: srv ? srv.surveyDate : '-',
      surveyId: srv ? srv.id : null,
      capacity: srv ? srv.recommendedSystemCapacity : '-',
      rawData: srv || null
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Site Surveys</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Manage and review site assessments across all projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Contacted", val: surveyList.filter(s => s.status === 'Contacted').length, color: "text-blue-500" },
          { label: "Interested", val: surveyList.filter(s => s.status === 'Interested').length, color: "text-amber-500" },
          { label: "Site Visit", val: surveyList.filter(s => s.status === 'Site Visit').length, color: "text-indigo-500" },
          { label: "Completed", val: surveyList.filter(s => s.status === 'Completed').length, color: "text-emerald-500" },
        ].map((k, i) => (
          <div key={i} className={`${t.card} p-5 rounded-2xl shadow-sm`}>
            <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${k.color}`}>{k.label}</div>
            <div className={`text-3xl font-black ${t.heading}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm`}>
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
          <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Map size={18}/> Survey Log</h2>
          <div className="flex gap-2">
            <button className={`p-2 rounded-xl border border-[var(--border-color)] ${t.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition`}><Filter size={16}/></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={t.tableHead}>
              <tr>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Project</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Location</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Date</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Rec. kW</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {surveyList.map((srv, idx) => (
                <tr key={idx} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                  <td className={`p-4 font-bold ${t.heading}`}>{srv.projectName}</td>
                  <td className={`p-4 text-xs font-bold ${t.muted} max-w-[200px] truncate`}>{srv.address}</td>
                  <td className={`p-4 text-xs font-bold ${t.muted} flex items-center gap-1.5`}><Calendar size={12}/> {srv.date}</td>
                  <td className={`p-4 text-sm font-black text-indigo-500`}>{srv.capacity !== '-' ? `${srv.capacity} kW` : '-'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${
                      srv.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      srv.status === 'Site Visit' ? 'bg-indigo-500/10 text-indigo-500' :
                      srv.status === 'Interested' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {srv.status || 'Contacted'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => {
                        setSelectedSurvey(srv);
                        setViewModalOpen(true);
                      }}
                      className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors border border-slate-500/30 text-slate-500 hover:bg-slate-500/10 dark:text-slate-400"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {surveyList.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted font-bold text-sm">No site surveys found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Survey Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        {selectedSurvey ? (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border-color)]">
              <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <Map size={24} />
              </div>
              <div>
                <h2 className={`text-2xl font-black ${t.heading}`}>{selectedSurvey.projectName}</h2>
                <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-2">
                  <User size={14} /> {selectedSurvey.rawData?.customerName || selectedSurvey.projectName} &bull; <Phone size={14} /> {selectedSurvey.rawData?.customerPhone || 'N/A'}
                </p>
                <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-2">
                  <Calendar size={14} /> Survey Date: {selectedSurvey.rawData?.surveyDate || '-'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Roof Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2"><Home size={14}/> Roof Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Roof Type</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.roofType || '-'}</div>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Condition</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.roofCondition || '-'}</div>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Area (sq ft)</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.roofArea || '-'}</div>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Shading Issues</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.hasShadingIssues ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {/* Electrical Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Electrical</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Sanctioned Load</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.sanctionedLoad || '-'} kW</div>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Avg Monthly</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.averageMonthlyConsumption || '-'} kWh</div>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Phase</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.phase || '-'}</div>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">Panel Upgrade</div>
                    <div className={`font-bold ${t.heading} mt-1`}>{selectedSurvey.rawData?.needsMainPanelUpgrade ? 'Required' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between mb-6">
              <div>
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Recommended Capacity</div>
                <div className="text-2xl font-black text-emerald-500 mt-1">{selectedSurvey.rawData?.recommendedSystemCapacity || '-'} kW</div>
              </div>
              <CheckCircle2 size={32} className="text-emerald-500 opacity-50" />
            </div>

            {selectedSurvey.rawData?.surveyorNotes && (
              <div className="mb-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><FileText size={14}/> Surveyor Notes</h3>
                <div className="p-4 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-xl text-sm font-bold leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedSurvey.rawData.surveyorNotes}
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
              <button onClick={() => setViewModalOpen(false)} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${t.muted} hover:bg-black/5 dark:hover:bg-white/5`}>Close</button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted font-bold p-8">No survey data available.</div>
        )}
      </Modal>

    </div>
  );
}
