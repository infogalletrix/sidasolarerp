import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  User, Briefcase, Calendar, Plus, Phone, MapPin, Search, DollarSign,
  TrendingUp, Activity, Star, CheckCircle, Clock, Mail, Tag, Percent,
  CheckSquare, BarChart2, Download, Filter, PieChart, Trash2, FileText,
  AlertCircle, List, Grid, Edit3, PhoneCall, Megaphone, Brain, Zap, ScanText, FileSignature, ChevronDown, Eye
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useDialog } from "../contexts/DialogContext";
import NotificationWidget from "../components/NotificationWidget";
import TelecallingView from "../components/TelecallingView";
import CampaignsView from "../components/CampaignsView";
import SiteSurveysView from "../components/SiteSurveysView";

// Light Premium Modal
function Modal({ open, onClose, children, size = "max-w-lg" }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={`themed-modal rounded-[2rem] shadow-2xl p-8 w-full ${size} relative max-h-[90vh] overflow-y-auto custom-scrollbar`}>
          <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-red-400 text-3xl leading-none transition-colors">&times;</button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const CRMPage = () => {
  const { showDialog } = useDialog();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "contacts";
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  
  // Pipeline Date Filters
  const [dateFilter, setDateFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [contacts, setContacts] = useState([]);
  const [pipeline, setPipeline] = useState({
    NEW: { id: "NEW", title: "NEW ENQUIRIES", deals: [] },
    CONTACTED: { id: "CONTACTED", title: "CONTACTED", deals: [] },
    SITE_VISIT: { id: "SITE_VISIT", title: "SITE VISIT PENDING", deals: [] },
    PROPOSAL: { id: "PROPOSAL", title: "PROPOSALS SENT", deals: [] },
    NEGOTIATION: { id: "NEGOTIATION", title: "NEGOTIATING", deals: [] },
    WON: { id: "WON", title: "ORDERS WON", deals: [] },
    LOST: { id: "LOST", title: "LOST", deals: [] },
  });
  const [activities, setActivities] = useState([]);

  const [editContact, setEditContact] = useState(null);
  const [editDeal, setEditDeal] = useState(null);
  const [editActivity, setEditActivity] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [selectedDocClient, setSelectedDocClient] = useState("");
  const [docSearchTerm, setDocSearchTerm] = useState("");
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  
  // Document Upload State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [fileNameInput, setFileNameInput] = useState("");
  const [clientDocs, setClientDocs] = useState({});
  
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [docToRename, setDocToRename] = useState(null);
  const [renameInput, setRenameInput] = useState("");

  const loadData = async () => {
    try {
      const [cRes, dRes, aRes] = await Promise.all([
        fetch('/api/crm').then(res => res.json()),
        fetch('/api/crm/deals/all').then(res => res.json()),
        fetch('/api/crm/activities/all').then(res => res.json()),
      ]);
      setContacts(cRes);
      
      const newPipe = {
        NEW: { id: "NEW", title: "NEW ENQUIRIES", deals: [] },
        CONTACTED: { id: "CONTACTED", title: "CONTACTED", deals: [] },
        SITE_VISIT: { id: "SITE_VISIT", title: "SITE VISIT PENDING", deals: [] },
        PROPOSAL: { id: "PROPOSAL", title: "PROPOSALS SENT", deals: [] },
        NEGOTIATION: { id: "NEGOTIATION", title: "NEGOTIATING", deals: [] },
        WON: { id: "WON", title: "ORDERS WON", deals: [] },
        LOST: { id: "LOST", title: "LOST", deals: [] },
      };
      dRes.forEach(d => {
        const stage = d.stage || "NEW";
        if(newPipe[stage]) {
          newPipe[stage].deals.push({ id: d.id, contactId: d.contact_id, title: d.title, value: Number(d.value), closeDate: d.close_date ? d.close_date.split('T')[0] : '' });
        }
      });
      setPipeline(newPipe);
      setActivities(aRes.map(a => ({ id: a.id, type: a.type, date: a.date ? a.date.split('T')[0] : '', client: a.client, status: a.status })));
    } catch(err) {
      console.error(err);
    }
  };

  React.useEffect(() => { loadData(); }, []);

  const showFeedback = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(""), 2500); };

  const handleContactSave = async (updated) => {
    try {
      let isNew = !updated.id;
      if (isNew) {
        updated.id = `c${Date.now()}`;
        updated.date = new Date().toISOString().split('T')[0];
        await fetch('/api/crm', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updated) });
      } else {
        await fetch(`/api/crm/${updated.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updated) });
      }

      // Auto-schedule follow-up if date is provided (simple MVP auto-creation)
      if (updated.nextFollowUpDate) {
        const activity = {
          id: `act-${Date.now()}`,
          type: 'Follow-up Call',
          date: updated.nextFollowUpDate.split('T')[0],
          client: updated.name, // Using name instead of ID so it shows up nicely in the Schedule UI
          status: 'Pending'
        };
        // We do a POST to activities. If one already exists for this exact date/client, 
        // a robust backend would handle deduplication. For now we just push it.
        await fetch('/api/crm/activities', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(activity) });
      }

      loadData();
      setEditContact(null); showFeedback(isNew ? "Client added & follow-up scheduled!" : "Client profile saved successfully");
    } catch(err) { showFeedback("Error saving"); }
  };

  const handleDealSave = async (updated) => {
    try {
      if (!updated.id) {
        updated.id = `deal-${Date.now()}`;
        updated.stage = "NEW";
        await fetch('/api/crm/deals', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...updated, closeDate: updated.closeDate}) });
      } else {
        // Find existing stage to keep it
        let stage = "NEW";
        for (const [key, col] of Object.entries(pipeline)) {
          if(col.deals.some(d => d.id === updated.id)) stage = key;
        }
        await fetch(`/api/crm/deals/${updated.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...updated, closeDate: updated.closeDate, stage}) });
      }
      loadData();
      setEditDeal(null); showFeedback("Project deal saved successfully");
    } catch(err) { showFeedback("Error saving"); }
  };

  const handleActivitySave = async (updated) => {
    try {
      if (!updated.id) {
        await fetch('/api/crm/activities', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updated) });
      } else {
        await fetch(`/api/crm/activities/${updated.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updated) });
      }
      loadData();
      setEditActivity(null); showFeedback("Activity tracked successfully");
    } catch(err) { showFeedback("Error saving"); }
  };

  const completeActivity = async (act) => {
    try {
      await fetch(`/api/crm/activities/${act.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...act, status: 'Completed'}) });
      loadData(); showFeedback("Activity marked as completed");
    } catch(err) { showFeedback("Error completing activity"); }
  };

  const deleteActivity = (id) => {
    showDialog({
      title: "Delete Activity",
      message: "Are you sure you want to delete this activity?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await fetch(`/api/crm/activities/${id}`, { method: 'DELETE' });
          loadData(); showFeedback("Activity deleted");
        } catch(err) { showFeedback("Error deleting activity"); }
      }
    });
  };

  const deleteContact = (id) => {
    showDialog({
      title: "Delete Client",
      message: "Are you sure you want to delete this client profile? Associated data might be affected.",
      type: "confirm",
      onConfirm: async () => {
        try {
          await fetch(`/api/crm/${id}`, { method: 'DELETE' });
          loadData(); showFeedback("Client profile deleted");
        } catch(err) { showFeedback("Error deleting client"); }
      }
    });
  };

  const convertToCustomer = async (contact) => {
    const updatedTags = contact.tags ? [...contact.tags] : [];
    if (!updatedTags.includes("Customer")) updatedTags.push("Customer");
    const updatedContact = { ...contact, tags: updatedTags };
    
    try {
      await fetch(`/api/crm/${updatedContact.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(updatedContact) });
      loadData(); 
      showFeedback(`${contact.name} converted to Customer!`);
    } catch(err) { 
      showFeedback("Error converting to customer"); 
    }
  };

  const deleteDeal = (id) => {
    showDialog({
      title: "Delete Deal",
      message: "Are you sure you want to delete this deal? Quotations linked to this deal will also be removed.",
      type: "confirm",
      onConfirm: async () => {
        try {
          await fetch(`/api/crm/deals/${id}`, { method: 'DELETE' });
          loadData(); showFeedback("Deal deleted successfully");
        } catch(err) { showFeedback("Error deleting deal"); }
      }
    });
  };

  // --- ADVANCED METRICS (Removed Probability Weighted) ---
  const { totalValue, wonValue, activeCount } = useMemo(() => {
    let t = 0, won = 0, count = 0;
    Object.values(pipeline).forEach((col) => {
      col.deals.forEach((d) => {
        let include = true;
        if (dateFilter !== "All") {
          if (!d.closeDate) {
             include = false;
          } else {
            const dealDate = new Date(d.closeDate);
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const fiscalYearStart = currentMonth >= 3 ? currentYear : currentYear - 1;
            
            if (dateFilter === "This Month") {
              include = dealDate.getFullYear() === currentYear && dealDate.getMonth() === currentMonth;
            } else if (dateFilter === "Last Month") {
              const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
              const year = currentMonth === 0 ? currentYear - 1 : currentYear;
              include = dealDate.getFullYear() === year && dealDate.getMonth() === lastMonth;
            } else if (dateFilter === "Financial Year") {
              const start = new Date(fiscalYearStart, 3, 1);
              const end = new Date(fiscalYearStart + 1, 2, 31);
              include = dealDate >= start && dealDate <= end;
            } else if (dateFilter === "Custom") {
              if (customStart && customEnd) {
                include = dealDate >= new Date(customStart) && dealDate <= new Date(customEnd);
              }
            }
          }
        }
        
        if (include && d.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          t += d.value;
          if (col.id === 'WON') won += d.value;
          else if (col.id !== 'LOST') { count++; }
        }
      });
    });
    return { totalValue: t, wonValue: won, activeCount: count };
  }, [pipeline, dateFilter, customStart, customEnd, searchTerm]);

  // --- EXPORT TO PDF ---
  const exportContactsToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold"); doc.setFontSize(20);
    doc.text("Sida Solar - Client List", 14, 22);
    const tableColumn = ["Name", "Project", "Phone", "Status", "Source"];
    const tableRows = contacts.map(c => [c.name, c.project, c.phone, c.status, c.source || "N/A"]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30, theme: 'grid', headStyles: { fillColor: [41, 37, 36] } });
    doc.save("clients_report.pdf");
    showFeedback("PDF Report Exported!");
  };

  // Filters
  const baseContacts = contacts.filter(c => {
    const isCustomer = c.tags && c.tags.includes("Customer");
    return activeTab === "contacts" ? isCustomer : !isCustomer;
  });
  const filteredContacts = baseContacts.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.project || "").toLowerCase().includes(searchTerm.toLowerCase()) || (c.tags && c.tags.join(" ").toLowerCase().includes(searchTerm.toLowerCase())));
  const filteredActivities = activities.filter((a) => {
    const clientName = contacts.find(c => c.id === a.client)?.name || "";
    return clientName.toLowerCase().includes(searchTerm.toLowerCase()) || a.type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const sourceCol = pipeline[source.droppableId];
    const destCol = pipeline[destination.droppableId];
    const sourceDeals = [...sourceCol.deals];
    const destDeals = [...destCol.deals];
    
    const realSourceIndex = sourceDeals.findIndex(d => d.id === result.draggableId);
    if (realSourceIndex === -1) return;
    const [movedDeal] = sourceDeals.splice(realSourceIndex, 1);
    
    if (source.droppableId === destination.droppableId) {
      sourceDeals.splice(destination.index, 0, movedDeal);
      setPipeline({ ...pipeline, [source.droppableId]: { ...sourceCol, deals: sourceDeals } });
    } else {
      destDeals.splice(destination.index, 0, movedDeal);
      setPipeline({ ...pipeline, [source.droppableId]: { ...sourceCol, deals: sourceDeals }, [destination.droppableId]: { ...destCol, deals: destDeals } });
      
      // Update in DB
      try {
        await fetch(`/api/crm/deals/${movedDeal.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({...movedDeal, stage: destination.droppableId})
        });
      } catch (e) {
        console.error("Failed to update deal stage", e);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 page-wrapper">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full dark:bg-orange-600/15 bg-orange-300/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full dark:bg-amber-600/10 bg-amber-200/10 blur-[120px]" />
      </div>

      {/* HEADER & TABS */}
      <div className="flex flex-col mb-4 gap-3">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full relative z-50">
          
          {/* TABS (Left) */}
          <div className="flex w-full md:w-auto gap-1 p-1 rounded-xl border border-[var(--border-color)] themed-card shadow-sm overflow-x-auto order-2 lg:order-1">
            {[
              { id: "leads", label: "Leads", icon: <User size={14} /> },
              { id: "contacts", label: "Customers", icon: <User size={14} /> },
              { id: "deals", label: "Pipeline", icon: <Briefcase size={14} /> },
              { id: "site-surveys", label: "Site Surveys", icon: <MapPin size={14} /> },
              { id: "activities", label: "Schedule", icon: <Calendar size={14} /> },
              { id: "documents", label: "Document Vault", icon: <FileText size={14} /> },
              { id: "telecalling", label: "Telecalling", icon: <PhoneCall size={14} /> },
              { id: "campaigns", label: "Campaigns", icon: <Megaphone size={14} /> },
            ].map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }} className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? "dark:bg-orange-600 bg-[#D4AF37] text-white shadow-md" : "text-muted hover:text-themed hover:bg-[var(--bg-card-hover)]"}`}>
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* SEARCH BAR (Middle) */}
          <div className="relative w-full lg:w-96 group shadow-sm rounded-xl order-1 lg:order-2 flex-1 max-w-xl flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-themed transition-colors" size={16} />
              <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-color)] themed-input text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            
            {(activeTab === "deals" || activeTab === "insights" || activeTab === "leads" || activeTab === "contacts") && (
              <select 
                className="w-36 rounded-xl border border-[var(--border-color)] themed-input text-sm focus:ring-2 focus:ring-orange-500 outline-none px-2 cursor-pointer font-bold"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="All">All Time</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Financial Year">Financial Year</option>
                <option value="Custom">Custom...</option>
              </select>
            )}
          </div>

          {/* ADD BUTTON (Right) */}
          <div className="flex w-full md:w-auto order-3 gap-3 items-center">
            {activeTab !== 'telecalling' && activeTab !== 'documents' && activeTab !== 'campaigns' && activeTab !== 'site-surveys' && (
              <button onClick={() => { if (activeTab === "contacts" || activeTab === "leads") setEditContact({ status: 'Cold', tags: [] }); else if (activeTab === "deals") setEditDeal({ value: 0, contactId: contacts[0]?.id || '' }); else setEditActivity({ type: '', date: new Date().toISOString().split('T')[0], client: contacts[0]?.id || '', status: 'Pending' }); }} className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 dark:bg-orange-700 bg-[#D4AF37] text-white shadow-lg dark:hover:bg-slate-800 hover:bg-[#c4a133]">
                <Plus size={16} /> <span className="hidden sm:inline">Add New</span>
              </button>
            )}
            <NotificationWidget />
          </div>

        </motion.div>
        
        {/* Custom Date Picker Row */}
        {(activeTab === "deals" || activeTab === "insights") && dateFilter === "Custom" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex justify-center md:justify-end gap-3 mt-1 px-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">From</label>
              <input type="date" className="themed-input border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs outline-none" value={customStart} onChange={e => setCustomStart(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">To</label>
              <input type="date" className="themed-input border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs outline-none" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
            </div>
          </motion.div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="themed-card rounded-[2.5rem] shadow-2xl min-h-[500px] overflow-visible">
        
        {/* SECTION: DEALS (KANBAN) */}
        {activeTab === "deals" && (
          <div className="p-4 sm:p-5 overflow-x-auto w-full">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex flex-row gap-2 sm:gap-3 w-full min-w-[1200px]">
                {Object.values(pipeline).map((column) => (
                  <div key={column.id} className="flex-1 min-w-0 flex flex-col themed-card rounded-[1.25rem] p-2 sm:p-3">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-3 gap-1">
                      <h3 className="text-[9px] sm:text-[10px] font-black text-slate-500 tracking-widest uppercase truncate">{column.title}</h3>
                      <span className="themed-card text-muted border border-[var(--border-color)] text-[10px] font-black px-2 py-0.5 rounded-md self-start xl:self-auto">{column.deals.length}</span>
                    </div>
                    <Droppable droppableId={column.id} renderClone={(provided, snapshot, rubric) => {
                      const deal = column.deals[rubric.source.index];
                      const contact = contacts.find((c) => c.id === deal.contactId);
                      return (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style, zIndex: 9999, margin: 0}} className="themed-card p-2.5 sm:p-3 rounded-xl border shadow-2xl border-orange-500/50 scale-[1.02] rotate-1 opacity-90 flex flex-col gap-1.5">
                          <div className="flex justify-between items-start gap-2 mb-0.5">
                            <h4 className="font-black text-themed text-xs sm:text-sm leading-snug line-clamp-2">{deal.title}</h4>
                            <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                              ₹{(deal.value/100000).toFixed(2)}L
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5 mb-1">
                            <p className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-1.5"><User size={10} /> {contact?.name || 'Unknown'}</p>
                            <p className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-1.5"><Phone size={10} /> {contact?.phone || 'N/A'}</p>
                          </div>
                          <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center mt-auto">
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 truncate"><Clock size={10} /> {new Date(deal.closeDate).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</span>
                          </div>
                        </div>
                      );
                    }}>
                      {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 min-h-[300px] rounded-[1rem] transition-colors ${snapshot.isDraggingOver ? "bg-orange-500/10 border-2 border-dashed border-orange-500/40 p-1" : ""}`}>
                          {column.deals.filter((d) => {
                            if (dateFilter === "All") return true;
                            if (!d.closeDate) return false;
                            
                            const dealDate = new Date(d.closeDate);
                            const now = new Date();
                            const currentYear = now.getFullYear();
                            const currentMonth = now.getMonth();
                            const fiscalYearStart = currentMonth >= 3 ? currentYear : currentYear - 1;
                            
                            if (dateFilter === "This Month") {
                              return dealDate.getFullYear() === currentYear && dealDate.getMonth() === currentMonth;
                            } else if (dateFilter === "Last Month") {
                              const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                              const year = currentMonth === 0 ? currentYear - 1 : currentYear;
                              return dealDate.getFullYear() === year && dealDate.getMonth() === lastMonth;
                            } else if (dateFilter === "Financial Year") {
                              const start = new Date(fiscalYearStart, 3, 1);
                              const end = new Date(fiscalYearStart + 1, 2, 31);
                              return dealDate >= start && dealDate <= end;
                            } else if (dateFilter === "Custom") {
                              if (!customStart || !customEnd) return true;
                              return dealDate >= new Date(customStart) && dealDate <= new Date(customEnd);
                            }
                            return true;
                          }).filter((d) => d.title.toLowerCase().includes(searchTerm.toLowerCase())).map((deal, index) => {
                            const contact = contacts.find((c) => c.id === deal.contactId);

                            return (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style, zIndex: snapshot.isDragging ? 9999 : "auto"}} className={`themed-card p-2.5 sm:p-3 rounded-xl border mb-2.5 flex flex-col gap-1.5 ${snapshot.isDragging ? "shadow-2xl border-orange-500/50 scale-[1.02] rotate-1 opacity-90" : "shadow-sm hover:border-orange-500/30 hover:shadow-md transition-all"}`}>
                                    <div className="flex justify-between items-start gap-2 mb-0.5">
                                      <h4 className="font-black text-themed text-xs sm:text-sm leading-snug line-clamp-2">{deal.title}</h4>
                                      <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                                        ₹{(deal.value/100000).toFixed(2)}L
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-0.5 mb-1">
                                      <p className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-1.5"><User size={10} /> {contact?.name || 'Unknown'}</p>
                                      <p className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-1.5"><Phone size={10} /> {contact?.phone || 'N/A'}</p>
                                    </div>
                                    <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center mt-auto">
                                      <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 truncate"><Clock size={10} /> {new Date(deal.closeDate).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</span>
                                      <div className="flex gap-1">
                                        <button className="text-[9px] font-bold text-muted hover:text-themed px-1.5 py-1 themed-card rounded transition-colors hover:bg-orange-600/30" onClick={() => setEditDeal({ ...deal })}>Edit</button>
                                        <button className="text-[9px] font-bold text-red-400 hover:text-red-300 px-1.5 py-1 themed-card rounded transition-colors hover:bg-red-500/20" onClick={() => deleteDeal(deal.id)}><Trash2 size={10}/></button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        )}

        {/* SECTION: CLIENTS */}
        {(activeTab === "contacts" || activeTab === "leads") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto bg-transparent">
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-black text-themed">{activeTab === 'leads' ? 'Pre-Sales Leads' : 'Customer Directory'}</h2>
              <div className="flex items-center gap-3">
                <div className="flex bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)]">
                  <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[var(--accent)] text-white shadow-sm" : "text-muted hover:text-themed"}`} title="List View"><List size={16}/></button>
                  <button onClick={() => setViewMode("card")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "card" ? "bg-[var(--accent)] text-white shadow-sm" : "text-muted hover:text-themed"}`} title="Card View"><Grid size={16}/></button>
                </div>
                <button onClick={exportContactsToPDF} className="flex items-center gap-2 themed-card text-muted px-4 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-colors border border-[var(--border-color)]"><Download size={16}/> <span className="hidden sm:inline">Export PDF</span></button>
              </div>
            </div>
            
            {viewMode === "list" ? (
            <table className="w-full text-left border-collapse" style={{background: 'transparent'}}>
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest" style={{color: 'var(--text-muted)', background: 'transparent'}}>
                  <th className="py-4 pl-8 pr-4">Client Profile</th>
                  <th className="py-4 px-4">Project Details</th>
                  <th className="py-4 px-4">Tags / Source</th>
                  <th className="py-4 px-4">Contact Details</th>
                  <th className="py-4 pr-8 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--border-color)] group transition-colors" style={{background: 'transparent'}}>
                    <td className="py-4 pl-8 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shadow-sm flex-shrink-0"
                          style={{background: 'var(--accent-soft)', color: 'var(--accent)'}}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black" style={{color: 'var(--text-primary)'}}>{c.name}</div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{color: 'var(--text-muted)'}}>ID: {c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold border" style={{borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-surface)'}}>{c.project}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {c.tags?.map(t => (
                          <span key={t} className="text-[9px] font-black uppercase px-2 py-0.5 rounded"
                            style={{border: '1px solid var(--border-color)', color: 'var(--text-muted)'}}>
                            <Tag size={7} className="inline mr-0.5"/>{t}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] font-bold flex items-center gap-1" style={{color: 'var(--text-muted)'}}><Filter size={9}/> {c.source || 'Unknown'}</div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium space-y-1" style={{color: 'var(--text-muted)'}}>
                      <div className="flex items-center gap-2"><Phone size={11} style={{color: 'var(--text-muted)'}} /> {c.phone}</div>
                      <div className="flex items-center gap-2"><Mail size={11} style={{color: 'var(--text-muted)'}} /> {c.email || 'N/A'}</div>
                    </td>
                    <td className="py-4 pr-8 pl-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {activeTab === 'leads' && (
                          <button
                            className="font-bold px-3 py-1.5 rounded-lg text-xs transition-all opacity-0 group-hover:opacity-100"
                            style={{color: 'var(--accent)', border: '1px solid var(--accent)', background: 'var(--accent-soft)'}}
                            onClick={() => convertToCustomer(c)}>Convert to Customer</button>
                        )}
                        <button
                          className="font-bold px-3 py-1.5 rounded-lg text-xs transition-all opacity-0 group-hover:opacity-100"
                          style={{color: 'var(--text-muted)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)'}}
                          onClick={() => setEditContact(c)}>Edit</button>
                        <button
                          className="font-bold px-2 py-1.5 rounded-lg text-xs transition-all opacity-0 group-hover:opacity-100"
                          style={{color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)'}}
                          onClick={() => deleteContact(c.id)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{background: 'transparent'}}>
              {filteredContacts.map((c) => (
                <div key={c.id} className="group relative p-5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{background: 'var(--bg-card)', borderColor: 'var(--border-color)'}}>
                  {/* Accent top strip on hover */}
                  <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))'}} />

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shadow-sm flex-shrink-0"
                        style={{background: 'var(--accent-soft)', color: 'var(--accent)'}}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-base" style={{color: 'var(--text-primary)'}}>{c.name}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{color: 'var(--text-muted)'}}>ID: {c.id}</div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeTab === 'leads' && (
                        <button
                          className="px-2 py-1.5 rounded-lg transition-colors text-[10px] font-bold"
                          style={{color: 'var(--accent)', background: 'var(--accent-soft)', border: '1px solid var(--accent)'}}
                          onClick={() => convertToCustomer(c)}>Convert</button>
                      )}
                      <button
                        className="p-1.5 rounded-lg transition-colors"
                        style={{color: 'var(--text-muted)'}}
                        onMouseOver={e => e.currentTarget.style.background='var(--bg-surface)'}
                        onMouseOut={e => e.currentTarget.style.background='transparent'}
                        onClick={() => setEditContact(c)}><Edit3 size={14}/></button>
                      <button
                        className="p-1.5 rounded-lg transition-colors"
                        style={{color: '#f87171'}}
                        onMouseOver={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
                        onMouseOut={e => e.currentTarget.style.background='transparent'}
                        onClick={() => deleteContact(c.id)}><Trash2 size={14}/></button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold inline-block mb-2"
                      style={{border: '1px solid var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-surface)'}}>
                      {c.project}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.map(t => (
                        <span key={t} className="text-[9px] font-black uppercase px-2 py-0.5 rounded"
                          style={{background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid transparent'}}>
                          <Tag size={7} className="inline mr-0.5"/>{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 space-y-2" style={{borderTop: '1px solid var(--border-color)'}}>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold flex items-center gap-1.5" style={{color: 'var(--text-muted)'}}><Filter size={10}/> Source</div>
                      <div className="text-xs font-bold" style={{color: 'var(--text-primary)'}}>{c.source || 'Unknown'}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold flex items-center gap-1.5" style={{color: 'var(--text-muted)'}}><Phone size={10}/> Phone</div>
                      <div className="text-xs font-bold" style={{color: 'var(--text-primary)'}}>{c.phone}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold flex items-center gap-1.5" style={{color: 'var(--text-muted)'}}><Mail size={10}/> Email</div>
                      <div className="text-xs font-bold truncate max-w-[140px]" style={{color: 'var(--text-primary)'}}>{c.email || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </motion.div>
        )}

        {/* SECTION: ACTIVITIES */}
        {activeTab === "activities" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[{ type: "Follow-up Call", icon: <Phone size={18} />, color: "blue" }, { type: "Site Visit", icon: <MapPin size={18} />, color: "orange" }, { type: "Send Quotation", icon: <DollarSign size={18} />, color: "emerald" }].map(({ type, icon, color }) => (
                <button key={type} onClick={() => setEditActivity({ type: type, date: new Date().toISOString().split('T')[0], client: contacts[0]?.id || '', status: 'Pending' })} className="flex items-center justify-between p-4 themed-card rounded-2xl hover:border-orange-500/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`bg-${color}-50 text-${color}-600 p-2.5 rounded-xl border border-${color}-100 group-hover:scale-110 transition-transform`}>{icon}</div>
                    <span className="font-bold text-themed text-sm">{type}</span>
                  </div>
                  <Plus size={16} className="text-slate-500 group-hover:text-white" />
                </button>
              ))}
            </div>
            <div className="themed-card rounded-[2rem] p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={14} /> Communication Timeline</h3>
                <span className="text-[10px] font-bold bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20 flex items-center gap-1"><Zap size={12}/> Unified View</span>
              </div>
              <div className="space-y-3">
                {filteredActivities.sort((a,b) => new Date(a.date) - new Date(b.date)).map((act) => {
                  const contact = contacts.find(c => c.id === act.client);
                  const isOverdue = new Date(act.date) < new Date() && act.status !== 'Completed';
                  const displayStatus = isOverdue ? 'Overdue' : act.status;
                  const actDate = new Date(act.date);
                  return (
                    <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 themed-card rounded-xl shadow-sm hover:shadow-md transition-all">
                      <div className="flex gap-4 items-center">
                        <div className="themed-card px-3 py-2 rounded-lg text-center min-w-[60px]">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{actDate.toLocaleString('default', { month: 'short' })}</p>
                          <p className="text-lg font-black text-themed">{actDate.getDate()}</p>
                        </div>
                        <div>
                          <p className="font-black text-white text-sm mb-0.5">{act.type}</p>
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><User size={12} /> {contact ? contact.name : "Unknown Client"} <span className="ml-2 flex items-center gap-1 text-slate-500"><Clock size={12}/> {actDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-0 border-white/10 pt-3 sm:pt-0">
                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 border rounded-md ${
                          displayStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          displayStatus === 'Overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {displayStatus === 'Completed' ? <CheckCircle size={12} /> : displayStatus === 'Pending' ? <Clock size={12} /> : <Calendar size={12} />}{displayStatus}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                           {act.status !== 'Completed' && (
                             <button title="Mark Completed" className="text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 text-xs flex items-center gap-1" onClick={() => completeActivity(act)}><CheckCircle size={14}/></button>
                           )}
                           <button className="text-muted hover:text-themed font-bold px-3 py-1.5 rounded-lg themed-card hover:bg-[var(--accent-soft)] transition-colors border border-[var(--border-color)] text-xs" onClick={() => setEditActivity(act)}>Edit</button>
                           <button title="Delete Activity" className="text-red-400 hover:text-red-300 font-bold px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20 text-xs flex items-center gap-1" onClick={() => deleteActivity(act.id)}><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "documents" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 sm:p-12">
            
            <div className="mb-10 max-w-md relative">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Select Lead / Customer</label>
              
              <div 
                className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold flex items-center justify-between cursor-pointer"
                onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
              >
                <span className="font-bold text-sm">
                  {selectedDocClient 
                    ? (() => {
                        const c = contacts.find(c => c.id === selectedDocClient);
                        return c ? `ID: ${c.id} - ${c.name}` : "Select a Client...";
                      })() 
                    : "Select a Client..."}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isDocDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              <AnimatePresence>
                {isDocDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="absolute z-50 w-full mt-2 themed-card border border-[var(--border-color)] rounded-xl shadow-2xl max-h-60 overflow-hidden flex flex-col"
                  >
                    <div className="p-2 border-b border-[var(--border-color)]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search clients..." 
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-sm outline-none focus:ring-1 focus:ring-orange-500"
                          value={docSearchTerm}
                          onChange={(e) => setDocSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto p-1 custom-scrollbar">
                      {contacts.filter(c => c.name.toLowerCase().includes(docSearchTerm.toLowerCase())).map(c => {
                        const isCustomer = c.tags?.includes("Customer");
                        return (
                          <div 
                            key={c.id} 
                            className="px-4 py-2.5 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 cursor-pointer rounded-lg flex items-center justify-between transition-colors"
                            onClick={() => {
                              setSelectedDocClient(c.id);
                              setIsDocDropdownOpen(false);
                              setDocSearchTerm("");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-black text-[10px] text-slate-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded border border-[var(--border-color)] uppercase">
                                ID: {c.id}
                              </span>
                              <span className="font-bold text-sm text-themed">{c.name}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${isCustomer ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                              {isCustomer ? 'Customer' : 'Lead'}
                            </span>
                          </div>
                        );
                      })}
                      {contacts.filter(c => c.name.toLowerCase().includes(docSearchTerm.toLowerCase())).length === 0 && (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center font-bold">No clients found</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {selectedDocClient ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="themed-card rounded-[2rem] border border-[var(--border-color)] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border-color)]">
                  <div>
                    <h3 className="text-xl font-black text-themed">Client Documents</h3>
                    <p className="text-sm text-slate-400 font-bold mt-1">Manage electricity bills, site photos, and contracts.</p>
                  </div>
                  <label className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 dark:bg-emerald-600 bg-emerald-500 text-white shadow-lg cursor-pointer hover:opacity-90">
                    <Plus size={16} /> Upload File
                    <input type="file" className="hidden" onChange={(e) => {
                      if(e.target.files.length > 0) {
                        setPendingFile(e.target.files[0]);
                        setFileNameInput(e.target.files[0].name.split('.')[0]); // Pre-fill without extension
                        setUploadModalOpen(true);
                        // Reset input so the same file can be uploaded again if needed
                        e.target.value = null;
                      }
                    }} />
                  </label>
                </div>

                <div className="space-y-3">
                  
                  {/* DYNAMICALLY UPLOADED DOCUMENTS */}
                  {(clientDocs[selectedDocClient] || []).map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-themed text-sm mb-0.5">{doc.name}</h4>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Added {new Date(doc.date).toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-slate-400 hover:text-blue-500 bg-white/5 rounded-lg transition-colors" 
                          title="View Document"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-amber-500 bg-white/5 rounded-lg transition-colors" 
                          title="Edit Name"
                          onClick={() => {
                            setDocToRename(doc);
                            setRenameInput(doc.name);
                            setRenameModalOpen(true);
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-emerald-500 bg-white/5 rounded-lg transition-colors" 
                          title="Download"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = doc.url;
                            a.download = doc.name;
                            a.click();
                          }}
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors" 
                          title="Delete"
                          onClick={() => {
                            setClientDocs(prev => ({
                              ...prev,
                              [selectedDocClient]: prev[selectedDocClient].filter(d => d.id !== doc.id)
                            }));
                            showFeedback("Document deleted");
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Placeholder Document 1 */}
                  <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--border-color)] hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-themed text-sm mb-0.5">Electricity_Bill_Aug.pdf</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Added Aug 10, 2026 • 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-500 bg-white/5 rounded-lg transition-colors" title="View Document"><Eye size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-emerald-500 bg-white/5 rounded-lg transition-colors" title="Download"><Download size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {/* Placeholder Document 2 */}
                  <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--border-color)] hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                        <ScanText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-themed text-sm mb-0.5">Site_Survey_Photos.zip</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Added Aug 12, 2026 • 15 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-500 bg-white/5 rounded-lg transition-colors" title="View Document"><Eye size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-emerald-500 bg-white/5 rounded-lg transition-colors" title="Download"><Download size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="text-center py-12 themed-card rounded-3xl border border-[var(--border-color)] border-dashed">
                <FileText size={48} className="mx-auto mb-4 text-slate-400 opacity-30" />
                <p className="text-muted font-bold">Please select a Lead or Customer from the dropdown above to manage their documents.</p>
              </div>
            )}

          </motion.div>
        )}

        {activeTab === "telecalling" && <TelecallingView contacts={contacts} setContacts={setContacts} />}
        {activeTab === "campaigns" && <CampaignsView />}
        {activeTab === "site-surveys" && <SiteSurveysView />}

      </div>

      {/* FEEDBACK TOAST */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-8 right-8 bg-orange-700 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold border border-stone-700">
            <CheckCircle size={20} className="text-emerald-400" />{feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <Modal open={!!editContact} onClose={() => setEditContact(null)}>
        {editContact && <EditContactForm contact={editContact} onSave={handleContactSave} onCancel={() => setEditContact(null)} />}
      </Modal>

      <Modal open={!!editDeal} onClose={() => setEditDeal(null)}>
        {editDeal && <EditDealForm deal={editDeal} contacts={contacts} onSave={handleDealSave} onCancel={() => setEditDeal(null)} />}
      </Modal>

      <Modal open={!!editActivity} onClose={() => setEditActivity(null)}>
        {editActivity && <EditActivityForm activity={editActivity} contacts={contacts} onSave={handleActivitySave} onCancel={() => setEditActivity(null)} />}
      </Modal>
      <Modal open={uploadModalOpen} onClose={() => { setUploadModalOpen(false); setPendingFile(null); }}>
        <div className="p-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-themed">Upload Document</h2>
              <p className="text-sm font-bold text-slate-400 mt-0.5">Please specify a name or type for this file.</p>
            </div>
          </div>
          
          <div className="mb-8">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Document Name / Type</label>
            <input 
              type="text" 
              className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={fileNameInput}
              onChange={(e) => setFileNameInput(e.target.value)}
              placeholder="e.g. Electricity Bill, ID Proof, Site Photo..."
              autoFocus
            />
            {pendingFile && (
              <p className="text-xs text-slate-500 mt-2 font-bold">
                Original filename: <span className="text-themed">{pendingFile.name}</span>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
            <button onClick={() => { setUploadModalOpen(false); setPendingFile(null); }} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button 
              onClick={() => {
                const finalName = fileNameInput || pendingFile.name;
                
                // Add to our clientDocs state
                const newDoc = {
                  id: Date.now(),
                  name: finalName,
                  originalName: pendingFile.name,
                  size: pendingFile.size,
                  date: new Date().toISOString(),
                  url: URL.createObjectURL(pendingFile)
                };

                setClientDocs(prev => ({
                  ...prev,
                  [selectedDocClient]: [...(prev[selectedDocClient] || []), newDoc]
                }));

                showFeedback(`Successfully saved "${finalName}"!`);
                setUploadModalOpen(false);
                setPendingFile(null);
              }} 
              className="px-6 py-2.5 rounded-xl font-black text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
            >
              Confirm Upload
            </button>
          </div>
        </div>
      </Modal>

      {/* Rename Document Modal */}
      <Modal open={renameModalOpen} onClose={() => { setRenameModalOpen(false); setDocToRename(null); }}>
        <div className="p-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl">
              <Edit3 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-themed">Rename Document</h2>
              <p className="text-sm font-bold text-slate-400 mt-0.5">Update the name of this file.</p>
            </div>
          </div>
          
          <div className="mb-8">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">New Document Name</label>
            <input 
              type="text" 
              className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              placeholder="e.g. Electricity Bill..."
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
            <button onClick={() => { setRenameModalOpen(false); setDocToRename(null); }} className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button 
              onClick={() => {
                if (renameInput && renameInput.trim() && docToRename) {
                  setClientDocs(prev => ({
                    ...prev,
                    [selectedDocClient]: prev[selectedDocClient].map(d => d.id === docToRename.id ? { ...d, name: renameInput.trim() } : d)
                  }));
                  showFeedback("Document renamed");
                }
                setRenameModalOpen(false);
                setDocToRename(null);
              }} 
              className="px-6 py-2.5 rounded-xl font-black text-sm bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

// --- EXTENDED FORMS ---
function EditContactForm({ contact, onSave, onCancel }) {
  const [form, setForm] = useState(contact || { name: '', organizationName: '', project: '', phone: '', email: '', address: '', status: 'Medium', source: '', tags: [], propertyType: 'Residential', averageMonthlyBill: 0, requiredCapacity: '', assignedSalesperson: '', nextFollowUpDate: '' });
  const [tagInput, setTagInput] = useState("");

  const addTag = () => { if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { setForm({...form, tags: [...form.tags, tagInput.trim()]}); setTagInput(""); } };

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-6">
      <h2 className="font-black text-3xl mb-1 text-themed tracking-tight">Client Profile</h2>
      <p className="text-muted font-medium text-sm mb-6 pb-4 border-b border-[var(--border-color)]">Comprehensive details for your solar client.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Organization Name (Optional)</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.organizationName || ''} onChange={e => setForm({ ...form, organizationName: e.target.value })} placeholder="e.g. Acme Corp" />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Phone Number</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Project Details</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} required />
        </div>
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Physical Address</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
        </div>
        <div className="md:col-span-2">
          {/* Replaced fixed select with input + datalist so ANY lead source can be entered */}
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Lead Source</label>
          <input list="lead-sources" placeholder="e.g. Instagram" className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
          <datalist id="lead-sources">
            <option value="Instagram" />
            <option value="Website" />
            <option value="Referral" />
            <option value="Direct Walk-in" />
          </datalist>
        </div>
        
        <div className="md:col-span-2 pt-4 pb-2 border-b border-[var(--border-color)]">
          <h3 className="text-xs font-black text-themed uppercase tracking-widest">Solar Specifications</h3>
        </div>
        
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Property Type</label>
          <select className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all cursor-pointer" value={form.propertyType || "Residential"} onChange={e => setForm({ ...form, propertyType: e.target.value })}>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
        
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Avg Monthly Bill (₹)</label>
          <input type="number" className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.averageMonthlyBill || 0} onChange={e => setForm({ ...form, averageMonthlyBill: parseFloat(e.target.value) || 0 })} min="0" />
        </div>
        
        <div className="md:col-span-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Required Capacity</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.requiredCapacity || ""} onChange={e => setForm({ ...form, requiredCapacity: e.target.value })} placeholder="e.g. 5.5 kW" />
        </div>

        <div className="md:col-span-2 pt-4 pb-2 border-b border-[var(--border-color)]">
          <h3 className="text-xs font-black text-themed uppercase tracking-widest">Sales & Tracking</h3>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Priority</label>
          <select className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all cursor-pointer" value={form.status || "Medium"} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Assigned Salesperson</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.assignedSalesperson || ""} onChange={e => setForm({ ...form, assignedSalesperson: e.target.value })} placeholder="e.g. John Doe" />
        </div>

        {!form.tags.includes("Customer") && (
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Next Follow-Up Date</label>
            <input type="date" className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.nextFollowUpDate || ""} onChange={e => setForm({ ...form, nextFollowUpDate: e.target.value })} />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-[var(--border-color)]">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold dark:bg-orange-700 bg-[#D4AF37] text-white shadow-md dark:hover:bg-slate-800 hover:bg-[#c4a133] transition-all">Save Profile</button>
      </div>
    </form>
  );
}

function EditDealForm({ deal, contacts, onSave, onCancel }) {
  const initialContact = contacts.find(c => c.id == deal?.contactId);
  const [form, setForm] = useState({ 
    title: deal?.title || '', 
    value: deal?.value || 0, 
    contactName: initialContact?.name || '', 
    closeDate: deal?.closeDate || new Date().toISOString().split('T')[0],
    id: deal?.id
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = contacts.find(c => c.name.toLowerCase() === form.contactName.trim().toLowerCase());
    onSave({
      id: form.id,
      title: form.title,
      value: form.value,
      closeDate: form.closeDate,
      contactId: existing ? existing.id.toString() : form.contactName.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-black text-3xl mb-1 text-themed tracking-tight">Project Deal</h2>
      <p className="text-muted font-medium text-sm mb-6 pb-4 border-b border-[var(--border-color)]">Track and update the estimated budget and assign to a client.</p>
      
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Deal Title</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Client (Optional)</label>
          <input 
            list="client-list"
            placeholder="Type new or select existing..."
            className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" 
            value={form.contactName} 
            onChange={e => setForm({ ...form, contactName: e.target.value })} 
          />
          <datalist id="client-list">
            {contacts.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Est. Value (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
            <input className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-9 text-sm text-white font-black focus:ring-2 focus:ring-stone-900 outline-none transition-all" value={form.value} onChange={e => setForm({ ...form, value: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1') })} type="text" inputMode="decimal" pattern="^\d*\.?\d*$" required min="0" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-[var(--border-color)]">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold dark:bg-orange-700 bg-[#D4AF37] text-white shadow-md dark:hover:bg-slate-800 hover:bg-[#c4a133] transition-all">Save Project</button>
      </div>
    </form>
  );
}

function EditActivityForm({ activity, contacts, onSave, onCancel }) {
  // We manage date and time separately in the form state, but combine them on save.
  const defaultDateStr = activity?.date || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const initialDate = defaultDateStr.split('T')[0];
  const initialTime = defaultDateStr.split('T')[1] || '12:00';
  const initialContact = contacts.find(c => c.id == activity?.client);

  const [form, setForm] = useState({ 
    id: activity?.id,
    type: activity?.type || '', 
    datePart: initialDate,
    timePart: initialTime,
    contactName: initialContact?.name || '', 
    status: activity?.status || 'Pending' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = contacts.find(c => c.name.toLowerCase() === form.contactName.trim().toLowerCase());
    
    onSave({
      id: form.id,
      type: form.type,
      date: `${form.datePart}T${form.timePart}`,
      client: existing ? existing.id.toString() : form.contactName.trim(),
      status: form.status || 'Pending'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-black text-3xl mb-1 text-themed tracking-tight">Schedule Activity</h2>
      <p className="text-muted font-medium text-sm mb-6 pb-4 border-b border-[var(--border-color)]">Plan your meetings, site visits, and calls.</p>
      
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Activity Title/Type</label>
          <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required placeholder="e.g. Discuss Floor Plan" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Date</label>
            <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.datePart} onChange={e => setForm({ ...form, datePart: e.target.value })} type="date" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Time</label>
            <input className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" value={form.timePart} onChange={e => setForm({ ...form, timePart: e.target.value })} type="time" required />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Client (Optional)</label>
          <input 
            list="activity-client-list"
            placeholder="Type new or select existing..."
            className="themed-input w-full border border-[var(--border-color)] rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all" 
            value={form.contactName} 
            onChange={e => setForm({ ...form, contactName: e.target.value })} 
          />
          <datalist id="activity-client-list">
            {contacts.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-[var(--border-color)]">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold dark:bg-orange-700 bg-[#D4AF37] text-white shadow-md dark:hover:bg-slate-800 hover:bg-[#c4a133] transition-all">Save Schedule</button>
      </div>
    </form>
  );
}

export default CRMPage;



