const http = require('http');

http.get('http://localhost:5000/api/employees', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const employees = JSON.parse(data);
    const activeEmps = employees.filter(e => e.status === 'Active');
    console.log(`Found ${activeEmps.length} active employees`);
    
    if (activeEmps.length === 0) return;
    
    const d = new Date();
    const currentMonthIdx = d.getMonth();
    const isReleased = d.getDate() > 25;
    const initialMaxMonthIdx = isReleased ? currentMonthIdx : currentMonthIdx - 1;
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const month = initialMaxMonthIdx < 0 ? MONTHS[11] : MONTHS[initialMaxMonthIdx];
    const year = initialMaxMonthIdx < 0 ? d.getFullYear() - 1 : d.getFullYear();
    
    const payrolls = activeEmps.slice(0, 5).map((emp, i) => {
      const basic = parseInt(emp.salary) || 20000;
      const otPayment = i % 2 === 0 ? 1000 : 0;
      const deductions = i === 1 ? 500 : 0;
      const netPay = basic + otPayment - deductions;
      
      const entry = {
        id: 'PR-SAL-' + Date.now() + i,
        type: 'Salary',
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        month: month,
        year: year,
        basic: basic,
        otHours: otPayment > 0 ? 5 : 0,
        otRate: otPayment > 0 ? 200 : 0,
        otPayment: otPayment,
        advanceDeduction: deductions,
        otherDeductions: 0,
        netPay: netPay,
        paidDays: 30,
        lopDays: 0,
        paidOn: d.toISOString().split('T')[0],
        method: 'Bank Transfer'
      };
      
      return {
        employeeId: emp.id,
        month: month,
        year: year,
        baseSalary: basic,
        deductions: deductions,
        netPay: netPay,
        paidDate: entry.paidOn,
        status: 'Paid',
        attendanceBreakdown: entry
      };
    });

    payrolls.forEach(payload => {
      const req = http.request('http://localhost:5000/api/finance/payroll', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      });
      req.write(JSON.stringify(payload));
      req.end();
    });
    
    console.log('Sample payrolls inserted.');
  });
});
