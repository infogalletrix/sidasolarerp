using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sida_Solar.models;

namespace Sida_Solar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SiteSurveysController : ControllerBase
    {
        private readonly SidaSolarDbContext _context;

        public SiteSurveysController(SidaSolarDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SiteSurvey>>> GetAllSurveys()
        {
            return await _context.SiteSurveys.ToListAsync();
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<SiteSurvey>> GetSurveyByProject(int projectId)
        {
            var survey = await _context.SiteSurveys.FirstOrDefaultAsync(s => s.SolarProjectId == projectId);
            if (survey == null) return NotFound();
            return survey;
        }

        [HttpPost]
        public async Task<ActionResult<SiteSurvey>> CreateSurvey(SiteSurvey survey)
        {
            _context.SiteSurveys.Add(survey);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSurveyByProject), new { projectId = survey.SolarProjectId }, survey);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSurvey(int id, SiteSurvey survey)
        {
            if (id != survey.Id) return BadRequest();

            _context.Entry(survey).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(survey);
        }
    }
}
