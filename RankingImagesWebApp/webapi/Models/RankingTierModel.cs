using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class RankingTierModel
    {
        [Key]
        public int Index { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public string LabelColor { get; set; }
    }
}
