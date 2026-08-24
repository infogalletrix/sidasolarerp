import React, { useState } from "react";
import { Phone, PhoneCall, PhoneMissed, PhoneForwarded, Clock, CheckCircle, Plus, UploadCloud, FileText, AudioLines, FileAudio } from "lucide-react";
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

const initialDummyCalls = [
  { id: 1, customer: "Rahul Sharma", phone: "+91 9876543210", duration: "05:23", outcome: "Interested", date: "Today, 10:30 AM", type: "outbound", notes: "Customer is very interested in the 5kW Residential System. Mentioned they have a flat roof and high electricity bills in summer. Wants a callback tomorrow afternoon to discuss EMI options.", hasAudio: true },
  { id: 2, customer: "Priya Singh", phone: "+91 9123456789", duration: "02:15", outcome: "Call Later", date: "Today, 11:45 AM", type: "outbound", notes: "Was in a meeting. Asked to call back on the weekend.", hasAudio: false },
  { id: 3, customer: "Amit Patel", phone: "+91 9988776655", duration: "00:00", outcome: "Missed", date: "Yesterday, 04:20 PM", type: "missed", notes: "Ringing but no answer.", hasAudio: false },
  { id: 4, customer: "Neha Gupta", phone: "+91 9871234567", duration: "12:45", outcome: "Converted", date: "Yesterday, 02:10 PM", type: "inbound", notes: "Called regarding the WhatsApp campaign. Answered all technical queries about the monocrystalline panels. Ready to proceed, handed over to Sales Team for site visit.", hasAudio: true }
];

export default function TelecallingView() {
  const t = useThemeClasses();
  const [calls, setCalls] = useState(initialDummyCalls);
  
  // View Notes Modal State
  const [viewNotesOpen, setViewNotesOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  // New Call Modal State
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [callForm, setCallForm] = useState({
    customer: "",
    phone: "",
    outcome: "Interested",
    type: "outbound",
    notes: "",
    file: null
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Dashboard KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Calls Today", val: "45", icon: <Phone size={16}/>, color: "text-blue-500" },
          { label: "Connected", val: "32", icon: <PhoneCall size={16}/>, color: "text-emerald-500" },
          { label: "Follow-ups Scheduled", val: "12", icon: <Clock size={16}/>, color: "text-amber-500" },
          { label: "Missed", val: "5", icon: <PhoneMissed size={16}/>, color: "text-rose-500" }
        ].map((k, i) => (
          <div key={i} className={`${t.card} p-5 rounded-2xl`}>
            <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${k.color}`}>
              {k.icon} {k.label}
            </div>
            <div className={`text-3xl font-black ${t.heading}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Call List */}
      <div className={`${t.card} rounded-[2rem] overflow-hidden`}>
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className={`text-lg font-black ${t.heading}`}>Recent Calls</h2>
          <button 
            className={`px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center gap-2 ${t.isDark ? "bg-orange-600 hover:bg-orange-700" : "bg-[#D4AF37] hover:bg-[#c4a133]"}`}
            onClick={() => setLogModalOpen(true)}
          >
            <Plus size={16} /> Log New Call
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={t.tableHead}>
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date/Time</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Outcome</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {calls.map(c => (
                <tr key={c.id} className={`${t.tableRow} border-b border-[var(--border-color)]`}>
                  <td className={`p-4 font-bold ${t.heading}`}>{c.customer}</td>
                  <td className={`p-4 font-medium ${t.muted}`}>{c.phone}</td>
                  <td className="p-4">
                    {c.type === 'outbound' ? <PhoneForwarded size={16} className="text-blue-500"/> : 
                     c.type === 'inbound' ? <PhoneCall size={16} className="text-emerald-500"/> : 
                     <PhoneMissed size={16} className="text-rose-500"/>}
                  </td>
                  <td className={`p-4 font-medium ${t.muted}`}>{c.date}</td>
                  <td className={`p-4 font-medium ${t.muted}`}>{c.duration}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      c.outcome === 'Interested' ? 'bg-blue-500/10 text-blue-500' :
                      c.outcome === 'Call Later' ? 'bg-amber-500/10 text-amber-500' :
                      c.outcome === 'Missed' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {c.outcome}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      className="text-xs font-bold text-slate-400 hover:text-themed px-3 py-1.5 themed-card rounded-md border border-[var(--border-color)] hover:border-orange-500/30 transition-all flex items-center gap-1.5"
                      onClick={() => { setSelectedCall(c); setViewNotesOpen(true); }}
                    >
                      <FileText size={12} /> View Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log New Call Modal */}
      <Modal open={logModalOpen} onClose={() => setLogModalOpen(false)}>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${t.isDark ? 'bg-orange-500/20 text-orange-500' : 'bg-amber-500/20 text-amber-600'}`}>
              <PhoneCall size={24} />
            </div>
            <div>
              <h2 className={`text-xl font-black ${t.heading}`}>Log Call Details</h2>
              <p className={`text-sm font-bold mt-0.5 ${t.muted}`}>Record a new telecalling interaction.</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Customer Name</label>
                <input type="text" className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                  value={callForm.customer} onChange={e => setCallForm({...callForm, customer: e.target.value})} placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Phone Number</label>
                <input type="text" className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                  value={callForm.phone} onChange={e => setCallForm({...callForm, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Call Type</label>
                <select className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  value={callForm.type} onChange={e => setCallForm({...callForm, type: e.target.value})}>
                  <option value="outbound">Outbound Call</option>
                  <option value="inbound">Inbound Call</option>
                  <option value="missed">Missed Call</option>
                </select>
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Outcome</label>
                <select className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  value={callForm.outcome} onChange={e => setCallForm({...callForm, outcome: e.target.value})}>
                  <option value="Interested">Interested</option>
                  <option value="Call Later">Call Later</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Converted">Converted</option>
                  <option value="Missed">Missed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Upload Transcript / Audio (Optional)</label>
                <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-[var(--border-color)] rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <UploadCloud size={20} className={t.muted} />
                  <span className={`text-xs font-bold truncate max-w-[200px] ${t.muted}`}>{callForm.file ? callForm.file.name : "Select File"}</span>
                  <input type="file" className="hidden" accept=".pdf,.txt,.mp3,.wav" onChange={(e) => {
                    if (e.target.files.length > 0) setCallForm({...callForm, file: e.target.files[0]});
                  }} />
                </label>
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-1.5 block ${t.muted}`}>Call Notes</label>
                <textarea 
                  className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 h-[60px] resize-none"
                  placeholder="Summarize the discussion..."
                  value={callForm.notes}
                  onChange={e => setCallForm({...callForm, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
            <button onClick={() => setLogModalOpen(false)} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${t.muted} hover:bg-black/5 dark:hover:bg-white/5`}>Cancel</button>
            <button 
              onClick={() => {
                if (!callForm.customer) return alert("Customer Name is required");
                const newCall = {
                  id: Date.now(),
                  customer: callForm.customer,
                  phone: callForm.phone || "+91 0000000000",
                  duration: "03:45", // Mock duration
                  outcome: callForm.outcome,
                  date: "Just Now",
                  type: callForm.type,
                  notes: callForm.notes || "No notes provided.",
                  hasAudio: !!callForm.file
                };
                setCalls([newCall, ...calls]);
                setLogModalOpen(false);
                setCallForm({ customer: "", phone: "", outcome: "Interested", type: "outbound", notes: "", file: null });
              }} 
              className={`px-6 py-2.5 rounded-xl font-black text-sm text-white shadow-lg transition-all ${t.isDark ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30' : 'bg-[#D4AF37] hover:bg-[#c4a133] shadow-[#D4AF37]/30'}`}
            >
              Save Call Log
            </button>
          </div>
        </div>
      </Modal>

      {/* View Notes Modal */}
      <Modal open={viewNotesOpen} onClose={() => { setViewNotesOpen(false); setSelectedCall(null); }}>
        {selectedCall && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${t.isDark ? 'bg-orange-500/20 text-orange-500' : 'bg-amber-500/20 text-amber-600'}`}>
                <FileText size={24} />
              </div>
              <div>
                <h2 className={`text-xl font-black ${t.heading}`}>Call Notes</h2>
                <p className={`text-sm font-bold mt-0.5 ${t.muted}`}>{selectedCall.customer} • {selectedCall.date}</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${t.muted}`}>Notes Summary</label>
                <div className={`p-4 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5`}>
                  <p className={`text-sm font-medium leading-relaxed ${t.heading}`}>{selectedCall.notes}</p>
                </div>
              </div>

              {selectedCall.hasAudio && (
                <div>
                  <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${t.muted}`}>Call Recording</label>
                  <div className={`p-4 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 flex items-center gap-4`}>
                    <button className="p-3 bg-orange-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                      <FileAudio size={20} />
                    </button>
                    <div className="flex-1">
                      <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-orange-500 rounded-full" />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] font-black text-slate-400">
                        <span>01:14</span>
                        <span>{selectedCall.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-[var(--border-color)]">
              <button onClick={() => { setViewNotesOpen(false); setSelectedCall(null); }} className={`px-6 py-2.5 rounded-xl font-black text-sm transition-colors ${t.isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </motion.div>
  );
}
