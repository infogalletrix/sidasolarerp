using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sida_Solar.models;

namespace Sida_Solar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceTicketsController : ControllerBase
    {
        private readonly SidaSolarDbContext _context;

        public ServiceTicketsController(SidaSolarDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceTicket>>> GetServiceTickets()
        {
            return await _context.ServiceTickets.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceTicket>> GetServiceTicket(int id)
        {
            var ticket = await _context.ServiceTickets.FindAsync(id);
            if (ticket == null) return NotFound();
            return ticket;
        }

        [HttpPost]
        public async Task<ActionResult<ServiceTicket>> CreateServiceTicket(ServiceTicket ticket)
        {
            _context.ServiceTickets.Add(ticket);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetServiceTicket), new { id = ticket.Id }, ticket);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceTicket(int id, ServiceTicket ticket)
        {
            if (id != ticket.Id) return BadRequest();

            if (ticket.Status == "Resolved" || ticket.Status == "Closed")
            {
                if (string.IsNullOrEmpty(ticket.ResolvedDate))
                    ticket.ResolvedDate = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
            }

            _context.Entry(ticket).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceTicket(int id)
        {
            var ticket = await _context.ServiceTickets.FindAsync(id);
            if (ticket == null) return NotFound();

            _context.ServiceTickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TicketExists(int id)
        {
            return _context.ServiceTickets.Any(e => e.Id == id);
        }
    }
}
