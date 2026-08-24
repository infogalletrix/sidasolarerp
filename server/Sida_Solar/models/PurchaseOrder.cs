using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sida_Solar.models
{
    public class PurchaseOrder
    {
        public int Id { get; set; }

        [Required]
        public string PoNumber { get; set; } = string.Empty; // e.g. PO-2026-001

        [Required]
        public int SupplierId { get; set; }

        public string OrderDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
        public string ExpectedDeliveryDate { get; set; } = string.Empty;

        // Draft, Sent, Partially Received, Received (GRN), Cancelled
        public string Status { get; set; } = "Draft";

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; }

        public string Notes { get; set; } = string.Empty;

        public List<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    }

    public class PurchaseOrderItem
    {
        public int Id { get; set; }
        
        [Required]
        public int PurchaseOrderId { get; set; }

        [Required]
        public int ProductId { get; set; } // Link to Inventory Product

        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; } = 0; // Track GRN

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; } // QuantityOrdered * UnitPrice
    }
}
