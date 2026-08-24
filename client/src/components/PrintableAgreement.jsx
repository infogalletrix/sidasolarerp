import React, { forwardRef } from "react";
import logoImage from "../assets/logo.png";

const Header = () => (
  <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
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

const Page = ({ children }) => (
  <div className="w-[210mm] min-h-[296mm] max-h-[297mm] mx-auto bg-white flex flex-col pt-10 pb-8 px-12 text-slate-800 font-sans shadow-lg mb-8 border border-gray-200 box-border relative print:shadow-none print:border-none print:mb-0 print:m-0" style={{ pageBreakAfter: 'always', breakAfter: 'page' }}>
    <Header />
    <div className="flex-grow flex flex-col pt-4 relative z-10">
      {children}
    </div>
    <Footer />
  </div>
);

const PrintableAgreement = forwardRef(({ activeTab, client, form }, ref) => {
  const isB2C = activeTab === "b2c";
  const date = new Date().toLocaleDateString("en-GB");

  return (
    <div ref={ref} className="bg-gray-100 print:bg-transparent text-black font-serif">
      <Page>
        <div className="text-center mb-10 mt-6">
          <h2 className="text-3xl font-black text-gray-800 tracking-widest uppercase border-b-2 border-gray-800 inline-block pb-2 px-8">
            MASTER SERVICE AGREEMENT
          </h2>
          <p className="text-sm font-bold text-gray-500 mt-3 uppercase tracking-widest">
            {isB2C ? "Residential Solar Installation" : "Commercial / Enterprise Installation"}
          </p>
        </div>

        <div className="text-[13px] leading-relaxed text-justify mb-8 space-y-4">
          <p>
            This Master Service Agreement ("Agreement") is made and entered into on this <span className="font-bold border-b border-dotted border-gray-500 px-2">{date}</span> (the "Effective Date"), by and between:
          </p>
          <div className="pl-6 space-y-3">
            <p>
              <span className="font-bold text-sky-800 uppercase">Sida Solar Industry Private Limited</span>, a company incorporated under the Companies Act, 2013, having its registered office at Keshod, Gujarat (hereinafter referred to as the <strong>"Service Provider"</strong> or <strong>"Company"</strong>),
            </p>
            <p className="font-bold text-center">AND</p>
            <p>
              <span className="font-bold text-sky-800 uppercase">{isB2C ? (client?.name || "[Client Name]") : (client?.organizationName || client?.name || "[Company Name]")}</span>, 
              {isB2C ? " an individual residing at " : " having its principal place of business at "}
              <span className="font-bold border-b border-dotted border-gray-500 px-2">{client?.address || "[Client Address]"}</span> 
              (hereinafter referred to as the <strong>"Client"</strong>).
            </p>
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-sky-800 mb-3 border-b border-gray-300 pb-1">1. SCOPE OF WORK</h3>
        {isB2C ? (
          <p className="text-[13px] leading-relaxed mb-6">
            The Service Provider agrees to design, supply, install, and commission a <span className="font-bold">{form.systemCapacity || "[Capacity]"}</span> Solar PV System at the Client's premises. The scope includes all necessary equipment, panels, inverters, and basic mounting structures as per standard specifications.
          </p>
        ) : (
          <p className="text-[13px] leading-relaxed mb-6">
            The Service Provider agrees to execute the following project scope: <span className="font-bold">{form.projectScope || "[Project Scope]"}</span>. This includes end-to-end EPC services tailored to the commercial requirements of the Client.
          </p>
        )}

        <h3 className="text-[15px] font-bold text-sky-800 mb-3 border-b border-gray-300 pb-1">2. COMMERCIALS & PAYMENT TERMS</h3>
        <table className="w-full border-collapse border border-gray-400 text-[13px] mb-6">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 font-bold bg-gray-50 w-1/3">Total Contract Value</td>
              <td className="border border-gray-400 p-2 font-bold text-sky-800">INR {parseFloat(form.contractValue || 0).toLocaleString()} /-</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-bold bg-gray-50">Payment Terms</td>
              <td className="border border-gray-400 p-2">{form.paymentTerms || "[Payment Terms]"}</td>
            </tr>
            {isB2C && (
              <tr>
                <td className="border border-gray-400 p-2 font-bold bg-gray-50">Warranty Period</td>
                <td className="border border-gray-400 p-2">{form.warrantyPeriod || "[Warranty Period]"}</td>
              </tr>
            )}
            {!isB2C && (
              <tr>
                <td className="border border-gray-400 p-2 font-bold bg-gray-50">GST Number</td>
                <td className="border border-gray-400 p-2">{form.gstNumber || "[GST Number]"}</td>
              </tr>
            )}
          </tbody>
        </table>

        <h3 className="text-[15px] font-bold text-sky-800 mb-3 border-b border-gray-300 pb-1">3. TERMS & CONDITIONS</h3>
        <ul className="list-disc pl-6 text-[13px] leading-relaxed space-y-2 mb-8">
          <li>The total contract value is exclusive of any unforeseen civil or structural modifications required at the site.</li>
          <li>Net Metering and related liaisoning fees with DISCOM are separate and not included in this contract value unless explicitly stated.</li>
          <li>The Company shall not be liable for any delays caused due to force majeure events, including extreme weather or delayed government approvals.</li>
          <li>Any default in payment as per the schedule will attract an interest penalty of 1.5% per month.</li>
          <li>Title and ownership of the equipment shall remain with the Company until full payment is realized.</li>
        </ul>

        <div className="mt-auto">
          <p className="text-[13px] italic text-center mb-10">
            IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.
          </p>

          <div className="flex justify-between items-end mt-16 px-4">
            <div className="w-64 text-center">
              <div className="border-b border-gray-400 mb-2 h-10"></div>
              <p className="font-bold text-[13px]">For Sida Solar</p>
              <p className="text-[11px] text-gray-500 mt-1">Authorized Signatory</p>
            </div>
            
            <div className="w-64 text-center">
              <div className="border-b border-gray-400 mb-2 h-10"></div>
              <p className="font-bold text-[13px]">For {isB2C ? (client?.name || "Client") : (client?.organizationName || client?.name || "Client")}</p>
              {!isB2C && form.authorizedSignatory && (
                <p className="text-[12px] font-medium">{form.authorizedSignatory}</p>
              )}
              {!isB2C && form.designation && (
                <p className="text-[11px] text-gray-600">{form.designation}</p>
              )}
              {isB2C && (
                <p className="text-[11px] text-gray-500 mt-1">Client Signature</p>
              )}
            </div>
          </div>
        </div>
      </Page>
    </div>
  );
});

export default PrintableAgreement;
