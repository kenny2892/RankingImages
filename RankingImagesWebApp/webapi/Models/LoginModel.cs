﻿using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class LoginModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
