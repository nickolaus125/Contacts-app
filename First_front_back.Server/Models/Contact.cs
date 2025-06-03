namespace First_front_back.Server.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Category { get; set; } = null!;

        public string SubCategory { get; set; } = null!;

        public int Phone { get; set; }

        public string BirthDate { get; set; } = null!;
    }
}
