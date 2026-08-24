using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sida_Solar.Migrations
{
    /// <inheritdoc />
    public partial class ExpandSolarProjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Budget",
                table: "SolarProjects",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "SolarProjects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsNegotiated",
                table: "SolarProjects",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Maintenance",
                table: "SolarProjects",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Media",
                table: "SolarProjects",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NegotiationDetails",
                table: "SolarProjects",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WorkHistory",
                table: "SolarProjects",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Budget",
                table: "SolarProjects");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "SolarProjects");

            migrationBuilder.DropColumn(
                name: "IsNegotiated",
                table: "SolarProjects");

            migrationBuilder.DropColumn(
                name: "Maintenance",
                table: "SolarProjects");

            migrationBuilder.DropColumn(
                name: "Media",
                table: "SolarProjects");

            migrationBuilder.DropColumn(
                name: "NegotiationDetails",
                table: "SolarProjects");

            migrationBuilder.DropColumn(
                name: "WorkHistory",
                table: "SolarProjects");
        }
    }
}
