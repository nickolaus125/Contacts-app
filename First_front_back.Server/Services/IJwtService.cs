using System.Security.Claims;
using First_front_back.Server.Models;

namespace First_front_back.Server.Services
{
    public interface IJwtService
    {
        string GenerateToken(Contact user);
        ClaimsPrincipal? ValidateToken(string token);
    }
}
