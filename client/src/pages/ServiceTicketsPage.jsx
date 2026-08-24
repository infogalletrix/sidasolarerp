import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeClasses } from "../hooks/useThemeClasses";
import { 
  Plus, Wrench, Clock, CheckCircle2, AlertTriangle, Calendar, 
  MapPin, X, ShieldAlert, Settings, FileText, Search, Activity
} from "lucide-react";

export default function ServiceTicketsPage() {
  const t = useThemeClasses();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "tickets";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tab = params.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/service-tickets?tab=${tabId}`, { replace: true });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/servicetickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTicket = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      solarProjectId: parseInt(formData.get("solarProjectId")),
      scheduledVisitDate: formData.get("scheduledVisitDate"),
      status: "Open",
      createdDate: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/servicetickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchTickets();
      }
    } catch (err) {
      console.error("Failed to create ticket", err);
    }
  };

  const updateTicketStatus = async (ticketId, currentTicket, newStatus) => {
    const updated = { ...currentTicket, status: newStatus };
    if (newStatus === "Resolved") {
      updated.resolvedDate = new Date().toISOString();
    }
    
    try {
      const res = await fetch(`/api/servicetickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // DUMMY DATA FOR AMC & WARRANTY
  const amcContracts = [
    { id: 'AMC-8021', project: 'Sharma Residence 5kW', plan: 'Gold Plan (2 Years)', nextVisit: '2024-07-15', status: 'Active', visitsCompleted: 2, visitsTotal: 8 },
    { id: 'AMC-8022', project: 'Desai Villa 10kW', plan: 'Silver Plan (1 Year)', nextVisit: '2024-06-30', status: 'Due Soon', visitsCompleted: 1, visitsTotal: 4 },
    { id: 'AMC-8023', project: 'GreenTech Factory', plan: 'Platinum (5 Years)', nextVisit: '2024-08-01', status: 'Active', visitsCompleted: 8, visitsTotal: 20 },
  ];

  const warrantyClaims = [
    { id: 'WC-901', project: 'Sharma Residence', item: 'Inverter (Growatt 5kW)', issue: 'Display Blank', status: 'Approved', manufacturer: 'Growatt', filedDate: '2024-06-10' },
    { id: 'WC-902', project: 'Orchid School', item: 'Solar Panel 550W (x2)', issue: 'Micro-cracks', status: 'Pending Review', manufacturer: 'Waaree', filedDate: '2024-06-20' },
    { id: 'WC-903', project: 'Desai Villa', item: 'ACDB Box', issue: 'Breaker Trip', status: 'Replaced', manufacturer: 'Havells', filedDate: '2024-05-15' },
  ];

  return (
    <div className={`min-h-screen p-4 md:p-8 ${t.isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">Service & Support</h1>
          <p className="text-slate-400 mt-2 font-medium text-sm">Manage tickets, AMC schedules, and warranty claims.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all transform hover:scale-105 active:scale-95 text-sm">
          <Plus size={16} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Open Tickets", value: tickets.filter(t => t.status !== 'Resolved').length, icon: <AlertTriangle size={20} className="text-rose-500" /> },
          { title: "AMC Due", value: amcContracts.filter(a => a.status === 'Due Soon').length, icon: <Settings size={20} className="text-orange-500" /> },
          { title: "Pending Warranty", value: warrantyClaims.filter(w => w.status === 'Pending Review').length, icon: <ShieldAlert size={20} className="text-blue-500" /> },
          { title: "Resolved (Month)", value: tickets.filter(t => t.status === 'Resolved').length, icon: <CheckCircle2 size={20} className="text-emerald-500" /> }
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl ${t.isDark ? "bg-slate-900/80 border border-white/10" : "bg-white shadow-xl shadow-slate-200/50"} flex items-center justify-between transition-transform hover:-translate-y-1`}>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-3xl font-black mt-2">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${t.isDark ? "bg-white/5" : "bg-slate-50"}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full mb-6">
        <div className="flex w-full md:w-auto gap-1 p-1 rounded-xl border border-[var(--border-color)] themed-card shadow-sm overflow-x-auto">
          {[
            { id: "tickets", label: "Helpdesk Tickets", icon: <Wrench size={14} /> },
            { id: "amc", label: "AMC Contracts", icon: <Settings size={14} /> },
            { id: "warranty", label: "Warranty Claims", icon: <ShieldAlert size={14} /> }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => handleTabChange(tab.id)} 
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id ? "bg-rose-600 text-white shadow-md" : "text-slate-400 hover:text-themed hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className={`rounded-[2rem] overflow-hidden ${t.isDark ? "bg-slate-900/80 border border-white/10" : "bg-white shadow-xl shadow-slate-200/50 border border-slate-100"}`}>
        
        {/* TICKETS TAB */}
        {activeTab === "tickets" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={t.isDark ? "bg-slate-800/50 border-b border-white/10" : "bg-slate-50 border-b border-slate-200"}>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Ticket Details</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Priority</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Schedule</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-bold text-sm">Loading service tickets...</td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan="5" className="p-12 text-center text-slate-500"><Wrench size={48} className="mx-auto mb-4 opacity-20" /><p className="font-bold text-sm">No service tickets found.</p></td></tr>
                ) : (
                  tickets.sort((a,b) => b.id - a.id).map((ticket) => (
                    <tr key={ticket.id} className={`border-b ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                      <td className="p-4">
                        <p className="font-bold text-sm flex items-center gap-2">
                          {ticket.title} 
                          <span className="text-[10px] bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest">#{ticket.id}</span>
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1"><MapPin size={10}/> Project ID: {ticket.solarProjectId}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                          ticket.priority === 'Critical' ? 'bg-red-500/10 text-red-500' :
                          ticket.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={ticket.status}
                          onChange={(e) => updateTicketStatus(ticket.id, ticket, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest outline-none py-1.5 px-3 rounded-lg cursor-pointer transition-colors ${
                            ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                            ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}
                        >
                          <option className="bg-slate-900 text-white">Open</option>
                          <option className="bg-slate-900 text-white">Assigned</option>
                          <option className="bg-slate-900 text-white">In Progress</option>
                          <option className="bg-slate-900 text-white">Resolved</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-400">
                        {ticket.scheduledVisitDate ? (
                          <span className="flex items-center gap-1.5 text-blue-400"><Calendar size={12}/> {new Date(ticket.scheduledVisitDate).toLocaleDateString()}</span>
                        ) : (
                          "Not Scheduled"
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-rose-500">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* AMC TAB */}
        {activeTab === "amc" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={t.isDark ? "bg-slate-800/50 border-b border-white/10" : "bg-slate-50 border-b border-slate-200"}>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Contract ID</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Project & Plan</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Next Prev. Maint.</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Visits</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {amcContracts.map((amc) => (
                  <tr key={amc.id} className={`border-b ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                    <td className={`p-4 font-black text-rose-500 text-sm`}>{amc.id}</td>
                    <td className="p-4">
                      <p className={`font-bold text-sm ${t.heading}`}>{amc.project}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">{amc.plan}</p>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-400">
                      <span className={`flex items-center gap-1.5 ${amc.status === 'Due Soon' ? 'text-orange-500' : ''}`}><Calendar size={12}/> {amc.nextVisit}</span>
                    </td>
                    <td className="p-4">
                      <div className="w-full max-w-[120px]">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1">
                          <span>{amc.visitsCompleted} / {amc.visitsTotal}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(amc.visitsCompleted/amc.visitsTotal)*100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                        amc.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-orange-500/10 text-orange-500'
                      }`}>
                        {amc.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-slate-400">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* WARRANTY TAB */}
        {activeTab === "warranty" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={t.isDark ? "bg-slate-800/50 border-b border-white/10" : "bg-slate-50 border-b border-slate-200"}>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Claim ID</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Equipment & Issue</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Manufacturer</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Filed Date</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 font-black text-[10px] text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {warrantyClaims.map((claim) => (
                  <tr key={claim.id} className={`border-b ${t.isDark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"} transition-colors`}>
                    <td className={`p-4 font-black text-rose-500 text-sm`}>{claim.id}</td>
                    <td className="p-4">
                      <p className={`font-bold text-sm ${t.heading}`}>{claim.item}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1"><AlertTriangle size={10} className="text-orange-500"/> {claim.issue}</p>
                    </td>
                    <td className={`p-4 text-xs font-bold text-slate-400`}>{claim.manufacturer}</td>
                    <td className={`p-4 text-xs font-bold text-slate-400`}><span className="flex items-center gap-1.5"><Calendar size={12}/> {claim.filedDate}</span></td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                        claim.status === 'Approved' ? 'bg-blue-500/10 text-blue-500' :
                        claim.status === 'Replaced' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-slate-400">
                        Follow Up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTicket} className={`rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200 ${t.isDark ? "bg-slate-900 border border-white/10" : "bg-white"}`}>
            <div className={`p-6 flex justify-between items-center border-b ${t.isDark ? "border-white/10" : "border-slate-100"}`}>
              <h2 className="text-xl font-black">Create Service Ticket</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Issue Title</label>
                <input required name="title" placeholder="e.g. Inverter displaying Error 43" className={`w-full border p-3 rounded-xl outline-none font-bold text-sm ${t.isDark ? "bg-slate-800 border-white/10 focus:border-rose-500" : "bg-white border-slate-200 focus:border-rose-500"}`} />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Associated Solar Project ID</label>
                <input required type="number" name="solarProjectId" placeholder="Project ID" className={`w-full border p-3 rounded-xl outline-none font-bold text-sm ${t.isDark ? "bg-slate-800 border-white/10 focus:border-rose-500" : "bg-white border-slate-200 focus:border-rose-500"}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Priority</label>
                  <select name="priority" className={`w-full border p-3 rounded-xl outline-none font-bold text-sm ${t.isDark ? "bg-slate-800 border-white/10 focus:border-rose-500" : "bg-white border-slate-200 focus:border-rose-500"}`}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Schedule Visit</label>
                  <input type="date" name="scheduledVisitDate" className={`w-full border p-3 rounded-xl outline-none font-bold text-sm ${t.isDark ? "bg-slate-800 border-white/10 focus:border-rose-500" : "bg-white border-slate-200 focus:border-rose-500"}`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Description & Diagnostics</label>
                <textarea required name="description" rows={3} placeholder="Provide details..." className={`w-full border p-3 rounded-xl outline-none font-bold text-sm ${t.isDark ? "bg-slate-800 border-white/10 focus:border-rose-500" : "bg-white border-slate-200 focus:border-rose-500"}`} />
              </div>
            </div>
            <div className={`p-4 border-t flex justify-end gap-3 ${t.isDark ? "border-white/10 bg-slate-900/50" : "border-slate-100 bg-slate-50"}`}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-black text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black shadow-md shadow-rose-600/20 transition-all text-sm uppercase tracking-widest">Create Ticket</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
