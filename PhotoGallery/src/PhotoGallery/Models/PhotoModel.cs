namespace PhotoGallery.Models
{
    using System.IO;
    using Data.Entities;

    public class PhotoModel
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string UserId { get; set; }

        public string Url { get; set; }

        public static PhotoModel FromEntity(Photo entity)
        {
            return new PhotoModel
            {
                Id = entity.Id,
                Title = entity.Title,
                UserId = entity.UserId,
                Url = Path.Combine(entity.UserId, entity.FileName)
            };
        }
    }
}
