﻿using FirstAPI.Data;
using FirstAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FirstAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        //static private List<Book> books = new List<Book>
        //{
        //    new Book
        //    {
        //        Id = 1,
        //        Title = "Pan Tadeusz",
        //        Author = "Adam Mickiewicz",
        //        YearPublished = 1834
        //    },
        //    new Book
        //    {
        //        Id = 2,
        //        Title = "Dziady",
        //        Author = "Adam Mickiewicz",
        //        YearPublished = 1822
        //    },
        //    new Book
        //    {
        //        Id = 3,
        //        Title = "Kordian",
        //        Author = "Juliusz Slowacki",
        //        YearPublished = 1834
        //    },
        //    new Book
        //    {
        //        Id = 4,
        //        Title = "Jadro Ciemnosci",
        //        Author = "Joseph Conrad",
        //        YearPublished = 1902
        //    }
        //};
        private readonly FirstAPIContext _context;
        public BooksController(FirstAPIContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<List<Book>>> GetBooks()
        {
            return Ok(await _context.Books.ToListAsync());
        }
        [HttpGet("{id}")]
        public async  Task<ActionResult<Book>> GetBookById(int id)
        {
            var book = await  _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }
        [HttpPost]
        public async  Task<ActionResult<Book>> AddBook(Book newBook)
        {
            if (newBook == null)
            {
                return BadRequest();
            }
            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBookById), new { id = newBook.Id }, newBook);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book updatedBook)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            book.Id = updatedBook.Id;
            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.YearPublished = updatedBook.YearPublished;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
