using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PhotoGallery.Models.AccountViewModels;
using PhotoGallery.Data.Entities;

namespace PhotoGallery.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ILogger logger;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.logger = loggerFactory.CreateLogger<AccountController>();
        }

        //
        // GET: /Account/Login
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login(string returnUrl = null)
        {
            this.ViewData["ReturnUrl"] = returnUrl;
            return this.View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            this.ViewData["ReturnUrl"] = returnUrl;
            if (this.ModelState.IsValid)
            {
                var result = await this.signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    this.logger.LogInformation(1, "User logged in.");
                    return this.RedirectToLocal(returnUrl);
                }

                if (result.RequiresTwoFactor)
                {
                    this.ModelState.AddModelError(string.Empty, "Two factor auth is disabled.");
                    return this.View(model);
                }

                if (result.IsLockedOut)
                {
                    this.ModelState.AddModelError(string.Empty, "User account locked out.");
                    return this.View(model);
                }

                this.ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                return this.View(model);
            }

            // If we got this far, something failed, redisplay form
            return this.View(model);
        }

        //
        // GET: /Account/Register
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Register(string returnUrl = null)
        {
            this.ViewData["ReturnUrl"] = returnUrl;
            return this.View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model, string returnUrl = null)
        {
            this.ViewData["ReturnUrl"] = returnUrl;
            if (this.ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await this.userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
                    // Send an email with this link
                    //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    //var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                    //await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
                    //    $"Please confirm your account by clicking this link: <a href='{callbackUrl}'>link</a>");
                    await this.signInManager.SignInAsync(user, isPersistent: false);
                    this.logger.LogInformation(3, "User created a new account with password.");
                    return this.RedirectToLocal(returnUrl);
                }
                this.AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return this.View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LogOff()
        {
            await this.signInManager.SignOutAsync();
            this.logger.LogInformation(4, "User logged out.");
            return this.RedirectToAction(nameof(HomeController.Index), "Home");
        }

        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                this.ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (this.Url.IsLocalUrl(returnUrl))
            {
                return this.Redirect(returnUrl);
            }
            else
            {
                return this.RedirectToAction(nameof(HomeController.Index), "Home");
            }
        }

        #endregion
    }
}
