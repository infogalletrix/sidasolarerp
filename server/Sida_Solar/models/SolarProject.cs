using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sida_Solar.models
{
    public class SolarProject
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string ClientName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal SystemSizeKw { get; set; }

        public string PanelBrand { get; set; } = string.Empty;
        public string InverterBrand { get; set; } = string.Empty;

        // "Permitting" | "Installation" | "Inspection" | "PTO"
        public string Stage { get; set; } = "Permitting";

        public string StartDate { get; set; } = string.Empty;
        public string ExpectedCompletionDate { get; set; } = string.Empty;

        public string AssignedTeam { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;

        // Old SitesPage fields
        [Column(TypeName = "decimal(18,2)")]
        public decimal Budget { get; set; }

        public bool IsNegotiated { get; set; } = false;
        public string NegotiationDetails { get; set; } = string.Empty;
        public bool IsArchived { get; set; } = false;

        // JSON stringified arrays/objects
        public string WorkHistory { get; set; } = "[]";
        public string Media { get; set; } = "[]";
        public string Maintenance { get; set; } = "{}";
    }
}
