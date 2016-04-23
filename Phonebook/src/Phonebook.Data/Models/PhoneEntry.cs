namespace Phonebook.Data.Models
{
    using System.ComponentModel.DataAnnotations;

    public class PhoneEntry
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string OwnerName { get; set; }

        public virtual User Owner { get; set; }
    }
}
