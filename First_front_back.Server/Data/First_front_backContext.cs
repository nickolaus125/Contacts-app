using First_front_back.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace First_front_back.Server.Data
{
    public class First_front_backContext : DbContext
    {
        public First_front_backContext(DbContextOptions<First_front_backContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Contact>().HasData(
               new Contact
               {
                    Id = 1,
                    Name = "Jan",
                    Surname = "Kowalski",
                    Phone = 111,
                    Email = "jankowalski@wp.pl",
                    Password = "1234",
                    Category = "CEO",
                    SubCategory = "CEO Superior",
                    BirthDate = "01.02.1999"

               },
                new Contact
                {
                    Id = 2,
                    Name = "Anna",
                    Surname = "Nowak",
                    Phone = 124,
                    Email = "anna_nowak@gmail.com",
                    Password = "alamakota",
                    Category = "Accountant",
                    SubCategory = "Main accountant",
                    BirthDate = "14.12.1998"

                }
                );

            modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Business" },
            new Category { Id = 2, Name = "Personal" },
            new Category { Id = 3, Name = "Other" }
            );

            modelBuilder.Entity<SubCategory>().HasData(
            new SubCategory { Id = 1, Name = "Boss" },
            new SubCategory { Id = 2, Name = "Customer" }
            );
        }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Category> Categories { get; set; }

        public DbSet<SubCategory> SubCategories { get; set; }

    }
}
