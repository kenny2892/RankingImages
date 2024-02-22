using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class RankingImagesDbContext : DbContext
    {
        public DbSet<RankingModel> Rankings { get; set; }
        public DbSet<ItemsModel> Items { get; set; }
        public DbSet<TiersModel> Tiers { get; set; }

        public RankingImagesDbContext(DbContextOptions<RankingImagesDbContext> options) : base(options)
        {

        }
    }
}
