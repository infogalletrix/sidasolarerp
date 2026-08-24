import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Handshake, Truck, Landmark, Plus, Search, 
  Filter, Building2, MapPin, CheckCircle, FileText, Users, Building
} from 'lucide-react';
import { useThemeClasses } from '../hooks/useThemeClasses';

export default function PartnersPage() {
  const t = useThemeClasses();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "vendors";
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
    navigate(`/partners?tab=${tabId}`, { replace: true });
  };

  const vendors = [
    { id: 'VND-001', name: 'Waaree Energies', category: 'Solar Panels', status: 'Active', balance: 450000, lastOrder: '2024-06-15' },
    { id: 'VND-002', name: 'Growatt India', category: 'Inverters', status: 'Active', balance: 120000, lastOrder: '2024-06-22' },
    { id: 'VND-003', name: 'Polycab Cables', category: 'Electrical BOS', status: 'Active', balance: 0, lastOrder: '2024-05-10' },
    { id: 'VND-004', name: 'Loom Solar', category: 'Structure', status: 'On Hold', balance: 50000, lastOrder: '2024-04-18' }
  ];

  const financePartners = [
    { id: 'FIN-101', name: 'SBI Surya Ghar Yojna', type: 'Bank Loan', interestRate: '7.0%', activeLoans: 14, disbursedAmt: 3500000 },
    { id: 'FIN-102', name: 'HDFC Solar Finance', type: 'NBFC', interestRate: '8.5%', activeLoans: 8, disbursedAmt: 1200000 },
    { id: 'FIN-103', name: 'Bajaj Finserv', type: 'EMI Scheme', interestRate: '0.0%', activeLoans: 22, disbursedAmt: 4500000 }
  ];

  const dealers = [
    { id: 'DLR-001', name: 'Sunrise Energy Solutions', region: 'North Zone', level: 'Platinum', salesYTD: 8500000, status: 'Active' },
    { id: 'DLR-002', name: 'Green Watts India', region: 'South Zone', level: 'Gold', salesYTD: 4200000, status: 'Active' },
    { id: 'DLR-003', name: 'EcoPower Systems', region: 'West Zone', level: 'Silver', salesYTD: 1100000, status: 'Inactive' }
  ];

  const franchises = [
    { id: 'FR-101', name: 'Sida Solar - Mumbai', location: 'Mumbai, MH', leadCount: 340, revShare: '80/20', status: 'Operational' },
    { id: 'FR-102', name: 'Sida Solar - Pune', location: 'Pune, MH', leadCount: 215, revShare: '80/20', status: 'Operational' },
    { id: 'FR-103', name: 'Sida Solar - Bangalore', location: 'Bangalore, KA', leadCount: 0, revShare: '80/20', status: 'Onboarding' }
  ];

  const branches = [
    { id: 'BR-01', name: 'HQ - Chennai', address: 'No.378, Kagithapuram, S.kolathur, Chennai-129', manager: 'Arun Kumar', staffCount: 45 },
    { id: 'BR-02', name: 'Coimbatore Hub', address: 'Avinashi Road, Coimbatore', manager: 'Vikram Singh', staffCount: 12 },
    { id: 'BR-03', name: 'Madurai Office', address: 'Bypass Road, Madurai', manager: 'Sneha R.', staffCount: 8 }
  ];

  return (
    <div className="p-4 md:p-6 page-wrapper space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Partner Ecosystem</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Manage material vendors, suppliers, and customer finance partners.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
          <Plus size={16} /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-indigo-500">
            <Truck size={14}/> Active Vendors
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>{vendors.filter(v => v.status === 'Active').length}</div>
        </div>
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-rose-500">
            <FileText size={14}/> Total Payables
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>₹{(vendors.reduce((acc, curr) => acc + curr.balance, 0)/100000).toFixed(2)}L</div>
        </div>
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-emerald-500">
            <Landmark size={14}/> Finance Partners
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>{financePartners.length}</div>
        </div>
        <div className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
          <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 text-blue-500">
            <Building2 size={14}/> Total Loan Disbursed
          </div>
          <div className={`text-3xl font-black ${t.heading}`}>₹{(financePartners.reduce((acc, curr) => acc + curr.disbursedAmt, 0)/1000000).toFixed(2)}Cr</div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full">
        <div className="flex w-full md:w-auto gap-1 p-1 rounded-xl border border-[var(--border-color)] themed-card shadow-sm overflow-x-auto">
          {[
            { id: "vendors", label: "Material Vendors", icon: <Truck size={14} /> },
            { id: "finance", label: "Finance Partners", icon: <Landmark size={14} /> },
            { id: "dealers", label: "Dealers", icon: <Users size={14} /> },
            { id: "franchises", label: "Franchises", icon: <Building size={14} /> },
            { id: "branches", label: "Branches", icon: <Building2 size={14} /> }
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

      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)]`}>
        
        {/* VENDORS TAB */}
        {activeTab === "vendors" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Truck size={18}/> Vendor Directory</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Vendor ID</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Company Name</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Category</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Current Balance</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(vendor => (
                  <tr key={vendor.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black text-indigo-500`}>{vendor.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{vendor.name}</td>
                    <td className={`p-4`}>
                      <span className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted">{vendor.category}</span>
                    </td>
                    <td className={`p-4 font-black ${vendor.balance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      ₹{vendor.balance.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max ${
                        vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {vendor.status === 'Active' && <CheckCircle size={10}/>}
                        {vendor.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                        View Ledger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* FINANCE PARTNERS TAB */}
        {activeTab === "finance" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Landmark size={18}/> Finance & Loan Partners</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Partner ID</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Partner Name</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Loan Type</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Est. Interest</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Active Customer Loans</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {financePartners.map(partner => (
                  <tr key={partner.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black text-indigo-500`}>{partner.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{partner.name}</td>
                    <td className={`p-4`}>
                      <span className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted">{partner.type}</span>
                    </td>
                    <td className={`p-4 font-black text-emerald-500`}>
                      {partner.interestRate}
                    </td>
                    <td className={`p-4 font-bold ${t.muted}`}>
                      {partner.activeLoans} Active Accounts
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                        View Pipeline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* BRANCHES TAB */}
        {activeTab === "branches" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Building2 size={18}/> Branch Network</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Branch ID</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Branch Name</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Location</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Manager</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Staff Count</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(branch => (
                  <tr key={branch.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black text-indigo-500`}>{branch.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{branch.name}</td>
                    <td className={`p-4`}>
                      <span className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted">{branch.address}</span>
                    </td>
                    <td className={`p-4 font-bold ${t.muted}`}>
                      {branch.manager}
                    </td>
                    <td className={`p-4 font-black text-emerald-500`}>
                      {branch.staffCount}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* DEALERS TAB */}
        {activeTab === "dealers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Users size={18}/> Dealer Management</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Dealer ID</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Dealer Name</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Region</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Level</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Sales YTD</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {dealers.map(dealer => (
                  <tr key={dealer.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black text-indigo-500`}>{dealer.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{dealer.name}</td>
                    <td className={`p-4`}>
                      <span className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted">{dealer.region}</span>
                    </td>
                    <td className={`p-4 font-black`}>
                      <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider border ${
                        dealer.level === 'Platinum' ? 'bg-slate-200/50 text-slate-700 border-slate-300' :
                        dealer.level === 'Gold' ? 'bg-amber-100/50 text-amber-600 border-amber-300' :
                        'bg-stone-200/50 text-stone-600 border-stone-300'
                      }`}>
                        {dealer.level}
                      </span>
                    </td>
                    <td className={`p-4 font-bold text-emerald-500`}>
                      ₹{(dealer.salesYTD/100000).toFixed(2)}L
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max ${
                        dealer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {dealer.status === 'Active' && <CheckCircle size={10}/>}
                        {dealer.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* FRANCHISES TAB */}
        {activeTab === "franchises" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-transparent">
              <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Building size={18}/> Franchise Management</h2>
            </div>
            <table className="w-full text-left">
              <thead className={t.tableHead}>
                <tr>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Franchise ID</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Franchise Name</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Location</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Rev Share</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Lead Count</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                  <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {franchises.map(franchise => (
                  <tr key={franchise.id} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                    <td className={`p-4 font-black text-indigo-500`}>{franchise.id}</td>
                    <td className={`p-4 font-bold ${t.heading}`}>{franchise.name}</td>
                    <td className={`p-4`}>
                      <span className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted">{franchise.location}</span>
                    </td>
                    <td className={`p-4 font-bold ${t.muted}`}>
                      {franchise.revShare}
                    </td>
                    <td className={`p-4 font-black text-blue-500`}>
                      {franchise.leadCount}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max ${
                        franchise.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {franchise.status === 'Operational' && <CheckCircle size={10}/>}
                        {franchise.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                        View Dashboard
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
