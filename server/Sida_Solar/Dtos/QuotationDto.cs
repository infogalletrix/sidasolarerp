using System.Text.Json;

namespace Sida_Solar.Dtos
{
    public class QuotationDto
    {
        public string? Id { get; set; }
        public string? QuoteNo { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string? OrganizationName { get; set; }
        public string ClientAddress { get; set; } = string.Empty;
        public string ProjectTitle { get; set; } = string.Empty;
        public string WorkDescription { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string BillType { get; set; } = "GST";
        // Items come as raw JSON from frontend
        public JsonElement? Items { get; set; }
        public decimal Total { get; set; }
        public string? Status { get; set; }
        public int? DealId { get; set; }

        public double SystemCapacityKW { get; set; } = 0;
        public string ConsumerNumber { get; set; } = string.Empty;
        public JsonElement? GeneratedBomData { get; set; }
        public JsonElement? ApprovalHistory { get; set; }
    }
}

