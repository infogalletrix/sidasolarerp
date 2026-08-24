import React, { forwardRef } from 'react';

const PrintableMDN = forwardRef(({ mdn }, ref) => {
  if (!mdn) return null;

  return (
    <div ref={ref} className="p-8 bg-white text-black max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Material Dispatch Note</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Document No: <span className="font-bold text-slate-800">{mdn.id}</span></p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-black text-slate-900 uppercase">Sida Solar</h2>
          <p className="text-xs text-slate-500 font-medium">123 Solar Park, Industrial Area<br/>Bangalore, 560001<br/>support@sidasolar.com</p>
        </div>
      </div>

      {/* PROJECT DETAILS */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dispatch Details</h3>
          <p className="text-xs mb-2 text-slate-500">Date: <span className="font-bold text-slate-800 text-sm ml-1">{mdn.date}</span></p>
          <p className="text-xs text-slate-500">Status: <span className="font-bold text-slate-800 text-sm ml-1">{mdn.status}</span></p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Information</h3>
          <p className="text-xs mb-2 text-slate-500">Project: <span className="font-bold text-slate-800 text-sm ml-1">{mdn.project}</span></p>
          <p className="text-xs text-slate-500">Destination: <span className="font-bold text-slate-800 text-sm ml-1">{mdn.to}</span></p>
        </div>
      </div>

      {/* ITEMS LIST */}
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Items Shipped</h3>
      <div className="border border-slate-300 rounded-xl overflow-hidden mb-12">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-700 w-16 text-center">No.</th>
              <th className="px-4 py-3 font-bold text-slate-700">Description of Goods</th>
            </tr>
          </thead>
          <tbody>
            {mdn.items.split(',').map((item, idx) => (
              <tr key={idx} className="border-b border-slate-200 last:border-0">
                <td className="px-4 py-3 text-slate-500 text-center">{idx + 1}</td>
                <td className="px-4 py-3 font-bold text-slate-800">{item.trim()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SIGNATURES */}
      <div className="grid grid-cols-3 gap-8 mt-20 pt-8 border-t border-slate-200 text-center">
        <div>
          <div className="h-16 mb-2"></div>
          <div className="border-t border-slate-400 mx-8"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Authorized Signatory</p>
        </div>
        <div>
          <div className="h-16 mb-2"></div>
          <div className="border-t border-slate-400 mx-8"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Driver / Transporter</p>
        </div>
        <div>
          <div className="h-16 mb-2"></div>
          <div className="border-t border-slate-400 mx-8"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Received By (Site)</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        Computer Generated Document - Sida Solar ERP
      </div>
    </div>
  );
});

export default PrintableMDN;
