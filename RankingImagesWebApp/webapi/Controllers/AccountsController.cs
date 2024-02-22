using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IOptions<JwtSettings> _jwtSettings;
        private readonly IWebHostEnvironment _env;

        public AccountsController(UserManager<User> userManager, SignInManager<User> signInManager, IOptions<JwtSettings> jwtSettings, IWebHostEnvironment env)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtSettings = jwtSettings;
            _env = env;
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { msg = "test" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if(user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized();
            }

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var authSigingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Value.Secret));
            var token = new JwtSecurityToken(expires: DateTime.Now.AddHours(24), claims: authClaims, signingCredentials: new SigningCredentials(authSigingKey, SecurityAlgorithms.HmacSha256));

            var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);

            // Create the HTTP-only cookie
            Response.Cookies.Append("access_token", tokenStr, new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddHours(24)
            });

            await _signInManager.SignInAsync(user, true);

            return Ok(new { token = tokenStr, expiration = token.ValidTo });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            await _signInManager.SignOutAsync();

            return Ok(new { message = "Logout successful" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
            if(ModelState.IsValid)
            {
                var iconUrl = await UploadIcon(model.Icon);
                var user = new User
                {
                    UserName = model.Username,
                    Email = model.Email,
                    Gender = model.Gender,
                    Icon = iconUrl is null ? "" : iconUrl
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if(result.Succeeded)
                {
                    return Ok(new { Message = "Registration Success" });
                }

                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPost("icon")]
        public async Task<IActionResult> UploadIconFromEndpoint(IFormFile icon)
        {
            string iconUrl = await UploadIcon(icon);

            if(String.IsNullOrEmpty(iconUrl))
            {
                return BadRequest("No file was uploaded.");
            }

            return Ok(new { iconUrl });
        }

        private async Task<string> UploadIcon(IFormFile icon)
        {
            if(icon is null || icon.Length == 0)
            {
                return null;
            }

            var iconFolderPath = Path.Combine(_env.ContentRootPath, "Images", "Icons");
            if(!Directory.Exists(iconFolderPath))
            {
                Directory.CreateDirectory(iconFolderPath);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + icon.FileName;
            var filePath = Path.Combine(iconFolderPath, uniqueFileName);

            using(var fs = new FileStream(filePath, FileMode.Create))
            {
                await icon.CopyToAsync(fs);
            }

            var iconUrl = Url.Content($"~/Images/Icons/{uniqueFileName}");
            return iconUrl;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                return Ok(new { username = user.UserName, icon = user.Icon, gender = user.Gender, email = user.Email });
            }

            return BadRequest("No matching user.");
        }

        [HttpGet("logged-in")]
        public IActionResult IsLoggedIn()
        {
            var result = _signInManager.Context.User.Identity is null ? false : _signInManager.Context.User.Identity.IsAuthenticated;
            return Ok(new { isLoggedIn = result });
        }
    }
}
