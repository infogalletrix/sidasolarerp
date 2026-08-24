export const generateBom = (capacityKW) => {
  if (!capacityKW || capacityKW <= 0) return [];
  
  const numPanels = Math.ceil((capacityKW * 1000) / 615); // Using 615W panels
  const panelCapacityText = `Solar Panel (615 WP N Type Topcon Bifacial)`;
  const inverterText = `Inverter - ${capacityKW} kw (Three Phase)`;
  const dcCableRed = capacityKW * 13.33; // Approx calculation
  const dcCableBlack = capacityKW * 13.33;
  
  return [
    { sNo: 1, material: panelCapacityText, make: "Goldi Solar", unit: "No's", qty: numPanels },
    { sNo: 2, material: inverterText, make: "Deye", unit: "No's", qty: 1 },
    { sNo: 3, material: "GI Structure", make: "GI", unit: "Kw", qty: capacityKW },
    { sNo: 4, material: `DCDB BOX ${capacityKW}KW`, make: "Geesys", unit: "No's", qty: 1 },
    { sNo: 5, material: `ACDB BOX ${capacityKW}KW`, make: "Geesys", unit: "No's", qty: 1 },
    { sNo: 6, material: "AC Cables", make: "4CX6 Sqmm CU Flexible Cable", unit: "Mtr", qty: Math.ceil(capacityKW * 1.6) },
    { sNo: 7, material: "DC Cables - Red", make: "1CX4 Sqmm CU Flexible Cable", unit: "Mtr", qty: Math.ceil(dcCableRed) },
    { sNo: 8, material: "DC Cables - Black", make: "1CX4 Sqmm CU Flexible Cable", unit: "Mtr", qty: Math.ceil(dcCableBlack) },
    { sNo: 9, material: "Module - Module Earthing Cable", make: "1CX6 Sqmm CU Flexible Cable with CU Lugs", unit: "Mtr", qty: Math.ceil(capacityKW * 1.6) },
    { sNo: 10, material: "AC & DC Earthing Cable", make: "1CX6 Sqmm CU Flexible Cable", unit: "Mtr", qty: "As required" },
    { sNo: 11, material: "Earthing Rod & Materials", make: "Chemical earthing system with 1.2 mtrs, 14 mm dia of copper earth electrode, 10 kg of chemical compound", unit: "No's", qty: capacityKW > 5 ? 3 : 2 },
    { sNo: 12, material: "MC4 Connectors Female", make: "-", unit: "No's", qty: "As Required" },
    { sNo: 13, material: "MC4 Connectors Male", make: "-", unit: "No's", qty: "As Required" },
    { sNo: 14, material: "Cable Lugs AC (Pin/Round Type)", make: "-", unit: "No's", qty: "As Required" },
    { sNo: 15, material: "Upvc Conduit, L & T Bends", make: "Upvc Pipe 20mm & 25mm", unit: "Mtr", qty: "As Required" },
    { sNo: 16, material: "Cable Tie", make: "-", unit: "Packet", qty: "As Required" },
    { sNo: 17, material: "Insulation Tape", make: "-", unit: "No's", qty: "As Required" },
    { sNo: 18, material: "Lightning Arrestor Conventional type", make: "-", unit: "No's", qty: 1 }
  ];
};

export const generateTechSpecs = (capacityKW) => {
    return {
        projectType: "Grid-Tie",
        installationType: "Rooftop",
        roofClassification: "Slope Roof",
        metering: "Net Meter",
        customerCategory: "Domestic",
        electricalConnectivity: "LT",
        pvModules: {
            desc: "PV Modules",
            spec: `615 WP N Type Topcon Bifacial\nMake: Goldi`
        },
        inverter: {
            desc: "Inverter",
            spec: `${capacityKW} kw (Three Phase)\nNominal Output Voltage: 400V, 50Hz\nIn house MPPT\nEfficiency: 98%\nMake: Deye`
        },
        structure: {
            desc: "Module Mounting\nStructure",
            spec: `GI / AL Structures\nWind speed of 150Km/hr.\nFasteners: GI`
        }
    };
};

export const generateFinancialAnalysis = (capacityKW) => {
    const unitRate = 6;
    // Assuming roughly 4 units per kW per day -> 1460 units/kW/year.
    const firstYearUnits = capacityKW * 1460; 
    const firstYearSavings = firstYearUnits * unitRate;

    // Monthly breakdown (approx % of annual)
    const monthPercents = [9.5, 9.3, 8.5, 7.5, 7.5, 7.3, 7.2, 6.5, 5.5, 6.0, 7.0, 8.2];
    const monthlyGeneration = monthPercents.map(p => (firstYearUnits * (p / 100)).toFixed(2));

    const totalCost = capacityKW * 45000; // rough estimate price per kW
    const paybackYears = (totalCost / firstYearSavings).toFixed(1);

    return {
        firstYearUnits,
        firstYearSavings,
        totalCost,
        paybackYears,
        monthlyGeneration
    };
};
