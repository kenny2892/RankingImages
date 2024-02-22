using Microsoft.AspNetCore.Identity;
using System;

namespace webapi.Data
{
    public class User : IdentityUser
    {
        public string Gender { get; set; }
        public string Icon { get; set; }
    }
}
