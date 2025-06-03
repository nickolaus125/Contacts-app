using First_front_back.Server.Data;
using First_front_back.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace First_front_back.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCategoriesController : ControllerBase
    {
        private readonly First_front_backContext _context;

        public SubCategoriesController(First_front_backContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<SubCategory>>> GetSubCategories()
        {
            return Ok(await _context.SubCategories.ToListAsync());
        }
    }
}
