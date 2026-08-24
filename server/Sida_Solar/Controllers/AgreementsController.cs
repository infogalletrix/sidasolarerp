using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sida_Solar.models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sida_Solar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgreementsController : ControllerBase
    {
        private readonly SidaSolarDbContext _context;

        public AgreementsController(SidaSolarDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Agreement>>> GetAgreements()
        {
            return await _context.Agreements.OrderByDescending(a => a.Date).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Agreement>> CreateAgreement(Agreement agreement)
        {
            if (string.IsNullOrEmpty(agreement.AgreementNo))
            {
                var today = System.DateTime.Now;
                var count = await _context.Agreements.CountAsync(a => a.Date.Date == today.Date);
                agreement.AgreementNo = $"AGR-{today:ddMMyy}-{(count + 1):D4}";
            }

            if (agreement.Date == default)
            {
                agreement.Date = System.DateTime.Now;
            }

            _context.Agreements.Add(agreement);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAgreements), new { id = agreement.Id }, agreement);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAgreement(int id, Agreement agreement)
        {
            if (id != agreement.Id) return BadRequest();

            _context.Entry(agreement).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAgreement(int id)
        {
            var agreement = await _context.Agreements.FindAsync(id);
            if (agreement == null) return NotFound();

            _context.Agreements.Remove(agreement);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
