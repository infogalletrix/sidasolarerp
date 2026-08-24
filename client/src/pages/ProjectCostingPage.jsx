import React, { useState, useEffect } from "react";
import { Calculator, Download, CheckCircle, Zap, Cpu, Frame, Sliders, ArrowRight, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProjectCostingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'

  const [projectTitle, setProjectTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [systemCapacity, setSystemCapacity] = useState("10"); // kW
  
  // Quick Estimate Inputs
  const [panelType, setPanelType] = useState("Monocrystalline PERC");
  const [inverterType, setInverterType] = useState("String Inverter");
  const [structureType, setStructureType] = useState("Standard Rooftop");

  // Cost items state
  const [items, setItems] = useState([]);
  const [feedback, setFeedback] = useState("");

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('costingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-calculate estimate whenever inputs change
  useEffect(() => {
    const capacity = parseFloat(systemCapacity) || 0;
    
    // Base Rates per kW
    let panelRate = 22000;
    if (panelType === "Bifacial (DCR)") panelRate = 25000;
    if (panelType === "Polycrystalline") panelRate = 18000;

    let inverterRate = 8000;
    if (inverterType === "Microinverter") inverterRate = 12000;
    if (inverterType === "Hybrid Inverter") inverterRate = 15000;

    let structureRate = 3000;
    if (structureType === "Elevated Structure") structureRate = 6000;
    if (structureType === "Ground Mount") structureRate = 4500;

    const bosRate = 5000; // Balance of System (cables, connectors, earthing)
    const installRate = 4000; // Installation & Commissioning

    setItems([
      { id: 1, category: "Solar PV Modules", description: `${panelType} Panels`, unit: "kW", qty: capacity, rate: panelRate, total: capacity * panelRate },
      { id: 2, category: "Inverter System", description: `${inverterType}`, unit: "kW", qty: capacity, rate: inverterRate, total: capacity * inverterRate },
      { id: 3, category: "Mounting Structure", description: `${structureType}`, unit: "kW", qty: capacity, rate: structureRate, total: capacity * structureRate },
      { id: 4, category: "Balance of System (BOS)", description: "AC/DC Cables, Earthing, LA, DBs", unit: "kW", qty: capacity, rate: bosRate, total: capacity * bosRate },
      { id: 5, category: "Installation & Setup", description: "Design, Installation, Commissioning", unit: "kW", qty: capacity, rate: installRate, total: capacity * installRate },
    ]);
  }, [systemCapacity, panelType, inverterType, structureType]);

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'rate') {
          newItem.total = (parseFloat(newItem.qty) || 0) * (parseFloat(newItem.rate) || 0);
        }
        return newItem;
      }
      return item;
    }));
  };

  const totalCost = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const costPerKw = (parseFloat(systemCapacity) || 1) > 0 ? totalCost / parseFloat(systemCapacity) : 0;

  const handleSave = () => {
    const newEstimate = {
      id: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      customer: customerName || "Unnamed Customer",
      capacity: systemCapacity,
      totalCost: totalCost,
      costPerKw: costPerKw,
      panelType,
      inverterType,
      structureType
    };
    
    const updatedHistory = [newEstimate, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('costingHistory', JSON.stringify(updatedHistory));
    
    setFeedback("Estimate saved to history!");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleCreateQuotation = () => {
    const quoteData = {
      clientName: customerName,
      systemCapacityKW: systemCapacity,
      projectTitle: projectTitle || `${systemCapacity}kW Solar Plant`,
      proposalTitle: `PROPOSAL FOR ${systemCapacity}KW SOLAR POWER PLANT`,
      projectType: "Grid-Tie",
      installationType: "Rooftop",
      items: items.map(i => ({
        id: Date.now() + Math.random(),
        description: i.description,
        unit: i.unit,
        area: i.qty,
        rate: i.rate,
        amount: i.total
      }))
    };
    
    // Save as new session in quotations
    const existingSessions = JSON.parse(localStorage.getItem('quotation_sessions') || "[]");
    if (existingSessions.length === 0) {
      existingSessions.push({ id: 'default', title: 'New Quote', data: null });
    }
    
    const newSessionId = `quote_${Date.now()}`;
    existingSessions.push({
      id: newSessionId,
      title: `${customerName || 'New'} Estimate`,
      data: quoteData
    });
    
    localStorage.setItem('quotation_sessions', JSON.stringify(existingSessions));
    localStorage.setItem('active_quotation_session', newSessionId);
    
    navigate('/quotations');
  };

  return (
    <div className="p-4 md:p-6 page-wrapper">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full dark:bg-amber-600/10 bg-amber-300/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full dark:bg-emerald-600/10 bg-emerald-200/10 blur-[120px]" />
      </div>

      <div className="flex flex-col mb-6 gap-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
              <Calculator size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-themed tracking-tight">Project Costing</h1>
              <p className="text-muted font-bold text-sm">Generate automatic estimates for clients by providing quick inputs.</p>
            </div>
          </div>
          
          <div className="flex bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)]">
            <button 
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-amber-500 text-white shadow-md' : 'text-muted hover:text-themed'}`}
            >
              <Calculator size={16} /> New Estimate
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-amber-500 text-white shadow-md' : 'text-muted hover:text-themed'}`}
            >
              <History size={16} /> History
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'new' && (
          <motion.div key="new" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* QUICK INPUTS PANEL */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="themed-card rounded-2xl shadow-xl p-5 border border-[var(--border-color)]">
            <div className="flex items-center gap-2 mb-4 text-themed">
              <Sliders size={18} className="text-amber-500"/>
              <h2 className="font-black text-lg">Quick Inputs</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Customer / Lead</label>
                <input 
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  className="themed-input w-full border border-[var(--border-color)] rounded-xl p-2.5 text-sm font-bold"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">System Capacity (kW)</label>
                <div className="relative">
                  <input 
                    type="number"
                    className="themed-input w-full border border-[var(--border-color)] rounded-xl p-2.5 pl-10 text-xl font-black text-amber-600 dark:text-amber-400"
                    value={systemCapacity}
                    onChange={(e) => setSystemCapacity(e.target.value)}
                  />
                  <Zap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Solar PV Modules</label>
                <select 
                  className="themed-input w-full border border-[var(--border-color)] rounded-xl p-2.5 text-sm font-bold"
                  value={panelType}
                  onChange={(e) => setPanelType(e.target.value)}
                >
                  <option>Polycrystalline</option>
                  <option>Monocrystalline PERC</option>
                  <option>Bifacial (DCR)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Inverter System</label>
                <select 
                  className="themed-input w-full border border-[var(--border-color)] rounded-xl p-2.5 text-sm font-bold"
                  value={inverterType}
                  onChange={(e) => setInverterType(e.target.value)}
                >
                  <option>String Inverter</option>
                  <option>Microinverter</option>
                  <option>Hybrid Inverter</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mounting Structure</label>
                <select 
                  className="themed-input w-full border border-[var(--border-color)] rounded-xl p-2.5 text-sm font-bold"
                  value={structureType}
                  onChange={(e) => setStructureType(e.target.value)}
                >
                  <option>Standard Rooftop</option>
                  <option>Elevated Structure</option>
                  <option>Ground Mount</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="themed-card rounded-2xl shadow-xl p-5 border border-[var(--border-color)] bg-amber-500/5">
             <div className="flex justify-between items-end">
               <div>
                 <span className="text-[11px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest block">Cost Per kW</span>
                 <span className="text-2xl font-black text-themed">₹{costPerKw.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
               </div>
               <div className="p-2 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                 <Calculator size={20} />
               </div>
             </div>
          </div>
        </div>

        {/* ESTIMATE BREAKDOWN */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="themed-card rounded-2xl shadow-xl p-5 border border-[var(--border-color)] h-full flex flex-col">
            
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-black text-lg text-themed">Auto-Calculated Estimate</h2>
               <div className="text-xs font-bold text-muted bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[var(--border-color)]">
                 Dynamic breakdown based on {systemCapacity || 0}kW
               </div>
            </div>

            <div className="flex-grow overflow-x-auto rounded-xl border border-[var(--border-color)] mb-4">
              <table className="w-full text-sm text-left">
                <thead className="bg-[var(--bg-main)] text-muted font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3 py-2 w-1/4">Component</th>
                    <th className="px-3 py-2">Details</th>
                    <th className="px-3 py-2 w-20 text-center">Qty (kW)</th>
                    <th className="px-3 py-2 w-24 text-right">Rate (₹)</th>
                    <th className="px-3 py-2 w-28 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                      <td className="px-3 py-2 font-bold text-themed text-[11px] uppercase tracking-wider">{item.category}</td>
                      <td className="px-3 py-2">
                        <input 
                          type="text"
                          className="bg-transparent w-full text-xs font-bold text-muted outline-none focus:border-b focus:border-amber-500"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input 
                          type="number"
                          className="bg-transparent w-full text-xs font-bold text-center outline-none"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input 
                          type="number"
                          className="bg-transparent w-full text-xs font-bold text-right outline-none"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-black text-amber-600 dark:text-amber-400">
                        {item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-auto border-t border-[var(--border-color)] pt-4">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
                  <Download size={14} /> Export CSV
                </button>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Estimated Cost</span>
                <span className="text-4xl font-black text-amber-600 dark:text-amber-400 tracking-tight">₹{totalCost.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2 w-full">
              <button 
                onClick={handleSave}
                className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-xl text-white hover:-translate-y-0.5 bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
              >
                <CheckCircle size={16} /> Save Estimate
              </button>
              <button 
                onClick={handleCreateQuotation}
                className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Create Quotation <ArrowRight size={16} />
              </button>
            </div>
            
          </div>
        </div>

      </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="themed-card rounded-2xl shadow-xl p-6 border border-[var(--border-color)]">
          <h2 className="font-black text-xl text-themed mb-4">Saved Estimates</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--bg-main)] text-muted font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Estimate ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">System Details</th>
                  <th className="px-4 py-3 text-right">Total Cost (₹)</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {history.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 font-bold text-muted">No saved estimates found.</td></tr>
                ) : (
                  history.map((est) => (
                    <tr key={est.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                      <td className="px-4 py-3 font-black text-amber-500">{est.id}</td>
                      <td className="px-4 py-3 font-bold text-muted">{est.date}</td>
                      <td className="px-4 py-3 font-bold text-themed">{est.customer}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-themed">{est.capacity}kW System</div>
                        <div className="text-[10px] text-muted">{est.panelType} • {est.inverterType}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-amber-600 dark:text-amber-400">
                        {est.totalCost.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="px-3 py-1 bg-[var(--bg-main)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-xs font-bold transition-all">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {feedback && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold border border-stone-700">
          <CheckCircle size={20} className="text-emerald-200" />{feedback}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectCostingPage;
