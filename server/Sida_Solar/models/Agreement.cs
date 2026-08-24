using System;
using System.ComponentModel.DataAnnotations;

namespace Sida_Solar.models
{
    public class Agreement
    {
        public int Id { get; set; }
        
        [Required]
        public string AgreementNo { get; set; } = string.Empty;

        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        public string Type { get; set; } = "B2C"; // B2C or B2B

        public int ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;

        public decimal ContractValue { get; set; }
        public string PaymentTerms { get; set; } = string.Empty;

        // B2C Specific
        public string? SystemCapacity { get; set; }
        public string? WarrantyPeriod { get; set; }

        // B2B Specific
        public string? GstNumber { get; set; }
        public string? AuthorizedSignatory { get; set; }
        public string? Designation { get; set; }
        public string? ProjectScope { get; set; }

        public string Status { get; set; } = "Generated"; // Generated, Signed, Cancelled
    }
}
