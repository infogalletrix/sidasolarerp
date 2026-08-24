using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sida_Solar.models;

namespace Sida_Solar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcurementController : ControllerBase
    {
        private readonly SidaSolarDbContext _context;

        public ProcurementController(SidaSolarDbContext context)
        {
            _context = context;
        }

        // ── Suppliers ──

        [HttpGet("suppliers")]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            return await _context.Suppliers.ToListAsync();
        }

        [HttpPost("suppliers")]
        public async Task<ActionResult<Supplier>> CreateSupplier(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
            return Ok(supplier);
        }

        // ── Purchase Orders ──

        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<PurchaseOrder>>> GetPurchaseOrders()
        {
            return await _context.PurchaseOrders
                .Include(po => po.Items)
                .ToListAsync();
        }

        [HttpPost("orders")]
        public async Task<ActionResult<PurchaseOrder>> CreatePurchaseOrder(PurchaseOrder order)
        {
            // Auto generate PO Number if empty
            if (string.IsNullOrEmpty(order.PoNumber))
            {
                var count = await _context.PurchaseOrders.CountAsync();
                order.PoNumber = $"PO-{DateTime.UtcNow.Year}-{count + 1:D3}";
            }

            _context.PurchaseOrders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPost("grn/{poId}")]
        public async Task<IActionResult> ProcessGRN(int poId, [FromBody] List<PurchaseOrderItem> receivedItems)
        {
            var po = await _context.PurchaseOrders
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == poId);
                
            if (po == null) return NotFound("PO not found");

            bool allReceived = true;

            foreach (var receivedItem in receivedItems)
            {
                var dbItem = po.Items.FirstOrDefault(i => i.Id == receivedItem.Id);
                if (dbItem != null)
                {
                    int newlyReceived = receivedItem.QuantityReceived - dbItem.QuantityReceived;
                    dbItem.QuantityReceived = receivedItem.QuantityReceived;

                    if (dbItem.QuantityReceived < dbItem.QuantityOrdered)
                        allReceived = false;

                    // Automatically increase inventory stock
                    if (newlyReceived > 0)
                    {
                        var product = await _context.Products.FindAsync(dbItem.ProductId);
                        if (product != null)
                        {
                            product.StockQuantity += newlyReceived;
                            
                            // Log stock transaction
                            _context.StockTransactions.Add(new StockTransaction {
                                ProductId = product.Id,
                                Quantity = newlyReceived,
                                TransactionType = "IN",
                                Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                                Reference = po.PoNumber,
                                Notes = "Goods Receipt Note (GRN) via PO"
                            });
                        }
                    }
                }
            }

            po.Status = allReceived ? "Received" : "Partially Received";
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "GRN Processed Successfully" });
        }
    }
}
