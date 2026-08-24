using System.ComponentModel.DataAnnotations;

namespace Sida_Solar.models
{
    public class Supplier
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string GstNumber { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Active"; // Active, Inactive
        public string Notes { get; set; } = string.Empty;
    }
}
