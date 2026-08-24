using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sida_Solar.models
{
    public class EquipmentItem
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; } // Links to the catalog Product

        [Required]
        public string SerialNumber { get; set; } = string.Empty;

        public string Status { get; set; } = "Available"; // Available, Reserved, Installed, Faulty

        // Link to SolarProject if Installed/Reserved
        public int? SolarProjectId { get; set; }

        public string DateAdded { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
        public string DateInstalled { get; set; } = string.Empty;
        
        public string WarrantyExpiryDate { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;
    }
}
