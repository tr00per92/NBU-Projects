namespace Phonebook.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class User
    {
        [Key]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public virtual ICollection<PhoneEntry> Phones { get; set; } = new HashSet<PhoneEntry>();
    }
}
