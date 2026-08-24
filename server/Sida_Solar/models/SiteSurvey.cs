using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sida_Solar.models
{
    public class SiteSurvey
    {
        public int Id { get; set; }
        
        [Required]
        public int SolarProjectId { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        
        public string RoofType { get; set; } = string.Empty; // e.g. Shingle, Tile, Flat
        public string RoofCondition { get; set; } = string.Empty;
        public bool HasShadingIssues { get; set; } = false;
        public string ElectricalPanelCapacity { get; set; } = string.Empty; // e.g. 200A
        public bool NeedsMainPanelUpgrade { get; set; } = false;

        // Phase 2 Expansions
        [Column(TypeName = "decimal(18,2)")]
        public decimal AverageMonthlyConsumption { get; set; } // in kWh
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal SanctionedLoad { get; set; } // in kW
        
        public string Phase { get; set; } = "Single Phase"; // Single Phase, Three Phase
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal RoofArea { get; set; } // in sq ft or sq meters
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TiltAngle { get; set; } // in degrees
        
        public string DocumentUploads { get; set; } = "[]"; // JSON array of document URLs (bills/photos)
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal RecommendedSystemCapacity { get; set; } // Auto-calculated in UI

        public string SurveyorNotes { get; set; } = string.Empty;
        public string SurveyDate { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Completed, Action Required
    }
}
