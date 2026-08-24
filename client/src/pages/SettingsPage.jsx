import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Activity, Zap, Search, Plus, 
  Users, Key, AlertTriangle, PlayCircle, Settings,
  UserCheck, Bell, Mail, Webhook, Cog, Layout, Globe, FileSignature, CheckSquare, BarChart2, CheckCircle
} from 'lucide-react';
import { useThemeClasses } from '../hooks/useThemeClasses';

export default function SettingsPage() {
  const t = useThemeClasses();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "roles";
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
    navigate(`/settings?tab=${tabId}`, { replace: true });
  };

  const roles = [
    { id: 1, name: 'Super Admin', users: 2, permissions: 'All Access', status: 'Active' },
    { id: 2, name: 'Sales Manager', users: 5, permissions: 'CRM, Quotations, Analytics', status: 'Active' },
    { id: 3, name: 'Site Engineer', users: 12, permissions: 'Projects, Surveys, Work Orders', status: 'Active' },
    { id: 4, name: 'Procurement Officer', users: 3, permissions: 'Inventory, Vendors, POs', status: 'Active' },
    { id: 5, name: 'Finance Head', users: 2, permissions: 'Billing, Analytics, Subsidy', status: 'Active' },
  ];

  const auditLogs = [
    { id: 'AL-901', user: 'Rajesh Kumar (Admin)', action: 'Modified System Settings', module: 'System', date: '2024-06-25 10:45 AM', status: 'Success' },
    { id: 'AL-902', user: 'Amit Desai (Sales)', action: 'Deleted Quotation #QT-1024', module: 'Sales', date: '2024-06-25 09:30 AM', status: 'Warning' },
    { id: 'AL-903', user: 'Priya Sharma (HR)', action: 'Processed May Payroll', module: 'HR', date: '2024-06-24 04:15 PM', status: 'Success' },
    { id: 'AL-904', user: 'System Auto', action: 'Failed Database Backup', module: 'Database', date: '2024-06-24 02:00 AM', status: 'Error' },
  ];

  const automations = [
    { id: 'AUTO-1', name: 'Sales Follow-up Alert', trigger: 'Lead Inactive > 3 Days', action: 'Notify Sales Rep', status: 'Active' },
    { id: 'AUTO-2', name: 'AMC Expiry Reminder', trigger: 'AMC expires in 30 days', action: 'Email Customer & Create Ticket', status: 'Active' },
    { id: 'AUTO-3', name: 'Low Stock Warning', trigger: 'Panel Stock < 50 Units', action: 'Notify Procurement', status: 'Paused' },
  ];

  return (
    <div className="p-4 md:p-6 page-wrapper space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Settings & Administration</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Manage roles, audit trails, and system automation rules.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full">
        <div className="flex w-full md:w-auto gap-1 p-1 rounded-xl border border-[var(--border-color)] themed-card shadow-sm overflow-x-auto">
          {[
            { id: "roles", label: "Roles & Permissions", icon: <ShieldCheck size={14} /> },
            { id: "users", label: "Users", icon: <UserCheck size={14} /> },
            { id: "audit", label: "Audit Logs", icon: <Activity size={14} /> },
            { id: "automation", label: "Workflow Engine", icon: <Zap size={14} /> },
            { id: "forms", label: "Form Builder", icon: <Layout size={14} /> },
            { id: "portals", label: "Portals", icon: <Globe size={14} /> },
            { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
            { id: "email", label: "Email config", icon: <Mail size={14} /> },
            { id: "api", label: "API Integrations", icon: <Webhook size={14} /> },
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
          <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] themed-input text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
      </div>

      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)]`}>
        
        {/* ROLES TAB */}
        {activeTab === "roles" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><ShieldCheck size={18}/> RBAC Configuration</h2>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md">
                <Plus size={14}/> New Role
              </button>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Role Name</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Active Users</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Permissions Scope</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black ${t.heading} flex items-center gap-2`}>
                      <Key size={14} className="text-indigo-500"/> {role.name}
                    </td>
                    <td className={`p-4 font-bold ${t.muted}`}>
                      <div className="flex items-center gap-1.5"><Users size={14}/> {role.users}</div>
                    </td>
                    <td className={`p-4 font-bold text-xs ${t.muted}`}>
                      {role.permissions}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-emerald-500/10 text-emerald-500`}>
                        {role.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                        Edit Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === "audit" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Activity size={18}/> System Audit Trail</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Log ID</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">User</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Action Performed</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Module</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Timestamp</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black text-indigo-500 text-xs`}>{log.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{log.user}</td>
                    <td className={`p-4 font-bold ${t.muted} text-sm`}>{log.action}</td>
                    <td className={`p-4`}>
                      <span className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted">{log.module}</span>
                    </td>
                    <td className={`p-4 font-bold ${t.muted} text-xs`}>{log.date}</td>
                    <td className="p-4">
                      {log.status === 'Success' && <span className="flex items-center gap-1 text-emerald-500 font-bold text-xs"><CheckCircle size={14}/> Success</span>}
                      {log.status === 'Warning' && <span className="flex items-center gap-1 text-amber-500 font-bold text-xs"><AlertTriangle size={14}/> Warning</span>}
                      {log.status === 'Error' && <span className="flex items-center gap-1 text-rose-500 font-bold text-xs"><AlertTriangle size={14}/> Error</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* AUTOMATION TAB */}
        {activeTab === "automation" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Zap size={18}/> Automation Rules Engine</h2>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md">
                <Plus size={14}/> Create Rule
              </button>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Rule ID</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Rule Name</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Trigger Condition</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Automated Action</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {automations.map(auto => (
                  <tr key={auto.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black text-indigo-500 text-xs`}>{auto.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{auto.name}</td>
                    <td className={`p-4 font-bold ${t.muted} text-sm flex items-center gap-1.5`}><PlayCircle size={14} className="text-amber-500"/> {auto.trigger}</td>
                    <td className={`p-4 font-bold ${t.muted} text-sm`}>{auto.action}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                        auto.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {auto.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><UserCheck size={18}/> User Management</h2>
            </div>
            <div className="p-16 text-center text-slate-500">
              <UserCheck size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">System Users</p>
              <p className="text-sm">Module under construction. User creation and access assignment will appear here.</p>
            </div>
          </motion.div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Bell size={18}/> Notification Settings</h2>
            </div>
            <div className="p-16 text-center text-slate-500">
              <Bell size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Notification Rules</p>
              <p className="text-sm">Module under construction. App alerts and push configurations will appear here.</p>
            </div>
          </motion.div>
        )}

        {/* EMAIL TAB */}
        {activeTab === "email" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Mail size={18}/> Email Configuration</h2>
            </div>
            <div className="p-16 text-center text-slate-500">
              <Mail size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">SMTP / IMAP Settings</p>
              <p className="text-sm">Module under construction. Email server credentials and templates will appear here.</p>
            </div>
          </motion.div>
        )}

        {/* API TAB */}
        {activeTab === "api" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Webhook size={18}/> API Integrations</h2>
            </div>
            <div className="p-16 text-center text-slate-500">
              <Webhook size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">External APIs</p>
              <p className="text-sm">Module under construction. Webhooks, PM Surya Ghar integration, and partner API keys will appear here.</p>
            </div>
          </motion.div>
        )}

        {/* FORMS TAB */}
        {activeTab === "forms" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Layout size={18}/> Dynamic Form Builder</h2>
            </div>
            <div className="p-16 text-center text-slate-500">
              <CheckSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Custom Forms & Checklists</p>
              <p className="text-sm">Module under construction. Build custom site survey forms and post-installation checklists dynamically here.</p>
            </div>
          </motion.div>
        )}

        {/* PORTALS TAB */}
        {activeTab === "portals" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Globe size={18}/> Customer & Dealer Portals</h2>
            </div>
            <div className="p-16 text-center text-slate-500">
              <Globe size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Portal Configuration</p>
              <p className="text-sm">Module under construction. Configure branding, login pages, and access rules for external stakeholders.</p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
