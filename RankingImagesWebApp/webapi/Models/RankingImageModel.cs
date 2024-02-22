using System;

namespace webapi.Models
{
    public class RankingImageModel
    {
        public string Filename { get; set; }
        public string Name { get; set; }
        public string ImageRelativePath { get; set; }
        public int RankingTier { get; set; } = -1;
        public int RankingIndex { get; set; } = -1;
    }
}
