using System.ComponentModel.DataAnnotations;

namespace Sida_Solar.models
{
    public class StockTransaction
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        // "IN" or "OUT"
        public string TransactionType { get; set; } = "OUT";

        public int Quantity { get; set; }

        public string Date { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty; // e.g. Project Title or PO Number
        public string Notes { get; set; } = string.Empty;
    }
}
