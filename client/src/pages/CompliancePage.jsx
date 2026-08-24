import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileBadge, Sun, Activity, Search, ShieldCheck, 
  Landmark, AlertCircle, CheckCircle, UploadCloud, Calendar
} from 'lucide-react';
import { useThemeClasses } from '../hooks/useThemeClasses';

export default function CompliancePage() {
  const t = useThemeClasses();
  const location = useLocation();
  const navigate = useNavigate();

  // Tab mapping
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "surya-ghar";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const tab = params.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/compliance?tab=${tabId}`, { replace: true });
  };

  // DUMMY DATA FOR DEMO MODE
  const suryaGharApplications = [
    { id: 'PSG-1001', customer: 'Ramesh Kumar', capacity: '3 kW', date: '2024-05-12', status: 'Approved', portalLink: '#' },
    { id: 'PSG-1002', customer: 'Anita Desai', capacity: '5 kW', date: '2024-05-18', status: 'Verification Pending', portalLink: '#' },
    { id: 'PSG-1003', customer: 'Suresh Patil', capacity: '10 kW', date: '2024-06-02', status: 'Application Submitted', portalLink: '#' },
    { id: 'PSG-1004', customer: 'Priya Sharma', capacity: '2 kW', date: '2024-06-05', status: 'Documents Required', portalLink: '#' }
  ];

  const netMeteringApplications = [
    { id: 'NM-9921', customer: 'Ramesh Kumar', discom: 'BESCOM', stage: 'Meter Installed', inspectionDate: '2024-06-10', ceig: 'Exempt' },
    { id: 'NM-9922', customer: 'Anita Desai', discom: 'MSEDCL', stage: 'Inspection Scheduled', inspectionDate: '2024-06-22', ceig: 'Pending' },
    { id: 'NM-9923', customer: 'Suresh Patil', discom: 'TNEB', stage: 'Application Submitted', inspectionDate: 'TBD', ceig: 'Approved' }
  ];

  const subsidyTracking = [
    { id: 'SUB-401', customer: 'Ramesh Kumar', scheme: 'PM Surya Ghar', expected: 78000, received: 78000, status: 'Disbursed' },
    { id: 'SUB-402', customer: 'Anita Desai', scheme: 'State + Central', expected: 105000, received: 0, status: 'Processing' },
    { id: 'SUB-403', customer: 'Suresh Patil', scheme: 'Commercial Subsidy', expected: 150000, received: 0, status: 'Under Review' }
  ];

  return (
    <div className="p-4 md:p-6 page-wrapper space-y-6">
      
      {/* HEADER & KPI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Govt & Compliance</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Manage PM Surya Ghar, Subsidies, and Net Metering workflows.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-indigo-500">
            <Sun size={14}/> Active PM Surya Ghar
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>24</div>
        </div>
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-emerald-500">
            <Landmark size={14}/> Subsidies Disbursed
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>₹12.5L</div>
        </div>
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-amber-500">
            <Activity size={14}/> Net Metering Pending
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>18</div>
        </div>
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-rose-500">
            <AlertCircle size={14}/> Escalations
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>2</div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full">
        <div className="flex w-full md:w-auto gap-1 p-1 rounded-xl border border-[var(--border-color)] themed-card shadow-sm overflow-x-auto">
          {[
            { id: "surya-ghar", label: "PM Surya Ghar", icon: <Sun size={14} /> },
            { id: "subsidy", label: "Subsidies", icon: <Landmark size={14} /> },
            { id: "net-metering", label: "Net Metering", icon: <Activity size={14} /> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => handleTabChange(tab.id)} 
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id ? "dark:bg-indigo-600 bg-indigo-500 text-white shadow-md" : "text-muted hover:text-themed hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input type="text" placeholder={`Search ${activeTab.replace('-', ' ')}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] themed-input text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)]`}>
        
        {/* PM SURYA GHAR TAB */}
        {activeTab === "surya-ghar" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Sun size={18}/> National Portal Applications</h2>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md">
                + New Application
              </button>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4">App ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Apply Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {suryaGharApplications.map(app => (
                  <tr key={app.id} className={`${t.tableRow} border-b border-[var(--border-color)]`}>
                    <td className={`p-4 font-black text-indigo-500`}>{app.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{app.customer}</td>
                    <td className={`p-4 font-bold ${t.muted}`}>{app.capacity}</td>
                    <td className={`p-4 font-medium ${t.muted}`}>{app.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                        app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        app.status === 'Documents Required' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="text-xs font-bold bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-2 py-1 rounded flex items-center gap-1 transition">
                        <UploadCloud size={14}/> Docs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* SUBSIDY TRACKING TAB */}
        {activeTab === "subsidy" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Landmark size={18}/> Subsidy Disbursement Ledger</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Scheme</th>
                  <th className="p-4">Expected Subsidy</th>
                  <th className="p-4">Amount Received</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {subsidyTracking.map(sub => (
                  <tr key={sub.id} className={`${t.tableRow} border-b border-[var(--border-color)]`}>
                    <td className={`p-4 font-black text-indigo-500`}>{sub.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{sub.customer}</td>
                    <td className={`p-4 font-bold ${t.muted}`}>{sub.scheme}</td>
                    <td className={`p-4 font-black ${t.heading}`}>₹{sub.expected.toLocaleString()}</td>
                    <td className={`p-4 font-black ${sub.received === sub.expected ? 'text-emerald-500' : t.muted}`}>
                      ₹{sub.received.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                        sub.status === 'Disbursed' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* NET METERING TAB */}
        {activeTab === "net-metering" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Activity size={18}/> Discom / Net Metering Workflow</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4">App ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">DISCOM</th>
                  <th className="p-4">CEIG Approval</th>
                  <th className="p-4">Current Stage</th>
                  <th className="p-4">Inspection Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {netMeteringApplications.map(nm => (
                  <tr key={nm.id} className={`${t.tableRow} border-b border-[var(--border-color)]`}>
                    <td className={`p-4 font-black text-indigo-500`}>{nm.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{nm.customer}</td>
                    <td className={`p-4 font-bold ${t.muted}`}>{nm.discom}</td>
                    <td className="p-4">
                      {nm.ceig === 'Approved' || nm.ceig === 'Exempt' ? (
                        <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs"><CheckCircle size={14}/> {nm.ceig}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-500 font-bold text-xs"><AlertCircle size={14}/> {nm.ceig}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                        nm.stage === 'Meter Installed' ? 'bg-emerald-500/10 text-emerald-500' :
                        nm.stage === 'Inspection Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {nm.stage}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${t.muted} flex items-center gap-2`}><Calendar size={14}/> {nm.inspectionDate}</td>
                    <td className="p-4">
                       <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

      </div>
    </div>
  );
}
