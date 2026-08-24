import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Calendar as CalendarIcon, MapPin, CheckCircle, Shield, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeClasses } from '../hooks/useThemeClasses';

export default function TeamsPage() {
  const t = useThemeClasses();
  const [searchTerm, setSearchTerm] = useState("");

  const [teams, setTeams] = useState([
    { id: 'TEAM-A', name: 'Alpha Squad', leader: 'Rajesh Kumar', role: 'Senior Installer', status: 'On Site', currentProject: 'Sharma Residence 5kW', members: 4, skills: ['Grid-tied', 'Hybrid'] },
    { id: 'TEAM-B', name: 'Beta Force', leader: 'Suresh Patil', role: 'Installer', status: 'Available', currentProject: '-', members: 3, skills: ['Grid-tied'] },
    { id: 'TEAM-S1', name: 'Survey Team 1', leader: 'Amit Desai', role: 'Surveyor', status: 'On Site', currentProject: 'GreenTech Factory 50kW', members: 2, skills: ['Site Survey', 'Drone'] },
    { id: 'TEAM-M1', name: 'Service Team B', leader: 'Priya Sharma', role: 'Service Engineer', status: 'Available', currentProject: '-', members: 2, skills: ['O&M', 'Troubleshooting'] }
  ]);
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);

  const handleAddTeam = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newTeam = {
      id: `TEAM-${Math.floor(Math.random() * 1000)}`,
      name: fd.get("teamName"),
      leader: fd.get("leaderName"),
      role: fd.get("role"),
      status: 'Available',
      currentProject: '-',
      members: parseInt(fd.get("members")) || 2,
      skills: fd.get("skills").split(',').map(s => s.trim()).filter(Boolean)
    };
    setTeams([...teams, newTeam]);
    setIsNewTeamModalOpen(false);
  };

  return (
    <div className="space-y-6 page-wrapper p-4 md:p-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${t.heading}`}>Installation Teams</h1>
          <p className={`text-sm font-bold ${t.muted} mt-1`}>Manage rosters, track availability, and assign teams to work orders.</p>
        </div>
        <button 
          onClick={() => setIsNewTeamModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={16} /> New Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Teams", val: teams.length, color: "text-blue-500" },
          { label: "Available", val: teams.filter(t => t.status === 'Available').length, color: "text-emerald-500" },
          { label: "On Site", val: teams.filter(t => t.status === 'On Site').length, color: "text-amber-500" },
          { label: "Total Personnel", val: teams.reduce((acc, curr) => acc + curr.members, 0), color: "text-indigo-500" },
        ].map((k, i) => (
          <div key={i} className={`${t.card} p-5 rounded-2xl shadow-sm border border-[var(--border-color)]`}>
            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${k.color}`}>{k.label}</div>
            <div className={`text-3xl font-black ${t.heading}`}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className={`${t.card} rounded-[2rem] overflow-hidden shadow-sm border border-[var(--border-color)]`}>
        <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
          <h2 className={`text-lg font-black ${t.heading} flex items-center gap-2`}><Users size={18}/> Team Roster</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input type="text" placeholder="Search teams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-color)] bg-transparent text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} />
            </div>
            <button className={`p-2 rounded-xl border border-[var(--border-color)] ${t.text} hover:bg-slate-100 dark:hover:bg-slate-800 transition`}><Filter size={16}/></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={t.tableHead}>
              <tr>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Team</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Team Leader</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Size</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Specialization</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Status</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Current Location</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={idx} className={`${t.tableRow} border-b border-[var(--border-color)] transition-colors`}>
                  <td className={`p-4`}>
                    <div className={`font-black ${t.heading}`}>{team.name}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest text-indigo-500 mt-1`}>{team.id}</div>
                  </td>
                  <td className={`p-4`}>
                    <div className={`font-bold ${t.heading} flex items-center gap-1.5`}><Shield size={14} className="text-amber-500"/> {team.leader}</div>
                    <div className={`text-xs font-bold ${t.muted} mt-1`}>{team.role}</div>
                  </td>
                  <td className={`p-4 font-bold ${t.muted}`}>{team.members} Members</td>
                  <td className={`p-4`}>
                    <div className="flex flex-wrap gap-1">
                      {team.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded text-[10px] font-bold text-muted uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max ${
                      team.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {team.status === 'Available' && <CheckCircle size={10}/>}
                      {team.status === 'On Site' && <Wrench size={10}/>}
                      {team.status}
                    </span>
                  </td>
                  <td className={`p-4 font-bold ${t.muted}`}>
                    {team.currentProject !== '-' ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-indigo-500 font-black">{team.currentProject}</span>
                        <span className="flex items-center gap-1 text-[10px] uppercase"><MapPin size={10}/> Deployed</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="text-[10px] font-black bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg transition uppercase tracking-widest text-indigo-500">
                      Schedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Team Modal */}
      {isNewTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-lg rounded-[2rem] shadow-2xl border border-[var(--border-color)] ${t.card} overflow-hidden`}
          >
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)]">
              <div>
                <h2 className={`text-xl font-black ${t.heading}`}>Register New Team</h2>
                <p className={`text-xs font-bold ${t.muted} mt-1`}>Create a new installation or service team roster.</p>
              </div>
            </div>
            
            <form onSubmit={handleAddTeam}>
              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Team Name</label>
                  <input type="text" name="teamName" required placeholder="e.g. Gamma Squad" className={`w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none`} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Team Leader</label>
                    <input type="text" name="leaderName" required placeholder="Full Name" className={`w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none`} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Primary Role</label>
                    <select name="role" className={`w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none`}>
                      <option value="Installer">Installer</option>
                      <option value="Senior Installer">Senior Installer</option>
                      <option value="Surveyor">Surveyor</option>
                      <option value="Service Engineer">Service Engineer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Member Count</label>
                    <input type="number" name="members" required min="1" defaultValue="2" className={`w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none`} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-widest ${t.muted} mb-1`}>Skills (comma separated)</label>
                    <input type="text" name="skills" required placeholder="Grid-tied, Drone..." className={`w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm font-bold ${t.text} focus:ring-2 focus:ring-indigo-500 outline-none`} />
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-surface)]">
                <button 
                  type="button"
                  onClick={() => setIsNewTeamModalOpen(false)}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${t.text}`}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm">
                  Create Team
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
