using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace webapi.Models
{
    public class RankingImageUploadModel
    {
        public string RankingId { get; set; }
        public string Names { get; set; }
        public List<IFormFile> Images { get; set; }
    }
}
