using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scripta.API.Data;
using Scripta.API.Models;

namespace Scripta.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BooksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(book);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var books = await _context.Books.ToListAsync();
            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
                return NotFound();

            return Ok(book);
        }
    }
}
