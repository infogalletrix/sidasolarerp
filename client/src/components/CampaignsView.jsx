import React, { useState } from "react";
import { Megaphone, Target, BarChart2, IndianRupee, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeClasses } from "../hooks/useThemeClasses";

// Premium Modal Component
function Modal({ open, onClose, children, size = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className={`themed-card bg-[var(--bg-surface)] rounded-[2rem] shadow-2xl p-8 w-full ${size} relative max-h-[90vh] overflow-y-auto border border-[var(--border-color)]`}>
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-red-400 text-3xl leading-none transition-colors">&times;</button>
        {children}
      </motion.div>
    </div>
  );
}

export default function CampaignsView() {
  const t = useThemeClasses();

  const initialDummyCampaigns = [
    { id: 1, name: "Summer Solar Promo", channel: "Facebook Ads", budget: 15000, leads: 120, converted: 12, revenue: 4500000, status: "Active" },
    { id: 2, name: "Google Search (Local)", channel: "Google Ads", budget: 25000, leads: 85, converted: 18, revenue: 6800000, status: "Active" },
    { id: 3, name: "Referral Program 2024", channel: "Referral", budget: 5000, leads: 40, converted: 15, revenue: 5200000, status: "Ongoing" },
    { id: 4, name: "WhatsApp Broadcast", channel: "WhatsApp", budget: 2000, leads: 200, converted: 5, revenue: 1500000, status: "Completed" }
  ];

  const [campaigns, setCampaigns] = useState(initialDummyCampaigns);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    channel: "Facebook Ads",
    budget: 0,
    status: "Active"
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", val: "3", icon: <Megaphone size={16}/>, color: "text-blue-500" },
          { label: "Total Leads Generated", val: "445", icon: <Target size={16}/>, color: "text-emerald-500" },
          { label: "Marketing Budget", val: "₹47,000", icon: <IndianRupee size={16}/>, color: "text-amber-500" },
          { label: "Total ROI", val: "382%", icon: <BarChart2 size={16}/>, color: "text-indigo-500" }
        ].map((k, i) => (
          <div key={i} className={`${t.card} p-5 rounded-2xl`}>
            <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${k.color}`}>
              {k.icon} {k.label}
            </div>
            <div className={`text-3xl font-black ${t.heading}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className={`${t.card} rounded-[2rem] overflow-hidden`}>
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className={`text-lg font-black ${t.heading}`}>Marketing Campaigns</h2>
          <button 
            className={`px-4 py-2 flex items-center gap-2 rounded-xl text-sm font-bold text-white shadow-md transition-all ${t.isDark ? "bg-orange-600 hover:bg-orange-700" : "bg-[#D4AF37] hover:bg-[#c4a133]"}`}
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={16} /> Create Campaign
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={t.tableHead}>
              <tr>
                <th className="p-4">Campaign Name</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Leads</th>
                <th className="p-4">Conversion</th>
                <th className="p-4">Revenue Generated</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id} className={`${t.tableRow} border-b border-[var(--border-color)]`}>
                  <td className={`p-4 font-bold ${t.heading}`}>{c.name}</td>
                  <td className={`p-4 font-medium ${t.muted}`}>{c.channel}</td>
                  <td className={`p-4 font-medium ${t.muted}`}>₹{(c.budget).toLocaleString('en-IN')}</td>
                  <td className={`p-4 font-bold ${t.heading}`}>{c.leads}</td>
                  <td className={`p-4 font-bold text-emerald-500`}>{((c.converted / c.leads) * 100).toFixed(1)}%</td>
                  <td className={`p-4 font-bold text-blue-500`}>₹{(c.revenue/100000).toFixed(2)}L</td>
                  <td className="p-4">
                    <select
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer outline-none transition-colors border ${
                        c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' :
                        c.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20' :
                        'bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20'
                      }`}
                      value={c.status}
                      onChange={(e) => {
                        const updatedStatus = e.target.value;
                        setCampaigns(campaigns.map(camp => camp.id === c.id ? { ...camp, status: updatedStatus } : camp));
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${t.isDark ? 'bg-orange-500/20 text-orange-500' : 'bg-amber-500/20 text-amber-600'}`}>
              <Megaphone size={24} />
            </div>
            <div>
              <h2 className={`text-xl font-black ${t.heading}`}>New Campaign</h2>
              <p className={`text-sm font-bold mt-0.5 ${t.muted}`}>Launch a new marketing initiative.</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div>
              <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Campaign Name</label>
              <input type="text" className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} placeholder="e.g. Winter Sale 2026" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Channel</label>
                <select className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  value={newCampaign.channel} onChange={e => setNewCampaign({...newCampaign, channel: e.target.value})}>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Instagram">Instagram</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Budget (₹)</label>
                <input type="number" className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                  value={newCampaign.budget} onChange={e => setNewCampaign({...newCampaign, budget: Number(e.target.value)})} min="0" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
            <button onClick={() => setCreateModalOpen(false)} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${t.muted} hover:bg-black/5 dark:hover:bg-white/5`}>Cancel</button>
            <button 
              onClick={() => {
                if (!newCampaign.name) return alert("Campaign Name is required");
                const campaignEntry = {
                  id: Date.now(),
                  name: newCampaign.name,
                  channel: newCampaign.channel,
                  budget: newCampaign.budget,
                  leads: 0,
                  converted: 0,
                  revenue: 0,
                  status: "Active"
                };
                setCampaigns([campaignEntry, ...campaigns]);
                setCreateModalOpen(false);
                setNewCampaign({ name: "", channel: "Facebook Ads", budget: 0, status: "Active" });
              }} 
              className={`px-6 py-2.5 rounded-xl font-black text-sm text-white shadow-lg transition-all ${t.isDark ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30' : 'bg-[#D4AF37] hover:bg-[#c4a133] shadow-[#D4AF37]/30'}`}
            >
              Launch Campaign
            </button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
}
