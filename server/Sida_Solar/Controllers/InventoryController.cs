using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sida_Solar.models;

namespace Sida_Solar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly SidaSolarDbContext _context;

        public InventoryController(SidaSolarDbContext context)
        {
            _context = context;
        }

        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpPost("products")]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpGet("transactions")]
        public async Task<ActionResult<IEnumerable<StockTransaction>>> GetTransactions()
        {
            return await _context.StockTransactions.ToListAsync();
        }

        [HttpPost("transactions")]
        public async Task<ActionResult<StockTransaction>> CreateTransaction(StockTransaction transaction)
        {
            _context.StockTransactions.Add(transaction);
            
            var product = await _context.Products.FindAsync(transaction.ProductId);
            if (product != null)
            {
                if (transaction.TransactionType == "IN")
                    product.StockQuantity += transaction.Quantity;
                else if (transaction.TransactionType == "OUT")
                    product.StockQuantity -= transaction.Quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(transaction);
        }

        [HttpGet("equipment")]
        public async Task<ActionResult<IEnumerable<EquipmentItem>>> GetEquipment([FromQuery] int? productId, [FromQuery] int? projectId)
        {
            var query = _context.EquipmentItems.AsQueryable();
            if (productId.HasValue) query = query.Where(e => e.ProductId == productId.Value);
            if (projectId.HasValue) query = query.Where(e => e.SolarProjectId == projectId.Value);
            return await query.ToListAsync();
        }

        [HttpPost("equipment")]
        public async Task<ActionResult<EquipmentItem>> RegisterEquipment(EquipmentItem item)
        {
            _context.EquipmentItems.Add(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut("equipment/{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, EquipmentItem item)
        {
            if (id != item.Id) return BadRequest();

            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
