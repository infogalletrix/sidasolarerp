using Microsoft.EntityFrameworkCore;
using Sida_Solar.models;

namespace Sida_Solar
{
    public class SidaSolarDbContext : DbContext
    {
        public SidaSolarDbContext(DbContextOptions<SidaSolarDbContext> options) : base(options) { }

        // ── Legacy (Kept for compatibility if needed, or remove) ─────────────────
        public DbSet<Client> Clients { get; set; }

        // ── CRM ─────────────────────────────────────────────────────
        public DbSet<CrmContact> CrmContacts { get; set; }
        public DbSet<Deal> Deals { get; set; }
        public DbSet<Activity> Activities { get; set; }

        // ── Solar Projects ──────────────────────────────────────────
        public DbSet<SolarProject> SolarProjects { get; set; }
        public DbSet<SiteSurvey> SiteSurveys { get; set; }

        // ── Inventory ───────────────────────────────────────────────
        public DbSet<Product> Products { get; set; }
        public DbSet<StockTransaction> StockTransactions { get; set; }
        public DbSet<EquipmentItem> EquipmentItems { get; set; }
        public DbSet<ServiceTicket> ServiceTickets { get; set; }

        // ── Procurement ───────────────────────────────────────────────
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }

        // ── Finance ─────────────────────────────────────────────────
        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<Agreement> Agreements { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<PayrollRecord> PayrollRecords { get; set; }
        public DbSet<PaymentReceipt> PaymentReceipts { get; set; }

        // ── HR ──────────────────────────────────────────────────────
        public DbSet<Employee> Employees { get; set; }
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; }
    }
}


