import React, { useState, useEffect } from "react";
import logoImage from "../assets/logo.png";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Zap, Battery, CloudRain, Download, FileText, Wrench, ChevronLeft } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CustomerPortal() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock generation data
  const generationData = [
    { time: "06:00", kw: 0.2 }, { time: "08:00", kw: 1.5 },
    { time: "10:00", kw: 3.2 }, { time: "12:00", kw: 4.8 },
    { time: "14:00", kw: 4.5 }, { time: "16:00", kw: 2.1 },
    { time: "18:00", kw: 0.4 }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/solarprojects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white">
        <Sun size={64} className="text-slate-700 mb-4" />
        <h2 className="text-2xl font-black">Project Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-6 text-orange-500 hover:underline">Return to ERP</button>
      </div>
    );
  }

  const systemSize = parseFloat(project.systemSizeKw) || 5;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white overflow-y-auto no-scrollbar font-inter">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Logo" className="w-24 h-auto max-h-8 object-contain rounded" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          <div>
            <h1 className="font-black text-lg leading-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Sida Solar</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Customer Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">Project: {project.title}</span>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition text-slate-400" title="Exit Portal">
            <ChevronLeft size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        
        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-gradient-to-br from-orange-500/20 to-orange-900/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <Zap className="text-orange-400" size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/20 px-2 py-1 rounded">Live</span>
            </div>
            <h3 className="text-3xl font-black text-white">{(systemSize * 0.8).toFixed(1)} kW</h3>
            <p className="text-sm font-medium text-orange-200/60 mt-1">Current Output</p>
          </motion.div>
          
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="mb-4"><Sun className="text-amber-400" size={24} /></div>
            <h3 className="text-3xl font-black text-white">{(systemSize * 4.5).toFixed(1)} kWh</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Energy Today</p>
          </motion.div>

          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="mb-4"><Battery className="text-emerald-400" size={24} /></div>
            <h3 className="text-3xl font-black text-white">{(systemSize * 135).toFixed(1)} kWh</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">This Month</p>
          </motion.div>

          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="mb-4"><CloudRain className="text-blue-400" size={24} /></div>
            <h3 className="text-3xl font-black text-white">{(systemSize * 4.5 * 0.8).toFixed(1)} kg</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">CO₂ Saved Today</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-3xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-black">Generation Curve</h2>
              <p className="text-sm text-slate-400">Real-time solar production for today</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generationData}>
                  <defs>
                    <linearGradient id="colorKw" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} />
                  <Area type="monotone" dataKey="kw" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorKw)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Details & Documents */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} className="space-y-6">
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
              <h2 className="text-lg font-black mb-4">System Specifications</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</p>
                  <p className="font-medium text-white">{project.systemSizeKw} kW</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Panels</p>
                  <p className="font-medium text-white">{project.panelBrand || "Tier-1 Monocrystalline"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inverter</p>
                  <p className="font-medium text-white">{project.inverterBrand || "Smart String Inverter"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Installation Date</p>
                  <p className="font-medium text-white">{project.startDate || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
              <h2 className="text-lg font-black mb-4">Document Center</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition group">
                  <div className="flex items-center gap-3">
                    <FileText className="text-orange-400" size={18} />
                    <span className="text-sm font-medium">Warranty Certificate</span>
                  </div>
                  <Download className="text-slate-500 group-hover:text-white" size={16} />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition group">
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-400" size={18} />
                    <span className="text-sm font-medium">Final Invoice</span>
                  </div>
                  <Download className="text-slate-500 group-hover:text-white" size={16} />
                </button>
              </div>
            </div>

            <button className="w-full bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition">
              <Wrench size={18} /> Report an Issue
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
