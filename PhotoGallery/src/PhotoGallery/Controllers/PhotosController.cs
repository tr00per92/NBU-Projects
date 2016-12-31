namespace PhotoGallery.Controllers
{
    using System;
    using System.IO;
    using System.Linq;
    using Data;
    using Data.Entities;
    using Helpers;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.StaticFiles;
    using Models;

    [Authorize]
    public class PhotosController : Controller
    {
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly IPhotoGalleryDbContext db;

        public PhotosController(IHostingEnvironment hostingEnvironment, IPhotoGalleryDbContext db)
        {
            this.hostingEnvironment = hostingEnvironment;
            this.db = db;
        }

        [AllowAnonymous]
        public IActionResult All()
        {
            var photos = this.db.Photos.Select(PhotoModel.FromEntity);
            this.ViewBag.Title = "All Photos";
            return this.View("List", photos);
        }

        public IActionResult Mine()
        {
            var userId = this.User.GetId();
            var photos = this.db.Photos.Where(p => p.UserId == userId).Select(PhotoModel.FromEntity);
            this.ViewBag.Title = "My Photos";
            return this.View("List", photos);
        }

        public IActionResult Photo(int id)
        {
            var photo = this.db.Photos.SingleOrDefault(p => p.Id == id);
            if (photo == null)
            {
                throw new ArgumentException("Photo not found.");
            }

            this.ViewBag.Title = photo.Title;
            return this.View(PhotoModel.FromEntity(photo));
        }

        public IActionResult Upload()
        {
            return this.View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Upload(IFormFile photo, string title)
        {
            if (photo == null || string.IsNullOrWhiteSpace(title))
            {
                throw new ArgumentException("Missing photo or title.");
            }

            var userId = this.User.GetId();
            var uniqueName = Guid.NewGuid() + Path.GetExtension(photo.FileName);

            var saveDirectory = Path.Combine(this.hostingEnvironment.ContentRootPath, "AppData", userId);
            Directory.CreateDirectory(saveDirectory);
            using (var fileStream = System.IO.File.Create(Path.Combine(saveDirectory, uniqueName)))
            {
                photo.CopyTo(fileStream);
            }

            var entity = new Photo { FileName = uniqueName, UserId = userId, Title = title };
            this.db.Photos.Add(entity);
            this.db.SaveChanges();

            return this.RedirectToAction(nameof(this.Photo), new { id = entity.Id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Delete(int id)
        {
            var photo = this.db.Photos.SingleOrDefault(p => p.Id == id);
            if (photo == null)
            {
                throw new ArgumentException("Invalid id.");
            }

            this.db.Photos.Remove(photo);
            this.db.SaveChanges();

            return this.RedirectToAction(nameof(this.Mine));
        }

        [AllowAnonymous]
        public IActionResult RawPhoto(string photoPath)
        {
            var path = Path.Combine(this.hostingEnvironment.ContentRootPath, "AppData", photoPath);
            var contentType = GetContentType(path);

            return this.File(System.IO.File.ReadAllBytes(path), contentType);
        }

        private static string GetContentType(string fileName)
        {
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out contentType);
            return contentType ?? "application/octet-stream";
        }
    }
}
