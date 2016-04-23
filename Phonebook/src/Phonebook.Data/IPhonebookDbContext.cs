namespace Phonebook.Data
{
    using Microsoft.Data.Entity;
    using Models;

    public interface IPhonebookDbContext
    {
        DbSet<User> Users { get; }

        DbSet<PhoneEntry> PhoneEntries { get; }

        int SaveChanges();
    }
}