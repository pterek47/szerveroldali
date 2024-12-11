using Microsoft.EntityFrameworkCore;
using Beadando.Models.FilmApi.Models;
using System.Collections.Generic;

namespace Beadando.Contexts
{
    public class GyakbeaContext : DbContext
    {
        public GyakbeaContext(DbContextOptions<GyakbeaContext> options) : base(options)
        {
        }

        public DbSet<Film> Films { get; set; }
    }
}