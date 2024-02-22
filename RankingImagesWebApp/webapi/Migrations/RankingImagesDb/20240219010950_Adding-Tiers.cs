using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations.RankingImagesDb
{
    /// <inheritdoc />
    public partial class AddingTiers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Json",
                table: "Rankings",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "TiersJson",
                table: "Rankings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TiersJson",
                table: "Rankings");

            migrationBuilder.AlterColumn<string>(
                name: "Json",
                table: "Rankings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
