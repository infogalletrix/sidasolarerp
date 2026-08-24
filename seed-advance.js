const http = require('http');

http.get('http://localhost:5000/api/employees', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const employees = JSON.parse(data);
    const activeEmps = employees.filter(e => e.status === 'Active');
    console.log(`Found ${activeEmps.length} active employees for advance`);
    
    if (activeEmps.length === 0) return;
    
    const d = new Date();
    const currentMonthIdx = d.getMonth();
    const isReleased = d.getDate() > 25;
    const initialMaxMonthIdx = isReleased ? currentMonthIdx : currentMonthIdx - 1;
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const month = initialMaxMonthIdx < 0 ? MONTHS[11] : MONTHS[initialMaxMonthIdx];
    const year = initialMaxMonthIdx < 0 ? d.getFullYear() - 1 : d.getFullYear();
    
    // Create an advance for the first employee
    const emp = activeEmps[0];
    const entry = {
      id: 'PR-ADV-' + Date.now(),
      type: 'Advance',
      employeeId: emp.id,
      employeeName: emp.name,
      month: month,
      year: year,
      amount: 5000,
      paidOn: d.toISOString().split('T')[0],
      method: 'Bank Transfer',
    };

    const payload = {
      employeeId: emp.id,
      month: month,
      year: year,
      baseSalary: 0,
      deductions: 0,
      netPay: 5000,
      paidDate: entry.paidOn,
      status: 'Paid',
      attendanceBreakdown: entry
    };

    const req = http.request('http://localhost:5000/api/finance/payroll', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    });
    req.write(JSON.stringify(payload));
    req.end();
    
    console.log('Sample advance inserted.');
  });
});
