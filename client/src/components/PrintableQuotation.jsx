import React, { forwardRef } from "react";
import logoImage from "../assets/logo.png";
import { generateTechSpecs, generateFinancialAnalysis } from "../utils/SolarBomEngine";

const Header = () => (
  <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
    <div className="text-left">
      <h1 className="text-xl font-bold text-sky-700 tracking-wide">Sida Solar Industry Private Limited</h1>
      <p className="text-gray-600 font-bold text-sm mt-0.5">Keshod, Gujarat</p>
      <a href="https://www.sidasolar.com" className="text-sky-600 italic text-sm underline">www.sidasolar.com</a>
    </div>
    <div>
      <img src={logoImage} alt="Sida Solar" className="h-14 w-auto object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
    </div>
  </div>
);

const Footer = () => (
  <div className="mt-auto border-t border-gray-300 pt-3 text-[11px] text-gray-500 font-medium grid grid-cols-[80px_10px_1fr] gap-y-1 w-full">
    <div className="text-sky-700 font-bold">Regd Office</div><div>:</div><div>Keshod, Gujarat 362220, India</div>
    <div className="text-sky-700 font-bold">Contact</div><div>:</div><div>crm@sidasolar.com | +91 99446 00377</div>
  </div>
);

const Page = ({ children, status }) => {
  const isApproved = status === "Approved (Ready for Customer)" || status === "Customer Accepted";
  return (
    <div className="w-[210mm] min-h-[296mm] max-h-[297mm] mx-auto bg-white flex flex-col pt-10 pb-8 px-12 text-slate-800 font-sans shadow-lg mb-8 border border-gray-200 box-border overflow-hidden relative print:shadow-none print:border-none print:mb-0 print:m-0" style={{ pageBreakAfter: 'always', breakAfter: 'page' }}>
      {!isApproved && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden opacity-[0.03]">
          <div className="text-[150px] font-black text-gray-500 uppercase tracking-tighter transform -rotate-45 whitespace-nowrap">
            DRAFT QUOTATION
          </div>
        </div>
      )}
      <Header />
      <div className="flex-grow flex flex-col pt-4 relative z-10">
        {children}
      </div>
      <Footer />
    </div>
  );
};

const PrintableQuotation = forwardRef(({ data }, ref) => {
  const safeData = data || {};
  const items = safeData.items || [];
  
  const systemCapacityKW = parseFloat(safeData.systemCapacityKW) || 6;
  const bomData = (safeData.generatedBomData && safeData.generatedBomData.length > 0) ? safeData.generatedBomData : [];
  const techSpecs = generateTechSpecs(systemCapacityKW);
  const finAnalysis = generateFinancialAnalysis(systemCapacityKW);

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const isNonGST = safeData.billType === "Non-GST";
  const tax = isNonGST ? 0 : subtotal * 0.18; // Default 18% if not Non-GST
  const total = subtotal + tax;

  return (
    <div ref={ref} className="bg-gray-100 print:bg-transparent">
      
      {/* PAGE 1: COVER PAGE */}
      <Page status={safeData.status}>
        <div className="flex flex-col items-center justify-center flex-grow text-center">
          <div className="w-full mb-8 mt-12 border-b-2 border-gray-300 pb-2">
            <h2 className="text-2xl font-bold text-gray-600 tracking-widest uppercase">{safeData.proposalTitle || "DOMESTIC PMSG NON DCR PROPOSAL"}</h2>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wide px-10 leading-snug">
            {safeData.projectTitle || `${systemCapacityKW}KW(DC)/${systemCapacityKW}KW(AC) ROOFTOP GRID-TIED SOLAR PV POWER PLANT - NON DCR PANELS`}
          </h1>
          
          <div className="w-full h-[350px] mb-12 overflow-hidden bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop" 
              alt="Solar Panels" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8 mb-4">
            <p className="text-lg font-bold text-gray-500 italic">Prepared for</p>
            <h3 className="text-xl font-black uppercase text-slate-900">{safeData.customer || "Valued Client"}</h3>
            <h4 className="text-lg font-bold uppercase text-slate-900">{safeData.address?.split(',')[0] || "Location"}</h4>
          </div>

          <div className="mt-auto mb-10">
            <p className="text-lg font-bold text-sky-700 italic">Prepared by</p>
            <h3 className="text-xl font-medium text-sky-700 italic">Engineering team - Sida Solar</h3>
          </div>
        </div>
      </Page>

      {/* PAGE 2: TABLE OF CONTENTS */}
      <Page status={safeData.status}>
        <div className="px-10 mt-12">
          <h2 className="text-2xl font-bold text-gray-600 border-b-2 border-gray-300 pb-2 mb-10 underline underline-offset-4 decoration-2 text-center w-full max-w-sm mx-auto">
            Table of contents
          </h2>
          
          <div className="space-y-6 text-sky-700 font-medium text-lg uppercase tracking-wide">
            <p className="underline underline-offset-2 decoration-sky-700/50">1. QUOTATION</p>
            <p className="underline underline-offset-2 decoration-sky-700/50">2. TECHNICAL INFORMATION</p>
            <p className="underline underline-offset-2 decoration-sky-700/50">3. ANALYSIS</p>
            <p className="underline underline-offset-2 decoration-sky-700/50">4. TERMS AND CONDITIONS</p>
          </div>
        </div>
      </Page>

      {/* PAGE 3: QUOTATION */}
      <Page status={safeData.status}>
        <h2 className="text-xl font-bold text-gray-600 mb-6 uppercase tracking-wide">1. QUOTATION</h2>
        
        <div className="bg-gray-200 px-4 py-2 font-bold text-sm flex justify-between border border-gray-400 mb-8 text-black">
          <div>{safeData.quoteNo || "SIDA/PMSG/NON DCR/26-27"}</div>
          <div>Date: {safeData.date || new Date().toLocaleDateString("en-GB")}</div>
        </div>

        <div className="mb-6 text-sm font-bold text-black">
          <p>To</p>
          <p className="pl-4">{safeData.customer || "Client Name"},</p>
          <p className="pl-4">{safeData.address || "Address"}.</p>
        </div>

        <div className="text-[13px] text-justify leading-relaxed text-black mb-8 space-y-4">
          <p className="font-bold">Dear Sir,</p>
          <p>
            <span className="font-bold">Sub:</span> Submission of Techno-Commercial Proposal for Design, Supply and Execution (EPC) of {safeData.projectTitle || `${systemCapacityKW}KW(DC)/${systemCapacityKW}KW(AC) Rooftop Grid-Tied Solar PV Power plant`}.
          </p>
          <p>
            With reference to the information provided, please find below our offer to perform EPC (Design, Supply and Execution) for a {safeData.projectTitle || "Solar PV Power plant"} system in your premises.
          </p>
          <p>
            Thanking you again, we look forward to a favorable reply from your end. If you have any questions regarding this proposal, please contact <span className="font-bold">Mr.Karthick D</span> at <span className="font-bold">+91 99446 00377</span> or via email at <span className="font-bold">crm@sidasolar.com</span>
          </p>
        </div>

        <table className="w-full border-collapse border border-gray-400 text-[13px] mb-8">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-400">
              <th className="border-r border-gray-400 p-3 text-center w-[55%]">Description</th>
              <th className="border-r border-gray-400 p-3 text-center w-[20%]">Capacity</th>
              <th className="p-3 text-center w-[25%]">Price (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-r border-gray-400 p-3 align-top">
                Design Engineering, Supply, Execution (EPC) of {safeData.projectTitle || `${systemCapacityKW}KW(DC)/${systemCapacityKW}KW(AC) Rooftop Grid-Tie Solar PV Power plant`} as per MNRE Standards
              </td>
              <td className="border-r border-gray-400 p-3 align-top text-center">
                {systemCapacityKW} kw
              </td>
              <td className="p-3 align-top text-right pr-6">
                INR {subtotal.toLocaleString()}
              </td>
            </tr>
            {/* Empty space filler for styling similar to reference */}
            <tr><td className="border-r border-gray-400 h-10"></td><td className="border-r border-gray-400 h-10"></td><td className="h-10"></td></tr>
            
            <tr>
              <td className="border-r border-gray-400 p-3 pb-1 font-bold">GST</td>
              <td className="border-r border-gray-400 p-3"></td>
              <td className="p-3"></td>
            </tr>
            {!isNonGST ? (
              <>
                <tr>
                  <td className="border-r border-gray-400 p-3 py-1 pl-4 flex justify-between">
                    <span>70% of project cost - <span className="font-bold">@ 5%</span></span>
                  </td>
                  <td className="border-r border-gray-400 p-3 py-1"></td>
                  <td className="p-3 py-1 text-right pr-6">INR {((subtotal * 0.70) * 0.05).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} (+)</td>
                </tr>
                <tr>
                  <td className="border-r border-gray-400 p-3 py-1 pl-4 pb-4 flex justify-between">
                    <span>30% of project cost - <span className="font-bold">@ 18%</span></span>
                  </td>
                  <td className="border-r border-gray-400 p-3 py-1 pb-4"></td>
                  <td className="p-3 py-1 pb-4 text-right pr-6">INR {((subtotal * 0.30) * 0.18).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}(+)</td>
                </tr>
              </>
            ) : (
              <tr>
                <td className="border-r border-gray-400 p-3 py-1 pl-4 pb-4">Non-GST Quotation</td>
                <td className="border-r border-gray-400 p-3 py-1 pb-4"></td>
                <td className="p-3 py-1 pb-4 text-right pr-6">INR 0 (+)</td>
              </tr>
            )}

            <tr className="border-t border-gray-400 font-bold bg-gray-50">
              <td colSpan="2" className="border-r border-gray-400 p-3 text-right pr-8">
                TOTAL COST OF INCLUDING GST
              </td>
              <td className="p-3 text-right pr-6">
                INR {total.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}/-
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-[11px] text-red-600 font-medium">
          <p className="font-bold mb-1 uppercase">NOTE:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Quote will be valid for 15 days.</li>
            <li>Online Fees for Procurement of Net Meter will be Rs. 10,700. Any other additional cost requested by TNEB during or before meter installation will be on customer's scope.</li>
            <li>For Every site we will supply 10% of Extra Material, After Completion of Work it will be taken back by Sida Solar Team.</li>
            <li>Final Bill will be done for Solar Panel capacity, if the ordered Solar Panel capacity is not in stock, then Solar Panel capacity in stock will be billed.</li>
          </ul>
        </div>
      </Page>

      {/* PAGE 4: TECHNICAL INFORMATION */}
      <Page status={safeData.status}>
        <h2 className="text-xl font-bold text-gray-600 mb-6 uppercase tracking-wide">2. TECHNICAL INFORMATION</h2>
        
        <div className="grid grid-cols-[200px_10px_1fr] gap-y-1 text-[13px] font-medium text-black mb-10">
          <div>Project type</div><div>:</div><div>{safeData.projectType || techSpecs.projectType}</div>
          <div>Installation type</div><div>:</div><div>{safeData.installationType || techSpecs.installationType}</div>
          <div>Roof classification (If)</div><div>:</div><div>{safeData.roofClassification || techSpecs.roofClassification}</div>
          <div>Metering</div><div>:</div><div>{safeData.metering || techSpecs.metering}</div>
          <div>Customer category</div><div>:</div><div>{safeData.customerCategory || techSpecs.customerCategory}</div>
          <div>Electrical Connectivity</div><div>:</div><div>{safeData.electricalConnectivity || techSpecs.electricalConnectivity}</div>
          {safeData.consumerNumber && (
             <><div>Consumer Number</div><div>:</div><div className="font-bold text-sky-700">{safeData.consumerNumber}</div></>
          )}
        </div>

        <h3 className="text-[15px] font-bold text-sky-600 mb-4 uppercase">2.1 COMPONENTS USED:</h3>
        
        <table className="w-full border-collapse border border-black text-[13px] mb-8">
          <thead>
            <tr>
              <th className="border border-black p-2 w-[10%] text-center">S. No.</th>
              <th className="border border-black p-2 w-[35%] text-center">Description</th>
              <th className="border border-black p-2 w-[55%] text-center">Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3 text-center align-top">1</td>
              <td className="border border-black p-3 align-top whitespace-pre-line">{techSpecs.pvModules.desc}</td>
              <td className="border border-black p-3 align-top whitespace-pre-line">
                {techSpecs.pvModules.spec}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 text-center align-top">2</td>
              <td className="border border-black p-3 align-top whitespace-pre-line">{techSpecs.inverter.desc}</td>
              <td className="border border-black p-3 align-top whitespace-pre-line">
                {techSpecs.inverter.spec}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-3 text-center align-top">3</td>
              <td className="border border-black p-3 align-top whitespace-pre-line">{techSpecs.structure.desc}</td>
              <td className="border border-black p-3 align-top whitespace-pre-line">
                {techSpecs.structure.spec}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-[13px] font-bold underline underline-offset-2 mb-4">Balance of System Components (BOS):</h3>
        
        <div className="grid grid-cols-[180px_10px_1fr] gap-y-2 text-[13px] font-medium text-black">
          <div className="text-red-600">DC Cables</div><div>:</div><div>Siechem / Polycab / Leoni / KEI / Equivalent standard</div>
          <div className="text-red-600">AC Cables</div><div>:</div><div>Solar grade / Polycab / Orbit / Havells / Equivalent standard</div>
          <div className="text-red-600">Protection system</div><div>:</div><div>Fuses, SPD, MCB / MCCB / RCCB, Chemical Earthing,<br/>Aluminum / GI Earth strip <span className="text-gray-500">(Reputed Brand)</span></div>
          <div className="text-red-600">Distribution boxes</div><div>:</div><div>DC side and AC Side based on requirements <span className="text-gray-500">(Geesys)</span></div>
        </div>
      </Page>

      {/* PAGE 5: BOM */}
      <Page status={safeData.status}>
        <h3 className="text-[15px] font-bold text-sky-600 mb-2 uppercase tracking-wide">2.2 DETAILED BILL OF MATERIAL:</h3>
        
        <table className="w-full border-collapse border border-gray-400 text-[11px]">
          <thead>
            <tr className="bg-orange-500 text-black font-bold">
              <th className="border border-gray-400 p-2 text-center w-[8%]">S.NO</th>
              <th className="border border-gray-400 p-2 text-center w-[40%]">MATERIAL</th>
              <th className="border border-gray-400 p-2 text-center w-[30%]">MAKE</th>
              <th className="border border-gray-400 p-2 text-center w-[10%]">UNIT</th>
              <th className="border border-gray-400 p-2 text-center w-[12%]">QUANTITY</th>
            </tr>
          </thead>
          <tbody className="text-center font-medium">
            {bomData.length > 0 ? bomData.map((b, i) => (
              <tr key={i}>
                <td className="border border-gray-400 p-2">{b.sNo}</td>
                <td className="border border-gray-400 p-2 text-left px-4">{b.material}</td>
                <td className="border border-gray-400 p-2">{b.make}</td>
                <td className="border border-gray-400 p-2">{b.unit}</td>
                <td className="border border-gray-400 p-2 font-bold text-amber-700">{b.qty}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="border border-gray-400 p-10 text-gray-400 italic">Generate BOM by entering System Capacity...</td></tr>
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <p className="text-red-600 font-bold text-sm mb-1">Note:</p>
          <ul className="list-disc pl-5 text-[11px] text-red-600 font-medium">
            <li>Any additional material required other than the given BOQ will be on additional charges.</li>
          </ul>
        </div>
      </Page>

      {/* PAGE 6: ANALYSIS */}
      <Page status={safeData.status}>
        <h2 className="text-xl font-bold text-gray-600 mb-8 uppercase tracking-wide text-center">3. ANALYSIS</h2>
        
        <h3 className="text-[15px] font-bold text-sky-600 mb-4 uppercase">3.1 PREDICTED GENERATION</h3>
        <p className="text-[13px] font-medium text-black mb-6">We estimate the first year annual generation. Please look into the graph shown below,</p>
        
        {/* CSS Chart 1 */}
        <div className="w-full max-w-md mx-auto h-[200px] border-b border-l border-gray-300 relative mb-12 flex items-end justify-between px-2 pt-8 pb-1">
          {/* Y-axis labels */}
          <div className="absolute -left-12 bottom-0 flex flex-col justify-between h-full text-[9px] text-gray-500 pb-1">
            <span>{(finAnalysis.firstYearUnits * 0.1).toFixed(0)}</span>
            <span>{(finAnalysis.firstYearUnits * 0.075).toFixed(0)}</span>
            <span>{(finAnalysis.firstYearUnits * 0.05).toFixed(0)}</span>
            <span>{(finAnalysis.firstYearUnits * 0.025).toFixed(0)}</span>
            <span>0</span>
          </div>
          {/* Bars */}
          {finAnalysis.monthlyGeneration.map((val, i) => (
             <div key={i} className="w-[8%] bg-blue-500 relative flex justify-center shadow-md rounded-t-sm" style={{ height: `${Math.max((val / (finAnalysis.firstYearUnits * 0.1)) * 100, 10)}%` }}>
               <span className="absolute -bottom-4 text-[8px] text-gray-500">
                 {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
               </span>
               <span className="absolute -top-4 text-[7px] text-gray-400 font-bold">{Math.round(val)}</span>
             </div>
          ))}
        </div>

        <h3 className="text-[15px] font-bold text-sky-600 mb-4 uppercase">3.2 CASH FLOW</h3>
        <p className="text-[13px] font-medium text-black mb-6 text-justify">
          Unit rate is assumed at ₹ 6/unit to calculate financial feasibility. Diesel Consumption is not considered in calculating the financials. If considerable diesel consumption is present, then the financial return is higher. Rate of increase of electricity tariffs is assumed at 2% per year.
        </p>
        
        {/* CSS Chart 2 (Pyramid-ish) */}
        <div className="w-full max-w-sm mx-auto h-[160px] border-b border-l border-gray-300 relative mb-12 flex flex-col items-start justify-between py-2 px-1">
           {/* Y-axis labels */}
           <div className="absolute -left-6 top-0 flex flex-col justify-between h-full text-[9px] text-gray-500 text-right pr-2">
            <span>1</span><span>4</span><span>7</span><span>10</span><span>13</span><span>16</span><span>19</span><span>22</span><span>25</span>
          </div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-[6px] bg-sky-400 mb-0.5 rounded-r-full shadow-sm" style={{ width: `${(i+1)*6}%` }}></div>
          ))}
          <div className="absolute -bottom-6 w-full flex justify-between text-[8px] text-gray-500">
             <span>0.00</span>
             <span>{(finAnalysis.totalCost * 0.25).toLocaleString()}</span>
             <span>{(finAnalysis.totalCost * 0.5).toLocaleString()}</span>
             <span>{(finAnalysis.totalCost * 0.75).toLocaleString()}</span>
             <span>{(finAnalysis.totalCost).toLocaleString()}</span>
          </div>
          <div className="absolute -bottom-10 w-full text-center text-[10px] text-gray-500 font-bold">Payback: {finAnalysis.paybackYears} Years</div>
          <div className="absolute -left-10 top-[40%] -rotate-90 text-[10px] text-gray-500 font-bold">Year</div>
        </div>

        <h2 className="text-lg font-bold text-gray-600 mb-4 uppercase tracking-wide">4. TERMS AND CONDITIONS</h2>
        
        <h3 className="text-[15px] font-bold text-sky-600 mb-2 uppercase">4.1 OUR'S SCOPE:</h3>
        <ul className="list-disc pl-8 text-[13px] font-medium text-black space-y-1">
          <li>Conceptual Design and Detailed Engineering.</li>
          <li>Supply and handling of SPV Modules, Solar Inverters, Electrical peripherals, and Structures.</li>
          <li>Loading, Unloading, Shifting and Transportation of all the supplied materials.</li>
          <li>Installation and Commissioning.</li>
        </ul>
      </Page>

      {/* PAGE 7: TERMS CONTINUED */}
      <Page status={safeData.status}>
        <h3 className="text-[15px] font-bold text-sky-600 mb-4 uppercase">4.2 OWNER'S SCOPE:</h3>
        <ul className="list-disc pl-8 text-[13px] font-medium text-black space-y-2 mb-6">
          <li>Necessary following support during installation
            <ol className="list-[lower-roman] pl-6 mt-1 space-y-1">
              <li>Wi-Fi or LAN Cable connection <span className="font-bold">(Only 4G)</span> should be provide nearby solar inverter for the communication purpose</li>
              <li>Power supply for installation purpose and Drinking water should be given.</li>
              <li>Ladders should be provide for installation purpose</li>
              <li>Civil work for <span className="font-bold">Normal Structure</span> (300mm x 300mm x 300mm) and for <span className="font-bold">Special Structure</span> (450mm x 450mm x 450mm) & Earth pit</li>
              <li>In structure area any plumbing / wiring etc., under the ground should be inform before the construct.</li>
              <li>After the panel fixing cleaning work customer scope</li>
            </ol>
          </li>
        </ul>

        <h3 className="text-[15px] font-bold text-sky-600 mb-2 uppercase">4.3 PAYMENT TERMS:</h3>
        <ul className="list-disc pl-8 text-[13px] font-medium text-black space-y-1 mb-4">
          <li>90% advance against Order Confirmation</li>
          <li>10% after Installation and Successful plant commissioning</li>
        </ul>

        <div className="text-[13px] font-medium text-black mb-8">
          <p className="font-bold text-red-600 underline underline-offset-2 mb-1">Bank Details:</p>
          <div className="grid grid-cols-[80px_10px_1fr] gap-y-0.5">
            <div>Name</div><div>:</div><div>SIDA SOLAR INDUSTRY PRIVATE LIMITED</div>
            <div>Bank</div><div>:</div><div>State Bank of India</div>
            <div>Branch</div><div>:</div><div>Commercial Branch</div>
            <div>A/C No</div><div>:</div><div>30341715134</div>
            <div>IFSC Code</div><div>:</div><div>SBIN0007201</div>
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-sky-600 mb-2 uppercase">4.4 PROJECT TIMEFRAME:</h3>
        <ul className="list-disc pl-8 text-[13px] font-medium text-black space-y-1 mb-6">
          <li>25 - 30 working days for Installation and Commissioning from the date of Advance Payment and Order Confirmation.</li>
        </ul>

        <h3 className="text-[15px] font-bold text-sky-600 mb-2 uppercase">4.5 WARRANTY:</h3>
        <ul className="list-disc pl-8 text-[13px] font-medium text-black space-y-1 mb-8">
          <li>25 Years of output warranty for Solar Modules (90% for first 10 years, 80% for next 15 years)</li>
          <li><span className="font-bold">7 Years</span> Performance output warranty for Inverter</li>
          <li>1 Years for BOS as per MNRE Standard</li>
        </ul>

        <p className="text-center text-[13px] font-bold text-black mb-8">Thank you</p>

        <div className="text-[13px] font-medium text-black border-t border-gray-300 pt-6">
          <p className="mb-4">For Sida Solar Industry Private Limited,</p>
          <p className="font-bold text-sky-700">D.Karthick.</p>
          <p>Sales Manager - Gujarat</p>
          <div className="grid grid-cols-[50px_10px_1fr] mt-1">
             <div>Mob</div><div>:</div><div>+91 99446 00377.</div>
             <div>Email</div><div>:</div><div className="text-sky-700 underline underline-offset-2 font-bold">crm@sidasolar.com</div>
          </div>
        </div>
      </Page>
    </div>
  );
});

export default PrintableQuotation;
