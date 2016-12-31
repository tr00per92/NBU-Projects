namespace PhotoGallery.Data.Entities
{
    using System.ComponentModel.DataAnnotations;

    public class Photo
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
