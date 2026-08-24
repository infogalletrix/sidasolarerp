using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sida_Solar.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovalHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApprovalHistory",
                table: "Quotations",
                type: "longtext",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalHistory",
                table: "Quotations");
        }
    }
}
