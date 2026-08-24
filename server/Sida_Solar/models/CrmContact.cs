using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sida_Solar.models
{
    public class CrmContact
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string OrganizationName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Project { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        // "Hot" | "Warm" | "Cold"
        public string Status { get; set; } = "Cold";

        // Lead source e.g. Instagram, Referral
        public string Source { get; set; } = string.Empty;

        // Stored as JSON array string e.g. ["Modern","Kitchen"]
        public string Tags { get; set; } = "[]";

        public string Date { get; set; } = string.Empty;

        // Solar CRM Expansion Fields
        public string PipelineStage { get; set; } = "New"; // New, Contacted, Site Visit, Proposal, Negotiation, Won, Lost
        public string PropertyType { get; set; } = string.Empty; // Residential, Commercial, Industrial
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal AverageMonthlyBill { get; set; }
        
        public string RequiredCapacity { get; set; } = string.Empty; // e.g. "5.5 kW"
        
        public string AssignedSalesperson { get; set; } = string.Empty;
        public string NextFollowUpDate { get; set; } = string.Empty;
        
        [Column(TypeName = "longtext")]
        public string FollowUpHistory { get; set; } = "[]"; // JSON array of interactions
        
        [Column(TypeName = "longtext")]
        public string Documents { get; set; } = "[]"; // JSON array of uploaded document URLs
    }
}

