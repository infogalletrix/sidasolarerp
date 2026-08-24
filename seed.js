const http = require('http');

const API_BASE = 'http://localhost:5000/api';

const postData = (path, data) => {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body)); } catch { resolve(body); }
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
};

async function seed() {
  console.log("Seeding Database...");

  try {
    // 1. CRM Contacts
    console.log("Seeding CRM Contacts...");
    const contacts = [];
    for(let i = 1; i <= 15; i++) {
      const statuses = ["New", "Follow-up", "Converted"];
      const stages = ["New", "Site Visit", "Quotation", "Won", "Lost"];
      const contact = await postData('/crm', {
        name: `Customer ${i}`,
        organizationName: i % 3 === 0 ? `Company ${i} Pvt Ltd` : "",
        phone: `98765000${i.toString().padStart(2, '0')}`,
        email: `customer${i}@example.com`,
        project: `${i*2}kW Rooftop Solar`,
        address: `${i * 10} Main St, Chennai`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        pipelineStage: stages[Math.floor(Math.random() * stages.length)],
        source: "Website",
        tags: ["High Priority", "Residential"],
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        propertyType: "Residential",
        averageMonthlyBill: (Math.random() * 5000 + 1000).toFixed(0),
        requiredCapacity: `${Math.floor(Math.random() * 10 + 2)}kW`
      });
      contacts.push(contact);
    }

    // 1.5 CRM Deals
    console.log("Seeding CRM Deals...");
    const dealStages = ["Lead", "Contacted", "Proposal", "Negotiation", "Won", "Lost"];
    for(let i = 1; i <= 10; i++) {
      await postData('/crm/deals', {
        title: `${Math.floor(Math.random() * 15 + 3)}kW Rooftop Solar System`,
        value: Math.floor(Math.random() * 800000 + 150000),
        closeDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
        stage: dealStages[Math.floor(Math.random() * dealStages.length)],
        contactId: contacts[i].id.toString()
      });
    }

    // 2. Inventory Products
    console.log("Seeding Products...");
    const products = [];
    const pTemplates = [
      { name: "550W Monocrystalline Panel", sku: "PNL-550M", category: "Solar Panels", price: 14500, stock: 150 },
      { name: "5kW String Inverter", sku: "INV-5K", category: "Inverters", price: 45000, stock: 20 },
      { name: "Solar Mounting Structure (Aluminium)", sku: "MNT-AL", category: "Mounting", price: 3500, stock: 500 },
      { name: "4sqmm DC Cable (Per Meter)", sku: "CBL-DC-4", category: "Cables", price: 45, stock: 2000 },
      { name: "ACDB Box", sku: "BOX-ACDB", category: "Electricals", price: 2500, stock: 30 }
    ];
    for(const p of pTemplates) {
      const prod = await postData('/inventory/products', {
        name: p.name,
        sku: p.sku,
        category: p.category,
        brand: "Sida Standards",
        stockQuantity: p.stock,
        unitPrice: p.price,
        description: `High quality ${p.category}`
      });
      products.push(prod);
    }

    // 3. Solar Projects
    console.log("Seeding Projects...");
    const projects = [];
    for(let i = 1; i <= 8; i++) {
      const statuses = ["Completed", "In Progress", "Pre-Construction", "Completed"];
      const stages = ["Installation", "Procurement", "Commissioned", "Site Survey"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const proj = await postData('/solarprojects', {
        title: `Project ${i} - ${i*3}kW Installation`,
        clientName: `Customer ${i+5}`,
        organizationName: i % 2 === 0 ? `Org ${i}` : "",
        budget: i * 150000,
        spent: status === "Completed" ? (i * 150000 * 0.9) : (i * 50000),
        status: status,
        stage: status === "Completed" ? "Commissioned" : stages[Math.floor(Math.random() * stages.length)],
        startDate: "2024-05-10",
        endDate: status === "Completed" ? "2024-06-15" : "",
        address: `${i*15} Park Avenue, Chennai`,
        panelBrand: "Tier-1 Mono",
        inverterBrand: "Smart String",
        systemSizeKw: `${i*3}`
      });
      projects.push(proj);
    }

    // 4. Receipts
    console.log("Seeding Receipts...");
    for(let i = 1; i <= 10; i++) {
      await postData('/finance/receipts', {
        receiptNo: `REC-2024-${i.toString().padStart(3, '0')}`,
        date: new Date(Date.now() - Math.random() * 5000000000).toISOString().split('T')[0],
        siteId: projects[Math.floor(Math.random() * projects.length)].id.toString(),
        clientName: `Customer ${i+5}`,
        totalAmount: (Math.random() * 100000 + 20000).toFixed(0),
        amountPaid: (Math.random() * 100000 + 20000).toFixed(0),
        remainingAmount: 0,
        category: "Advance Payment",
        paymentMode: ["Cash", "UPI", "Bank Transfer"][Math.floor(Math.random() * 3)],
        description: `Payment for Milestone ${Math.floor(Math.random() * 3 + 1)}`,
        status: "Completed"
      });
    }

    // 5. Expenses
    console.log("Seeding Expenses...");
    for(let i = 1; i <= 15; i++) {
      await postData('/finance/expenses', {
        date: new Date(Date.now() - Math.random() * 5000000000).toISOString().split('T')[0],
        amount: (Math.random() * 15000 + 500).toFixed(0),
        category: ["Material", "Labour", "Transport", "Office", "Marketing"][Math.floor(Math.random() * 5)],
        type: "Debit",
        description: `Purchase of materials/services batch ${i}`,
        referenceId: `VOU-${i*100}`,
        payee: `Vendor ${Math.floor(Math.random() * 5 + 1)}`
      });
    }

    console.log("✅ Seeding Completed Successfully!");
  } catch(err) {
    console.error("❌ Seeding Failed:", err);
  }
}

seed();
