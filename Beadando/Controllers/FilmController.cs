using Beadando.Contexts;
using Microsoft.AspNetCore.Mvc;
using Beadando.Models;
using System.Linq;
using System.Threading.Tasks;
using Beadando.Models.FilmApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Beadando.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmsController : ControllerBase
    {
        private readonly GyakbeaContext _context;

        public FilmsController(GyakbeaContext context)
        {
            _context = context;
        }

        [HttpGet("films")]
        public IActionResult GetAllFilms()
        {
            var films = _context.Films.OrderBy(f => f.Id);

            if (films == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(films);
            }
        }

        [HttpGet("films/{id}")]
        public IActionResult GetFilmById(int id)
        {
            var film = _context.Films.FirstOrDefault(x => x.Id == id);

            if (film == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(film);
            }
        }

        [HttpPost("add-film")]
        public async Task<IActionResult> AddFilm([FromBody] Film newFilm)
        {
            if (newFilm == null)
            {
                return BadRequest("Film is null.");
            }

            // Ellenőrzés, hogy létezik-e már a film
            var existingFilm = await _context.Films
                .FirstOrDefaultAsync(f => f.Title == newFilm.Title && f.Director == newFilm.Director && f.ReleaseYear == newFilm.ReleaseYear);

            if (existingFilm != null)
            {
                return BadRequest("Ez a film már létezik.");
            }

            await _context.Films.AddAsync(newFilm);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFilmById), new { id = newFilm.Id }, newFilm);
        }

        [HttpDelete("delete-film/{id}")]
        public async Task<IActionResult> DeleteFilmById(int id)
        {
            

            var film = await _context.Films.FindAsync(id);

            if (film == null)
            {
                return NotFound("Film not found.");
            }

            _context.Films.Remove(film);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("update-release-year/{id}")]
        public async Task<IActionResult> UpdateReleaseYearById(int id, [FromBody] int releaseYear)
        {
            try
            {
                var film = await _context.Films.FindAsync(id);

                if (film == null)
                {
                    return NotFound();
                }

                film.ReleaseYear = releaseYear;
                _context.Entry(film).Property(e => e.ReleaseYear).IsModified = true;

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                // Logolhatod a kivételt
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Szerver hiba történt.");
            }
        }

    }
}