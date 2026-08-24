using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sida_Solar.Migrations
{
    /// <inheritdoc />
    public partial class AddIntelligentQuotationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConsumerNumber",
                table: "Quotations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GeneratedBomData",
                table: "Quotations",
                type: "longtext",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "SystemCapacityKW",
                table: "Quotations",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConsumerNumber",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "GeneratedBomData",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "SystemCapacityKW",
                table: "Quotations");
        }
    }
}
