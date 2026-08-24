using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sida_Solar.models
{
    public class ServiceTicket
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "Open"; // Open, Assigned, In Progress, Resolved, Closed

        public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical

        public int SolarProjectId { get; set; }

        // Optional link to a specific faulty equipment
        public int? EquipmentItemId { get; set; }

        // Assigned Technician
        public int? AssignedToId { get; set; }

        public string CreatedDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
        
        public string ScheduledVisitDate { get; set; } = string.Empty;

        public string ResolutionNotes { get; set; } = string.Empty;
        public string ResolvedDate { get; set; } = string.Empty;
    }
}
