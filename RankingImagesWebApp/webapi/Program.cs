using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using webapi.Data;

public class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors();

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Connect to SQL Server
        builder.Services.AddDbContext<AccountDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("AccountConn")));
        builder.Services.AddDbContext<RankingImagesDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ContentConn")));

        // Remove File Upload Size Limit
        builder.Services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = long.MaxValue;
        });

        // Add Identity
        builder.Services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<AccountDbContext>()
            .AddDefaultTokenProviders();

        // Add Controllers
        builder.Services.AddControllers();

        // Add JWT Authentication Tokens
        var jwtSettings = builder.Configuration.GetSection("JwtSettings");
        builder.Services.Configure<JwtSettings>(jwtSettings);
        var secret = Encoding.ASCII.GetBytes(jwtSettings.Get<JwtSettings>().Secret);

        // Add Authentication
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
        }).AddJwtBearer(token =>
        {
            token.RequireHttpsMetadata = false;
            token.SaveToken = true;
            token.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secret),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });

        // Set Password Requirments
        builder.Services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 6;
            options.Password.RequiredUniqueChars = 2;
        });

        // Build the App
        var app = builder.Build();
        app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:5173"));

        // Middleware to read JWT cookies
        app.Use(async (context, next) =>
        {
            var token = context.Request.Cookies["access_token"];
            if(!String.IsNullOrEmpty(token))
            {
                context.Request.Headers.Add("Authorization", "Bearer " + token);
            }

            await next();
        });

        app.UseAuthentication();
        app.UseAuthorization();

        // Configure the HTTP request pipeline.
        if(app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.MapControllers().WithOpenApi(); // Add Controllers as Endpoints
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Images")),
            RequestPath = "/images",
            OnPrepareResponse = ctx =>
            {
                // Source: https://dev.to/j_sakamoto/how-can-i-protect-static-files-with-authorization-on-asp-net-core-4l0o
                if(ctx.Context.User.Identity == null || !ctx.Context.User.Identity.IsAuthenticated)
                {
                    ctx.Context.Response.StatusCode = (int) HttpStatusCode.Unauthorized; // Respond with 401
                    ctx.Context.Response.ContentLength = 0;
                    ctx.Context.Response.Body = Stream.Null; // Erase the body
                }

                ctx.Context.Response.Headers.Add("Cache-Control", "no-store"); // Prevent from cacheing the file
            }
        }); // Add static files as Endpoints
        app.Run();
    }
}