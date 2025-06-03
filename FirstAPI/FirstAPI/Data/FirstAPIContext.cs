using FirstAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FirstAPI.Data
{
    public class FirstAPIContext : DbContext
    {
        public FirstAPIContext(DbContextOptions<FirstAPIContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>().HasData(
            new Book
            {
                Id = 1,
                Title = "Pan Tadeusz",
                Author = "Adam Mickiewicz",
                YearPublished = 1834
            },
            new Book
            {
                Id = 2,
                Title = "Dziady",
                Author = "Adam Mickiewicz",
                YearPublished = 1822
            },
            new Book
            {
                Id = 3,
                Title = "Kordian",
                Author = "Juliusz Slowacki",
                YearPublished = 1834
            },
            new Book
            {
                Id = 4,
                Title = "Jadro Ciemnosci",
                Author = "Joseph Conrad",
                YearPublished = 1902
            }
                );
        }
        public DbSet<Book> Books { get; set; }
    }
}
