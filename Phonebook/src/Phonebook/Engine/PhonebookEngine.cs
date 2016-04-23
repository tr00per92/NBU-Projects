namespace Phonebook.Engine
{
    using System;
    using System.Linq;
    using CryptoHelper;
    using Data;   
    using Data.Models;

    public class PhonebookEngine : IPhonebookEngine
    {
        private readonly IPhonebookDbContext dbContext;
        private string currentUser;

        public PhonebookEngine(IPhonebookDbContext dbContext)
        {
            if (dbContext == null)
            {
                throw new ArgumentNullException(nameof(dbContext));
            }

            SeedData(dbContext);
            this.dbContext = dbContext;
        }

        public string Register(string username, string password)
        {
            if (this.dbContext.Users.Any(u => u.Username == username))
            {
                return "This username already exists.";
            }

            var user = new User { Username = username, PasswordHash = Crypto.HashPassword(password) };
            this.dbContext.Users.Add(user);
            this.dbContext.SaveChanges();
            this.currentUser = user.Username;
            return $"Registration successful. Hello {this.currentUser}.";
        }

        public string Login(string username, string password)
        {
            var user = this.dbContext.Users.FirstOrDefault(u => u.Username == username);
            if (user == null)
            {
                return "Such user do not exist.";
            }

            if (!Crypto.VerifyHashedPassword(user.PasswordHash, password))
            {
                return "Wrong password.";
            }

            this.currentUser = username;
            return $"Login successful. Hello {this.currentUser}.";
        }

        public string Logout()
        {
            this.currentUser = null;
            return "Logout successful.";
        }

        public string InsertPhone(string name, string number)
        {
            this.Authorize();
            if (this.dbContext.PhoneEntries.Any(p => p.OwnerName == this.currentUser && p.Name == name))
            {
                return "This phone number already exists.";
            }

            var phoneEntry = new PhoneEntry { Name = name, PhoneNumber = number, OwnerName = this.currentUser };
            this.dbContext.PhoneEntries.Add(phoneEntry);
            this.dbContext.SaveChanges();

            return "Phone number saved successfully.";
        }

        public string DeletePhone(string name)
        {
            this.Authorize();
            var entry = this.dbContext.PhoneEntries.SingleOrDefault(p => p.OwnerName == this.currentUser && p.Name == name);
            if (entry == null)
            {
                return "Such phone number do not exist.";
            }

            this.dbContext.PhoneEntries.Remove(entry);
            this.dbContext.SaveChanges();

            return "Phone number deleted successfully.";
        }

        public string ListPhones(string searchText = null)
        {
            this.Authorize();
            var phones = this.dbContext.PhoneEntries.Where(p => p.OwnerName == this.currentUser);
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                phones = phones.Where(p => p.Name.Contains(searchText));
            }

            var results = phones.Select(p => $"{p.Name} - {p.PhoneNumber}").ToList();
            if (!results.Any())
            {
                return "No phone numbers found.";
            }

            return string.Join(Environment.NewLine, results);
        }

        private void Authorize()
        {
            if (this.currentUser == null)
            {
                throw new UnauthorizedAccessException();
            }
        }

        private static void SeedData(IPhonebookDbContext dbContext)
        {
            if (!dbContext.Users.Any())
            {
                dbContext.Users.Add(new User
                {
                    Username = "test",
                    PasswordHash = Crypto.HashPassword("123")
                });

                dbContext.SaveChanges();
            }

            if (!dbContext.PhoneEntries.Any())
            {
                dbContext.PhoneEntries.Add(new PhoneEntry
                {
                    Name = "Pesho",
                    PhoneNumber = "+359888777999",
                    OwnerName = "test"
                });

                dbContext.PhoneEntries.Add(new PhoneEntry
                {
                    Name = "Gosho",
                    PhoneNumber = "+359888555666",
                    OwnerName = "test"
                });

                dbContext.PhoneEntries.Add(new PhoneEntry
                {
                    Name = "Ivan",
                    PhoneNumber = "+359888468985",
                    OwnerName = "test"
                });

                dbContext.PhoneEntries.Add(new PhoneEntry
                {
                    Name = "Tosho",
                    PhoneNumber = "0989123987",
                    OwnerName = "test"
                });

                dbContext.SaveChanges();
            }
        }
    }
}
