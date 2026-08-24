import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileSignature, Download, User, Building, CheckCircle, Search, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PrintableAgreement from "../components/PrintableAgreement";
import { useDialog } from "../contexts/DialogContext";

const AgreementsPage = () => {
  const { showDialog } = useDialog();
  const [activeTab, setActiveTab] = useState("b2c");
  const [contacts, setContacts] = useState([]);
  
  const componentRef = React.useRef();

  // Navigation
  const [mainTab, setMainTab] = useState("create");
  const [agreements, setAgreements] = useState([]);

  // Shared Form State
  const [form, setForm] = useState({
    clientId: "",
    contractValue: "",
    paymentTerms: "30% Advance, 60% Material Delivery, 10% Commissioning",
    // B2C Specific
    systemCapacity: "",
    warrantyPeriod: "5 Years",
    // B2B Specific
    gstNumber: "",
    authorizedSignatory: "",
    designation: "",
    projectScope: "",
  });

  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Fetch CRM contacts to use in the dropdown
    fetch('/api/crm')
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(err => console.error("Error fetching contacts:", err));
  }, []);

  const showFeedbackMsg = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3000);
  };

  const fetchAgreements = async () => {
    try {
      const res = await fetch('/api/agreements');
      const data = await res.json();
      setAgreements(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (mainTab === "history") {
      fetchAgreements();
    }
  }, [mainTab]);

  const handleSave = async () => {
    if (!form.clientId) {
      showDialog({ title: "Error", message: "Please select a client first.", type: "alert" });
      return false;
    }
    const client = contacts.find(c => c.id.toString() === form.clientId.toString());
    const payload = {
      type: activeTab.toUpperCase(),
      clientId: client.id,
      clientName: client.organizationName || client.name,
      contractValue: parseFloat(form.contractValue) || 0,
      paymentTerms: form.paymentTerms,
      systemCapacity: form.systemCapacity,
      warrantyPeriod: form.warrantyPeriod,
      gstNumber: form.gstNumber,
      authorizedSignatory: form.authorizedSignatory,
      designation: form.designation,
      projectScope: form.projectScope
    };

    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showFeedbackMsg("Agreement generated and saved successfully!");
        return true;
      } else {
        showDialog({ title: "Error", message: "Failed to save agreement.", type: "alert" });
        return false;
      }
    } catch (err) {
      showDialog({ title: "Error", message: "Network error saving agreement.", type: "alert" });
      return false;
    }
  };

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  const handleGenerateAndPrint = async () => {
    const saved = await handleSave();
    if (saved) {
      handlePrint();
    }
  };

  const selectedClient = contacts.find(c => c.id.toString() === form.clientId.toString());

  return (
    <div className="p-4 md:p-6 page-wrapper">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full dark:bg-emerald-600/15 bg-emerald-300/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full dark:bg-indigo-600/10 bg-indigo-200/10 blur-[120px]" />
      </div>

      {/* HEADER & TABS */}
      <div className="flex flex-col mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <FileSignature size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-themed tracking-tight">Agreements</h1>
            <p className="text-muted font-bold text-sm">Generate B2C Residential and B2B Commercial Contracts.</p>
          </div>
        </div>

        <div className="flex bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border-color)] shadow-sm w-fit mt-2">
          <button 
            onClick={() => setMainTab("create")} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mainTab === "create" ? "dark:bg-emerald-600 bg-emerald-500 text-white shadow-md" : "text-muted hover:text-themed"}`}
          >
            <FileSignature size={16} /> New Agreement
          </button>
          <button 
            onClick={() => setMainTab("history")} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mainTab === "history" ? "dark:bg-indigo-600 bg-indigo-500 text-white shadow-md" : "text-muted hover:text-themed"}`}
          >
            <Search size={16} /> Agreement History
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {mainTab === "create" ? (
      <div className="themed-card rounded-[2.5rem] shadow-2xl p-6 lg:p-8">
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-black text-themed">
              {activeTab === "b2c" ? "Residential Solar Agreement Setup" : "Commercial/Enterprise Agreement Setup"}
            </h2>
            <div className="flex bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-color)]">
              <button 
                onClick={() => { setActiveTab("b2c"); setForm({...form, clientId: ""}); }} 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "b2c" ? "bg-slate-200 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400" : "text-muted"}`}
              >
                <User size={14} /> B2C
              </button>
              <button 
                onClick={() => { setActiveTab("b2b"); setForm({...form, clientId: ""}); }} 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "b2b" ? "bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400" : "text-muted"}`}
              >
                <Building size={14} /> B2B
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">
                Select {activeTab === "b2c" ? "Customer" : "Company"}
              </label>
              <select 
                className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                value={form.clientId}
                onChange={e => setForm({...form, clientId: e.target.value})}
              >
                <option value="">-- Choose from CRM --</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {activeTab === "b2b" ? (c.organizationName || c.name) : c.name} {c.project ? `(${c.project})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* COMMON FIELDS */}
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Total Contract Value (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 500000"
                className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={form.contractValue}
                onChange={e => setForm({...form, contractValue: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Payment Terms</label>
              <input 
                type="text"
                className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={form.paymentTerms}
                onChange={e => setForm({...form, paymentTerms: e.target.value})}
              />
            </div>

            {/* B2C SPECIFIC FIELDS */}
            {activeTab === "b2c" && (
              <>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">System Capacity</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5 kW On-Grid"
                    className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={form.systemCapacity}
                    onChange={e => setForm({...form, systemCapacity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Warranty Period</label>
                  <input 
                    type="text"
                    className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={form.warrantyPeriod}
                    onChange={e => setForm({...form, warrantyPeriod: e.target.value})}
                  />
                </div>
              </>
            )}

            {/* B2B SPECIFIC FIELDS */}
            {activeTab === "b2b" && (
              <>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">GST Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={form.gstNumber}
                    onChange={e => setForm({...form, gstNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Authorized Signatory Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Director Name"
                    className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={form.authorizedSignatory}
                    onChange={e => setForm({...form, authorizedSignatory: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Signatory Designation</label>
                  <input 
                    type="text"
                    placeholder="e.g. Managing Director"
                    className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={form.designation}
                    onChange={e => setForm({...form, designation: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Project Scope Description</label>
                  <textarea 
                    rows={3}
                    placeholder="e.g. EPC of 500kWp rooftop solar plant..."
                    className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                    value={form.projectScope}
                    onChange={e => setForm({...form, projectScope: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex justify-end gap-3">
            <button 
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md text-white ${activeTab === 'b2c' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            >
              <FileSignature size={16} /> Generate
            </button>
            <button 
              onClick={handleGenerateAndPrint}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl text-white hover:-translate-y-1 ${activeTab === 'b2c' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'}`}
            >
              <Download size={16} /> Generate & Print
            </button>
          </div>

          {/* Hidden Printable Component */}
          <div style={{ display: "none" }}>
            <PrintableAgreement
              ref={componentRef}
              activeTab={activeTab}
              client={selectedClient}
              form={form}
            />
          </div>
        </div>
      </div>
      ) : (
        <div className="themed-card rounded-[2.5rem] shadow-2xl p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-black text-themed">Agreement History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--bg-surface)] text-muted font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Agreement No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3 text-right">Value (₹)</th>
                  <th className="px-4 py-3 rounded-r-xl text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {agreements.map((agr) => (
                  <tr key={agr.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="px-4 py-3 font-bold text-themed">{agr.agreementNo}</td>
                    <td className="px-4 py-3 font-medium">{new Date(agr.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${agr.type === 'B2C' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'}`}>
                        {agr.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-themed">{agr.clientName}</td>
                    <td className="px-4 py-3 font-black text-amber-600 dark:text-amber-400 text-right">{agr.contractValue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {agr.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {agreements.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-muted font-medium italic">
                      No agreements found in history.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FEEDBACK TOAST */}
      {feedback && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold border border-stone-700">
          <CheckCircle size={20} className="text-emerald-200" />{feedback}
        </motion.div>
      )}

    </div>
  );
};

export default AgreementsPage;
