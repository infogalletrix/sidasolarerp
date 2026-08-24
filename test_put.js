const http = require('http');

const data = JSON.stringify({
  id: 1,
  title: "Project 1 - 3kW Installation",
  clientName: "Customer 6",
  address: "15 Park Avenue, Chennai",
  systemSizeKw: 3,
  panelBrand: "Tier-1 Mono",
  inverterBrand: "Smart String",
  stage: "Site Survey",
  startDate: "2024-05-10",
  expectedCompletionDate: "",
  assignedTeam: "",
  notes: "",
  budget: 150000,
  isNegotiated: false,
  negotiationDetails: "",
  isArchived: false,
  workHistory: "[]",
  media: "[]",
  maintenance: "{}"
});

const options = {
  hostname: 'localhost',
  port: 5031,
  path: '/api/solarprojects/1',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
