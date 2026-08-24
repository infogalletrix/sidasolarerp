using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sida_Solar.models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string Category { get; set; } = string.Empty; // Panel, Inverter, Battery, Mount, Cable
        public string Brand { get; set; } = string.Empty;
        public string ModelNumber { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        public int StockQuantity { get; set; } = 0;
        public int MinimumStockAlert { get; set; } = 5;
    }
}
