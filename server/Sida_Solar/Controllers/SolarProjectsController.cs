using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sida_Solar.models;

namespace Sida_Solar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SolarProjectsController : ControllerBase
    {
        private readonly SidaSolarDbContext _context;

        public SolarProjectsController(SidaSolarDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SolarProject>>> GetProjects()
        {
            return await _context.SolarProjects.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SolarProject>> GetProject(int id)
        {
            var project = await _context.SolarProjects.FindAsync(id);
            if (project == null) return NotFound();
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<SolarProject>> CreateProject(SolarProject project)
        {
            _context.SolarProjects.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, SolarProject project)
        {
            project.Id = id;

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.SolarProjects.FindAsync(id);
            if (project == null) return NotFound();

            _context.SolarProjects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.SolarProjects.Any(e => e.Id == id);
        }
    }
}
