namespace PhotoGallery.Data
{
    using Entities;
    using Microsoft.EntityFrameworkCore;

    public interface IPhotoGalleryDbContext
    {
        DbSet<Photo> Photos { get; }

        DbSet<ApplicationUser> Users { get; }

        int SaveChanges();
    }
}
