import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  Activity, TrendingUp, TrendingDown, Users, 
  Briefcase, DollarSign, Sun, Battery, Zap
} from "lucide-react";
import NotificationWidget from "../components/NotificationWidget";

const DARK_COLORS  = ['#f97316', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#ec4899'];
const LIGHT_COLORS = ['#C9A227', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const t = useThemeClasses();
  const COLORS = t.isDark ? DARK_COLORS : LIGHT_COLORS;
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "sales";
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  // Dummy Data for Demonstration
  const salesData = [
    { name: 'Jan', leads: 40, converted: 24 },
    { name: 'Feb', leads: 30, converted: 13 },
    { name: 'Mar', leads: 55, converted: 38 },
    { name: 'Apr', leads: 45, converted: 28 },
    { name: 'May', leads: 60, converted: 42 },
    { name: 'Jun', leads: 75, converted: 55 },
  ];

  const projectStatusData = [
    { name: 'Completed', value: 45 },
    { name: 'In Progress', value: 25 },
    { name: 'On Hold', value: 5 },
    { name: 'Survey Phase', value: 15 },
  ];

  const financeData = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
  ];

  const performanceData = [
    { time: '06:00', generation: 5 },
    { time: '09:00', generation: 45 },
    { time: '12:00', generation: 85 },
    { time: '15:00', generation: 65 },
    { time: '18:00', generation: 10 },
  ];

  const renderSalesAnalytics = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${t.card} p-6 rounded-[2rem] shadow-sm`}>
          <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp size={14}/> Conversion Rate</div>
          <div className={`text-4xl font-black ${t.isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>68%</div>
          <div className="text-xs font-bold text-muted mt-2">+12% from last month</div>
        </div>
        <div className={`${t.card} p-6 rounded-[2rem] shadow-sm`}>
          <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-2"><Users size={14}/> Total Leads</div>
          <div className={`text-4xl font-black ${t.heading}`}>305</div>
          <div className="text-xs font-bold text-muted mt-2">Active pipeline</div>
        </div>
        <div className={`${t.card} p-6 rounded-[2rem] shadow-sm`}>
          <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign size={14}/> Avg Deal Size</div>
          <div className={`text-4xl font-black ${t.isDark ? 'text-orange-400' : 'text-[#C9A227]'}`}>₹4.2L</div>
          <div className="text-xs font-bold text-muted mt-2">Based on won deals</div>
        </div>
      </div>
      <div className={`${t.card} p-6 md:p-8 rounded-[2rem] shadow-sm`}>
        <h3 className={`text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest ${t.heading}`}>Leads vs Conversion</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.chartGrid} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:11, fontWeight:700, fill:t.chartTickColor }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fontWeight:700, fill:t.chartTickColor }} />
            <RechartsTooltip contentStyle={t.chartTooltip} />
            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="leads" stroke={COLORS[0]} fillOpacity={1} fill="url(#colorLeads)" />
            <Area type="monotone" dataKey="converted" stroke={COLORS[1]} fillOpacity={1} fill="url(#colorConverted)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );

  const renderProjectsAnalytics = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${t.card} p-6 md:p-8 rounded-[2rem] shadow-sm`}>
          <h3 className={`text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest ${t.heading}`}>Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={t.chartTooltip} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize:'11px', fontWeight:700, color: t.chartTickColor }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={`${t.card} p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col justify-center`}>
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Avg Completion Time</div>
              <div className={`text-5xl font-black ${t.isDark ? 'text-orange-400' : 'text-[#C9A227]'}`}>14 Days</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Delayed Projects</div>
              <div className="text-5xl font-black text-rose-500">2</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Upcoming Installations</div>
              <div className={`text-5xl font-black ${t.heading}`}>8</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderFinanceAnalytics = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`${t.card} p-6 md:p-8 rounded-[2rem] shadow-sm`}>
        <h3 className={`text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest ${t.heading}`}>Revenue vs Expenses</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={financeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.chartGrid} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:11, fontWeight:700, fill:t.chartTickColor }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fontWeight:700, fill:t.chartTickColor }} tickFormatter={(v) => `₹${v/1000}k`} />
            <RechartsTooltip cursor={{ fill: t.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} contentStyle={t.chartTooltip} />
            <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Bar dataKey="revenue" name="Revenue" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill={COLORS[3]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );

  const renderPerformanceAnalytics = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${t.card} p-6 rounded-[2rem] shadow-sm bg-gradient-to-br from-amber-400 to-orange-500 text-white border-none`}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 text-white/80"><Sun size={14}/> Energy Generated</div>
          <div className="text-4xl font-black">124.5 MWh</div>
          <div className="text-xs font-bold mt-2 text-white/80">Lifetime Generation</div>
        </div>
        <div className={`${t.card} p-6 rounded-[2rem] shadow-sm bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-none`}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 text-white/80"><Battery size={14}/> System Efficiency</div>
          <div className="text-4xl font-black">94.2%</div>
          <div className="text-xs font-bold mt-2 text-white/80">Average across all sites</div>
        </div>
        <div className={`${t.card} p-6 rounded-[2rem] shadow-sm bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-none`}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 text-white/80"><Zap size={14}/> CO2 Offset</div>
          <div className="text-4xl font-black">85.2 Tons</div>
          <div className="text-xs font-bold mt-2 text-white/80">Environmental impact</div>
        </div>
      </div>
      <div className={`${t.card} p-6 md:p-8 rounded-[2rem] shadow-sm`}>
        <h3 className={`text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest ${t.heading}`}>Average Daily Generation Curve</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.chartGrid} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize:11, fontWeight:700, fill:t.chartTickColor }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fontWeight:700, fill:t.chartTickColor }} tickFormatter={(v) => `${v}%`} />
            <RechartsTooltip contentStyle={t.chartTooltip} />
            <Line type="monotone" dataKey="generation" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: "#f59e0b", strokeWidth: 2, stroke: t.isDark ? '#1e293b' : '#fff' }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );

  return (
    <div className={`p-4 md:p-6 ${t.page}`}>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-50">
        <div>
          <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 ${t.heading}`}>
            <Activity className={t.isDark ? "text-orange-400" : "text-[#D4AF37]"} size={20} />
            Analytics Center
          </h1>
          <p className={`text-xs font-medium mt-0.5 ${t.muted}`}>
            Deep dive into metrics across all departments.
          </p>
        </div>
        <NotificationWidget />
      </div>

      {/* TABS */}
      <div className="flex space-x-2 mb-6 border-b border-[var(--border-color)] pb-1 overflow-x-auto custom-scrollbar">
        {[
          { id: "sales", label: "Sales & CRM" },
          { id: "projects", label: "Projects" },
          { id: "finance", label: "Finance" },
          { id: "performance", label: "Solar Performance" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[var(--bg-card)] text-[#C9A227] border-t-2 border-l border-r border-[var(--border-color)] shadow-sm translate-y-[1px]"
                : "text-muted hover:text-themed hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "sales" && renderSalesAnalytics()}
        {activeTab === "projects" && renderProjectsAnalytics()}
        {activeTab === "finance" && renderFinanceAnalytics()}
        {activeTab === "performance" && renderPerformanceAnalytics()}
      </div>
    </div>
  );
}
