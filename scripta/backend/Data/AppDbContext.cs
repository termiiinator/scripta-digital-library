using Microsoft.EntityFrameworkCore;
using Scripta.API.Models;

namespace Scripta.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
    }
}
        