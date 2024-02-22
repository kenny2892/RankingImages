using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class RegisterModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Gender { get; set; }

        public IFormFile? Icon { get; set; }
    }
}
