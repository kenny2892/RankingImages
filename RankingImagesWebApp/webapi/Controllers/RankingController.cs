using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RankingController : ControllerBase
    {
        private readonly RankingImagesDbContext _rankingContext;
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _env;

        public RankingController(RankingImagesDbContext rankingContext, UserManager<User> userManager, IWebHostEnvironment env)
        {
            _rankingContext = rankingContext;
            _userManager = userManager;
            _env = env;
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateRanking([FromBody] string title)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var existingRankings = await _rankingContext.Rankings.ToListAsync();
                var existingTiers = await _rankingContext.Tiers.ToListAsync();
                var existingItems = await _rankingContext.Items.ToListAsync();

                string rankingId = "";
                while(String.IsNullOrEmpty(rankingId) || existingRankings.Any(rank => rank.Id == rankingId))
                {
                    rankingId = Guid.NewGuid().ToString();
                }

                RankingModel rankingEntry = new RankingModel();
                rankingEntry.UserId = user.Id;
                rankingEntry.Id = rankingId;
                rankingEntry.Title = title;

                TiersModel tiersEntry = CreateDefaultTiersModel(user.Id, rankingId, existingTiers);
                ItemsModel itemsEntry = CreateDefaultItemsModel(user.Id, rankingId, existingItems);

                await _rankingContext.Rankings.AddAsync(rankingEntry);
                await _rankingContext.Tiers.AddAsync(tiersEntry);
                await _rankingContext.Items.AddAsync(itemsEntry);
                await _rankingContext.SaveChangesAsync();

                return Ok(new { id = rankingId });
            }

            return Unauthorized();
        }

        private ItemsModel CreateDefaultItemsModel(string userId, string rankingId, IEnumerable<ItemsModel> existingItems)
        {
            string id = "";
            while(String.IsNullOrEmpty(id) || existingItems.Any(item => item.Id == id))
            {
                id = Guid.NewGuid().ToString();
            }

            ItemsModel itemsEntry = new ItemsModel();
            itemsEntry.UserId = userId;
            itemsEntry.RankingId = rankingId;
            itemsEntry.Id = id;

            return itemsEntry;
        }

        private TiersModel CreateDefaultTiersModel(string userId, string rankingId, IEnumerable<TiersModel> existingTiers)
        {
            string id = "";
            while(String.IsNullOrEmpty(id) || existingTiers.Any(tiers => tiers.Id == id))
            {
                id = Guid.NewGuid().ToString();
            }

            TiersModel tiersEntry = new TiersModel();
            tiersEntry.UserId = userId;
            tiersEntry.RankingId = rankingId;
            tiersEntry.Id = id;

            RankingTierModel[] tiers = new RankingTierModel[4];
            tiers[0] = new RankingTierModel() { Index = 0, Name = "Top", Color = "#008000", LabelColor = "#000000" };
            tiers[1] = new RankingTierModel() { Index = 1, Name = "Mid", Color = "#FFFF00", LabelColor = "#000000" };
            tiers[2] = new RankingTierModel() { Index = 2, Name = "Bot", Color = "#FF0000", LabelColor = "#000000" };
            tiers[3] = new RankingTierModel() { Index = 3, Name = "TRASH", Color = "#663399", LabelColor = "#000000" };

            var serializerSettings = new JsonSerializerSettings();
            serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            tiersEntry.Json = JsonConvert.SerializeObject(tiers, serializerSettings);

            return tiersEntry;
        }

        [Authorize]
        [HttpGet("list")]
        public async Task<IActionResult> ListRankings()
        {
            List<RankingModel> rankings = new List<RankingModel>();
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var existingRankings = await _rankingContext.Rankings.ToListAsync();
                rankings.AddRange(existingRankings.Where(ranking => ranking.UserId == user.Id));
            }

            return Ok(rankings.ToArray());
        }

        [Authorize]
        [HttpPost("get-tiers")]
        public async Task<IActionResult> GetTiers([FromBody] string rankingId)
        {
            List<RankingModel> rankings = new List<RankingModel>();
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var tiers = _rankingContext.Tiers.FirstOrDefault(tier => tier.RankingId == rankingId);

                if(tiers != null)
                {
                    return Ok(tiers);
                }

                return NotFound();
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPost("get-items")]
        public async Task<IActionResult> GetItems([FromBody] string rankingId)
        {
            List<RankingModel> rankings = new List<RankingModel>();
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var items = _rankingContext.Items.FirstOrDefault(item => item.RankingId == rankingId);

                if(items != null)
                {
                    return Ok(items);
                }

                return NotFound();
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPost("upload-images")]
        public async Task<IActionResult> UploadImages([FromForm] RankingImageUploadModel model)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var rankings = await _rankingContext.Rankings.ToListAsync();
                var ranking = rankings.FirstOrDefault(ranking => ranking.Id == model.RankingId && ranking.UserId == user.Id);

                if(ranking != null)
                {
                    var rankingImageDir = Path.Combine(_env.ContentRootPath, "Images", "Rankings", user.Id, ranking.Id);

                    if(!Directory.Exists(rankingImageDir))
                    {
                        Directory.CreateDirectory(rankingImageDir);
                    }

                    List<RankingImageModel> newImages = new List<RankingImageModel>();
                    var names = model.Names.Split(",");

                    for(int i = 0; i < model.Images.Count; i++)
                    {
                        var file = model.Images[i];
                        var uniqueFileName = "";

                        while(String.IsNullOrEmpty(uniqueFileName) || System.IO.File.Exists(uniqueFileName))
                        {
                            uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                        }

                        var filePath = Path.Combine(rankingImageDir, uniqueFileName);
                        using(var fs = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(fs);
                        }

                        RankingImageModel newImage = new RankingImageModel();
                        newImage.Filename = uniqueFileName;
                        newImage.Name = names.Length > i ? names[i] : names[^1];
                        newImage.ImageRelativePath = $"/Images/Rankings/{user.Id}/{ranking.Id}/{uniqueFileName}";

                        newImages.Add(newImage);
                    }

                    RankingImageModel[] items = newImages.ToArray();

                    // Add in any existing items
                    var allExistingItems = await _rankingContext.Items.ToListAsync();
                    var itemsEntry = allExistingItems.FirstOrDefault(items => items.RankingId == ranking.Id);

                    while(itemsEntry is null)
                    {
                        ItemsModel itemModel = CreateDefaultItemsModel(user.Id, ranking.Id, allExistingItems);

                        await _rankingContext.Items.AddAsync(itemModel);
                        await _rankingContext.SaveChangesAsync();

                        allExistingItems = await _rankingContext.Items.ToListAsync();
                        itemsEntry = allExistingItems.FirstOrDefault(items => items.RankingId == ranking.Id);
                    }

                    if(!String.IsNullOrEmpty(itemsEntry.Json))
                    {
                        var existingItems = JsonConvert.DeserializeObject<RankingImageModel[]>(itemsEntry.Json)?.ToList();

                        if(existingItems != null)
                        {
                            existingItems.AddRange(items);
                            items = existingItems.ToArray();
                        }
                    }

                    var serializerSettings = new JsonSerializerSettings();
                    serializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    itemsEntry.Json = JsonConvert.SerializeObject(items, serializerSettings);

                    _rankingContext.Items.Update(itemsEntry);
                    await _rankingContext.SaveChangesAsync();

                    return Ok(new { updatedItems = itemsEntry.Json });
                }
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPost("update-title")]
        public async Task<IActionResult> UpdateRankingTitle([FromForm] UpdateRankingTitleModel model)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var rankings = await _rankingContext.Rankings.ToListAsync();
                var ranking = rankings.FirstOrDefault(ranking => ranking.Id == model.RankingId && ranking.UserId == user.Id);

                if(ranking != null)
                {
                    ranking.Title = model.Title;
                    _rankingContext.Rankings.Update(ranking);
                    await _rankingContext.SaveChangesAsync();

                    return Ok();
                }
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPost("update-items")]
        public async Task<IActionResult> UpdateRankingItems([FromForm] UpdateRankingItemsModel model)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var rankings = await _rankingContext.Rankings.ToListAsync();
                var ranking = rankings.FirstOrDefault(ranking => ranking.Id == model.RankingId && ranking.UserId == user.Id);

                if(ranking != null)
                {
                    var allExistingItems = await _rankingContext.Items.ToListAsync();
                    var itemsEntry = allExistingItems.FirstOrDefault(items => items.RankingId == ranking.Id);

                    while(itemsEntry is null)
                    {
                        ItemsModel itemModel = CreateDefaultItemsModel(user.Id, ranking.Id, allExistingItems);

                        await _rankingContext.Items.AddAsync(itemModel);
                        await _rankingContext.SaveChangesAsync();

                        allExistingItems = await _rankingContext.Items.ToListAsync();
                        itemsEntry = allExistingItems.FirstOrDefault(items => items.RankingId == ranking.Id);
                    }

                    // Delete any image files that are not in the ranking
                    RankingImageModel[] items = JsonConvert.DeserializeObject<RankingImageModel[]>(model.ItemJson);

                    if(items != null)
                    {
                        var rankingImageDir = Path.Combine(_env.ContentRootPath, "Images", "Rankings", user.Id, ranking.Id);
                        
                        if(Directory.Exists(rankingImageDir))
                        {
                            var images = Directory.GetFiles(rankingImageDir);
                            foreach(var imageFile in Directory.GetFiles(rankingImageDir))
                            {
                                var imageFilename = Path.GetFileName(imageFile);

                                if(!items.Any(item => item.Filename == imageFilename))
                                {
                                    System.IO.File.Delete(imageFile);
                                }
                            }
                        }
                    }

                    itemsEntry.Json = model.ItemJson;
                    _rankingContext.Items.Update(itemsEntry);
                    await _rankingContext.SaveChangesAsync();

                    return Ok();
                }
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPost("update-tiers")]
        public async Task<IActionResult> UpdateRankingTiers([FromForm] UpdateRankingTiersModel model)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var rankings = await _rankingContext.Rankings.ToListAsync();
                var ranking = rankings.FirstOrDefault(ranking => ranking.Id == model.RankingId && ranking.UserId == user.Id);

                if(ranking != null)
                {
                    var allExistingTiers = await _rankingContext.Tiers.ToListAsync();
                    var tiersEntry = allExistingTiers.FirstOrDefault(tiers => tiers.RankingId == ranking.Id);

                    while(tiersEntry is null)
                    {
                        var tiersModel = CreateDefaultTiersModel(user.Id, ranking.Id, allExistingTiers);

                        await _rankingContext.Tiers.AddAsync(tiersModel);
                        await _rankingContext.SaveChangesAsync();

                        allExistingTiers = await _rankingContext.Tiers.ToListAsync();
                        tiersEntry = allExistingTiers.FirstOrDefault(items => items.RankingId == ranking.Id);
                    }

                    tiersEntry.Json = model.TierJson;
                    _rankingContext.Tiers.Update(tiersEntry);
                    await _rankingContext.SaveChangesAsync();

                    return Ok();
                }
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteRanking([FromBody] string idToDelete)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user != null)
            {
                var rankings = await _rankingContext.Rankings.ToListAsync();
                var ranking = rankings.FirstOrDefault(ranking => ranking.Id == idToDelete && ranking.UserId == user.Id);

                if(ranking != null)
                {
                    // Delete Image Files
                    var rankingImageDir = Path.Combine(_env.ContentRootPath, "Images", "Rankings", user.Id, ranking.Id);
                    if(Directory.Exists(rankingImageDir))
                    {
                        Directory.Delete(rankingImageDir, true);
                    }

                    // Remove Ranking
                    _rankingContext.Rankings.Remove(ranking);

                    // Remove Tiers
                    var existingTiers = await _rankingContext.Tiers.ToListAsync();
                    var tiers = existingTiers.FirstOrDefault(tiers => tiers.RankingId == ranking.Id);
                    
                    if(tiers != null)
                    {
                        _rankingContext.Tiers.Remove(tiers);
                    }

                    // Remove Items
                    var existingItems = await _rankingContext.Items.ToListAsync();
                    var items = existingItems.FirstOrDefault(items => items.RankingId == ranking.Id);

                    if(items != null)
                    {
                        _rankingContext.Items.Remove(items);
                    }

                    await _rankingContext.SaveChangesAsync();

                    return Ok();
                }
            }

            return Unauthorized();
        }
    }
}
