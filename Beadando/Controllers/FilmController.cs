﻿using Beadando.Contexts;
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

            // van e ilyen film
            var vanemarilyen = await _context.Films
                .FirstOrDefaultAsync(f => f.Title == newFilm.Title && f.Director == newFilm.Director && f.ReleaseYear == newFilm.ReleaseYear);

            if (vanemarilyen != null)
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
                return NotFound("Nincs ilyen film.");
            }

            _context.Films.Remove(film);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("update-film/{id}")]
        public async Task<IActionResult> UpdateFilmById(int id, [FromBody] Film updatedFilm)
        {
            if (updatedFilm == null)
            {
                return BadRequest("Adatok hiányoznak.");
            }

            try
            {
                var film = await _context.Films.FindAsync(id);

                if (film == null)
                {
                    return NotFound("Nincs ilyen film.");
                }

                // adatok frissitese
                film.Title = updatedFilm.Title ?? film.Title;
                film.Director = updatedFilm.Director ?? film.Director;
                film.ReleaseYear = updatedFilm.ReleaseYear > 0 ? updatedFilm.ReleaseYear : film.ReleaseYear; // ertelmes adatot ad e meg

                // beallitasa
                _context.Entry(film).Property(e => e.Title).IsModified = true;
                _context.Entry(film).Property(e => e.Director).IsModified = true;
                _context.Entry(film).Property(e => e.ReleaseYear).IsModified = true;

                await _context.SaveChangesAsync();

                return Ok(film);
            }
            catch (Exception ex)
            {
                // debuggolasra
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Szerver hiba történt.");
            }
        }
        [HttpGet("search")]
        public IActionResult SearchFilms([FromQuery] string title)
        {
            
            var films = _context.Films
             .AsEnumerable() 
             .Where(f => f.Title.Contains(title, StringComparison.OrdinalIgnoreCase))
             .ToList(); 
         
            return Ok(films);
        }
    }
}