namespace Phonebook.Data
{
    using Microsoft.Data.Entity;
    using Models;

    public class PhonebookDbContext : DbContext, IPhonebookDbContext
    {
        public PhonebookDbContext()
        {
            this.Database.EnsureCreated();
        }

        public DbSet<User> Users { get; set; }

        public DbSet<PhoneEntry> PhoneEntries { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=PhonebookDb.sqlite");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasMany(u => u.Phones).WithOne(p => p.Owner).HasForeignKey(p => p.OwnerName);
        }
    }
}
