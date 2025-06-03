using First_front_back.Server.Data;
using First_front_back.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.ComponentModel.DataAnnotations;

namespace First_front_back.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {

        private readonly First_front_backContext _context;
        public ContactsController(First_front_backContext context)
        {
            _context = context;
        }

        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.EnhancedHashPassword(password, 12);
        }


    [HttpGet]
        public async  Task<ActionResult<List<Contact>>> GetContacts()
        {
            return Ok(await _context.Contacts.ToListAsync());
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var contact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.Email == request.Email);

            if (contact == null || !BCrypt.Net.BCrypt.EnhancedVerify(request.Password, contact.Password)) 
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(new { Message = "Login successful" });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<List<Contact>>> GetContactById(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }
            return Ok(contact);
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> AddContact([FromBody] Contact newContact)
        {
            if (newContact == null)
            {
                return BadRequest();
            }
            Console.WriteLine($"Odebrano kontakt: Name = {newContact.Name}, Surname = {newContact.Surname}");
            newContact.Password = HashPassword(newContact.Password);
            _context.Contacts.Add(newContact);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetContactById), new { id = newContact.Id }, newContact);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int  id, [FromBody] Contact updatedContact)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (updatedContact == null)
            {
                return NotFound();
            }
            if (!ModelState.IsValid) return BadRequest(ModelState);
            contact.Name = updatedContact.Name;
            contact.Surname = updatedContact.Surname;
            contact.Email = updatedContact.Email;
            contact.Phone = updatedContact.Phone;
            contact.Password = HashPassword(updatedContact.Password);
            contact.Category = updatedContact.Category;
            contact.SubCategory = updatedContact.SubCategory;
            contact.BirthDate = updatedContact.BirthDate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactById(int id) 
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class LoginRequest
        {
            [Required] public string Email { get; set; }
            [Required] public string Password { get; set; }
        }


    }


}
