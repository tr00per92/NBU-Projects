using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PhotoGallery.Models.ManageViewModels;
using PhotoGallery.Data.Entities;

namespace PhotoGallery.Controllers
{
    [Authorize]
    public class ManageController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ILogger logger;

        public ManageController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILoggerFactory loggerFactory)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.logger = loggerFactory.CreateLogger<ManageController>();
        }

        //
        // GET: /Manage/Index
        [HttpGet]
        public async Task<IActionResult> Index(ManageMessageId? message = null)
        {
            this.ViewData["StatusMessage"] =
                message == ManageMessageId.ChangePasswordSuccess ? "Your password has been changed."
                : message == ManageMessageId.SetPasswordSuccess ? "Your password has been set."
                : message == ManageMessageId.SetTwoFactorSuccess ? "Your two-factor authentication provider has been set."
                : message == ManageMessageId.Error ? "An error has occurred."
                : message == ManageMessageId.AddPhoneSuccess ? "Your phone number was added."
                : message == ManageMessageId.RemovePhoneSuccess ? "Your phone number was removed."
                : "";

            var user = await this.GetCurrentUserAsync();
            if (user == null)
            {
                return this.View("Error");
            }

            var model = new IndexViewModel
            {
                HasPassword = await this.userManager.HasPasswordAsync(user),
                PhoneNumber = await this.userManager.GetPhoneNumberAsync(user),
                TwoFactor = await this.userManager.GetTwoFactorEnabledAsync(user),
                Logins = await this.userManager.GetLoginsAsync(user),
                BrowserRemembered = await this.signInManager.IsTwoFactorClientRememberedAsync(user)
            };

            return this.View(model);
        }
        
        //
        // GET: /Manage/ChangePassword
        [HttpGet]
        public IActionResult ChangePassword()
        {
            return this.View();
        }

        //
        // POST: /Manage/ChangePassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.View(model);
            }

            var user = await this.GetCurrentUserAsync();
            if (user != null)
            {
                var result = await this.userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
                if (result.Succeeded)
                {
                    await this.signInManager.SignInAsync(user, isPersistent: false);
                    this.logger.LogInformation(3, "User changed their password successfully.");
                    return this.RedirectToAction(nameof(this.Index), new { Message = ManageMessageId.ChangePasswordSuccess });
                }

                this.AddErrors(result);
                return this.View(model);
            }

            return this.RedirectToAction(nameof(this.Index), new { Message = ManageMessageId.Error });
        }
        
        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                this.ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        public enum ManageMessageId
        {
            AddPhoneSuccess,
            AddLoginSuccess,
            ChangePasswordSuccess,
            SetTwoFactorSuccess,
            SetPasswordSuccess,
            RemoveLoginSuccess,
            RemovePhoneSuccess,
            Error
        }

        private Task<ApplicationUser> GetCurrentUserAsync()
        {
            return this.userManager.GetUserAsync(this.HttpContext.User);
        }

        #endregion
    }
}
