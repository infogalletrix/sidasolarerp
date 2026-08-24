import React, { forwardRef } from "react";
import logoImage from "../assets/logo.png";

const PrintableInstallationOrder = forwardRef(({ site }, ref) => {
  if (!site) return null;

  return (
    <div
      ref={ref}
      className="p-10 bg-white text-black font-sans mx-auto flex flex-col relative"
      style={{ width: '210mm', minHeight: '297mm' }}
    >
      {/* Header - Letter Pad Style */}
      <div className="flex justify-between border-b-2 border-slate-900 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="w-32 h-auto max-h-12 object-contain" 
            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} 
          />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sida Solar</h1>
            <p className="text-xs text-slate-600">No.378, Kagithapuram, S.kolathur, Chennai-600129</p>
            <p className="text-xs text-slate-600">Phone: 9176093482 | Email: contact@sidasolar.com</p>
          </div>
        </div>
        <div className="text-right flex flex-col justify-center">
          <p className="text-sm font-semibold text-slate-600 mt-2">Date: {new Date().toLocaleDateString("en-GB")}</p>
          <p className="text-xs font-bold text-slate-500 mt-1">Order Ref: IO-{site.id}</p>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold uppercase text-slate-800 tracking-widest border-b-2 border-slate-800 inline-block pb-2 px-6">Installation Work Order</h2>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col space-y-8 px-4">
        
        {/* Project Overview */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3 border-b border-indigo-100 pb-2">Project Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-bold text-slate-500">Project Title:</span> <span className="font-semibold text-slate-900">{site.title}</span></div>
            <div><span className="font-bold text-slate-500">Client Name:</span> <span className="font-semibold text-slate-900">{site.clientName || 'N/A'} {site.organizationName ? `(${site.organizationName})` : ''}</span></div>
            <div className="col-span-2"><span className="font-bold text-slate-500">Site Address:</span> <span className="font-semibold text-slate-900">{site.address}</span></div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3 border-b border-indigo-100 pb-2">Technical Specifications</h3>
          <table className="w-full text-left text-sm border-collapse">
            <tbody>
              <tr className="border-b border-slate-100">
                <th className="py-2 font-bold text-slate-500 w-1/3">System Size (kW)</th>
                <td className="py-2 font-semibold text-slate-900">{site.systemSizeKw || 'TBD'} kW</td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="py-2 font-bold text-slate-500 w-1/3">Panel Brand</th>
                <td className="py-2 font-semibold text-slate-900">{site.panelBrand || 'TBD'}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <th className="py-2 font-bold text-slate-500 w-1/3">Inverter Brand</th>
                <td className="py-2 font-semibold text-slate-900">{site.inverterBrand || 'TBD'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Execution & Schedule */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3 border-b border-indigo-100 pb-2">Execution details</h3>
          <table className="w-full text-left text-sm border-collapse border border-slate-300">
            <tbody>
              <tr className="border-b border-slate-300 bg-slate-50">
                <th className="py-3 px-4 font-bold text-slate-700 w-1/3 border-r border-slate-300">Assigned Team</th>
                <td className="py-3 px-4 font-bold text-indigo-700">{site.assignedTeam || 'Unassigned'}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="py-3 px-4 font-bold text-slate-700 w-1/3 border-r border-slate-300">Target Start Date</th>
                <td className="py-3 px-4 font-semibold text-slate-900">{site.startDate || 'TBD'}</td>
              </tr>
              <tr>
                <th className="py-3 px-4 font-bold text-slate-700 w-1/3 border-r border-slate-300">Target End Date</th>
                <td className="py-3 px-4 font-semibold text-slate-900">{site.endDate || 'TBD'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scope of Work */}
        <div className="pt-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3 border-b border-indigo-100 pb-2">Scope of Work & Instructions</h3>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap">
            {site.description || 'Standard solar installation protocol to be followed. No special instructions provided.'}
          </div>
        </div>
        
        {/* Signatures */}
        <div className="mt-16 pt-16 flex justify-between px-8">
           <div className="text-center">
             <div className="border-t border-slate-400 w-48 mx-auto pt-2"></div>
             <p className="text-xs font-bold text-slate-600 uppercase">Authorized By (Manager)</p>
           </div>
           <div className="text-center">
             <div className="border-t border-slate-400 w-48 mx-auto pt-2"></div>
             <p className="text-xs font-bold text-slate-600 uppercase">Team Lead Signature</p>
           </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-300 text-center print:fixed print:bottom-8 print:w-full print:left-0">
        <p className="text-xs text-gray-500 italic font-medium">Sida Solar - Internal Document. Not for external circulation.</p>
      </div>
    </div>
  );
});

export default PrintableInstallationOrder;
