import React, { useState, useEffect } from 'react';
import { Save, Upload, FileText, CheckSquare, Zap, Map } from 'lucide-react';
import { useDialog } from '../contexts/DialogContext';

export default function SiteSurveyTab({ projectId, site }) {
  const { showDialog } = useDialog();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurvey();
  }, [projectId]);

  const loadSurvey = async () => {
    try {
      const res = await fetch(`/api/sitesurveys/project/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setSurvey(data);
      } else {
        // No survey yet
        setSurvey({
          solarProjectId: projectId,
          roofType: "Flat",
          roofCondition: "Good",
          hasShadingIssues: false,
          electricalPanelCapacity: "200A",
          needsMainPanelUpgrade: false,
          averageMonthlyConsumption: 0,
          sanctionedLoad: 0,
          phase: "Single Phase",
          roofArea: 0,
          tiltAngle: 0,
          documentUploads: "[]",
          recommendedSystemCapacity: 0,
          surveyorNotes: "",
          surveyDate: new Date().toISOString().split('T')[0],
          status: "Pending"
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const calculateSystemCapacity = (area, bill, load) => {
    // Basic heuristic: 1kW requires ~100 sq ft
    // Rule of thumb: recommended capacity shouldn't exceed sanctioned load typically
    const maxByArea = area / 100;
    // Assuming roughly 4 units per kW per day -> 120 units per month per kW
    const maxByConsumption = bill / 120;
    
    let recommended = Math.min(maxByArea, maxByConsumption);
    if (load > 0 && recommended > load) {
      recommended = load;
    }
    return Math.max(0, recommended).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    
    setSurvey(prev => {
      const updated = { ...prev, [name]: val };
      
      // Auto calculate
      if (['roofArea', 'averageMonthlyConsumption', 'sanctionedLoad'].includes(name)) {
        updated.recommendedSystemCapacity = calculateSystemCapacity(
          parseFloat(updated.roofArea || 0),
          parseFloat(updated.averageMonthlyConsumption || 0),
          parseFloat(updated.sanctionedLoad || 0)
        );
      }
      
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const isNew = !survey.id;
      const url = isNew ? '/api/sitesurveys' : `/api/sitesurveys/${survey.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey)
      });

      if (res.ok) {
        const saved = await res.json();
        setSurvey(saved);
        showDialog({ title: "Success", message: "Site survey saved successfully", type: "success" });
      } else {
        showDialog({ title: "Error", message: "Failed to save survey", type: "error" });
      }
    } catch (err) {
      showDialog({ title: "Error", message: "Connection error", type: "error" });
    }
  };

  if (loading) return <div className="p-4 text-center text-muted">Loading survey data...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h3 className="font-black text-themed flex items-center gap-2">
            <Map size={16} className="text-indigo-500" /> Site Survey Details
          </h3>
          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
            survey.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {survey.status}
          </span>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Section 1: Electrical */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Zap size={14} /> Electrical Profiling
            </h4>
            
            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Avg Monthly Consumption (kWh)</label>
              <input type="number" name="averageMonthlyConsumption" value={survey.averageMonthlyConsumption} onChange={handleInputChange} className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed" />
            </div>

            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Sanctioned Load (kW)</label>
              <input type="number" name="sanctionedLoad" value={survey.sanctionedLoad} onChange={handleInputChange} className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed" />
            </div>

            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Connection Phase</label>
              <select name="phase" value={survey.phase} onChange={handleInputChange} className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed">
                <option>Single Phase</option>
                <option>Three Phase</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Main Panel Capacity</label>
              <input type="text" name="electricalPanelCapacity" value={survey.electricalPanelCapacity} onChange={handleInputChange} placeholder="e.g. 200A" className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed" />
            </div>
            
            <label className="flex items-center gap-2 text-sm font-medium text-themed">
              <input type="checkbox" name="needsMainPanelUpgrade" checked={survey.needsMainPanelUpgrade} onChange={handleInputChange} className="rounded text-indigo-500" />
              Needs Main Panel Upgrade
            </label>
          </div>

          {/* Section 2: Roof & Physical */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Map size={14} /> Roof & Environment
            </h4>
            
            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Usable Roof Area (sq. ft)</label>
              <input type="number" name="roofArea" value={survey.roofArea} onChange={handleInputChange} className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed" />
            </div>

            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Roof Type</label>
              <select name="roofType" value={survey.roofType} onChange={handleInputChange} className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed">
                <option>Flat RCC</option>
                <option>Tin Shed</option>
                <option>Sloped Tile</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Tilt Angle (°)</label>
              <input type="number" name="tiltAngle" value={survey.tiltAngle} onChange={handleInputChange} className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed" />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-themed pt-2">
              <input type="checkbox" name="hasShadingIssues" checked={survey.hasShadingIssues} onChange={handleInputChange} className="rounded text-indigo-500" />
              Has Shading Issues (Trees/Buildings)
            </label>
          </div>

          <div className="md:col-span-2 pt-2 border-t border-white/10">
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-indigo-400 font-bold text-sm">Recommended System Capacity</h4>
                <p className="text-muted text-xs">Auto-calculated based on Area, Consumption & Load</p>
              </div>
              <div className="text-2xl font-black text-indigo-400">
                {survey.recommendedSystemCapacity} kW
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-black text-muted uppercase tracking-wider flex items-center gap-1"><Upload size={14} /> Document Uploads (Electricity Bill, Roof Photos)</label>
            <div className="flex items-center gap-3">
              <input type="file" multiple accept="image/*,application/pdf" className="w-full bg-[var(--bg-surface)] border border-dashed border-white/20 rounded-lg p-3 text-sm text-themed cursor-pointer" />
              <button type="button" className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg text-xs font-bold transition whitespace-nowrap">
                Upload
              </button>
            </div>
            <p className="text-[10px] text-muted font-medium">Currently attached: {JSON.parse(survey.documentUploads || "[]").length} documents.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-muted uppercase tracking-wider mb-1">Surveyor Notes</label>
            <textarea name="surveyorNotes" value={survey.surveyorNotes} onChange={handleInputChange} rows="3" className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm text-themed"></textarea>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <select name="status" value={survey.status} onChange={handleInputChange} className="bg-[var(--bg-surface)] border border-white/10 rounded-lg p-2 text-sm font-bold text-themed">
              <option>Pending</option>
              <option>Action Required</option>
              <option>Completed</option>
            </select>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition">
              <Save size={16} /> Save Survey
            </button>
          </div>
        </form>
      </div>
      
      {/* Installation Checklist Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
         <h3 className="font-black text-themed flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
            <CheckSquare size={16} className="text-emerald-500" /> Installation Sign-off Checklist
          </h3>
          
          <div className="space-y-3">
             {["DC Wiring Routed & Secured", "Inverter Mounted Properly", "AC/DC Distribution Boards Installed", "Earthing Pit Completed", "System Testing & Commissioning", "Customer Handover Training"].map((item, idx) => (
               <label key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-surface)] border border-white/5 hover:border-white/10 transition cursor-pointer">
                 <input type="checkbox" className="w-5 h-5 rounded text-emerald-500 bg-[var(--bg-card)] border-white/20" />
                 <span className="text-sm font-medium text-themed">{item}</span>
               </label>
             ))}
          </div>
          <div className="mt-4 text-right">
             <button className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500 border border-emerald-600/30 px-4 py-2 rounded-lg text-xs font-bold transition">
               Save Checklist
             </button>
          </div>
      </div>
    </div>
  );
}
