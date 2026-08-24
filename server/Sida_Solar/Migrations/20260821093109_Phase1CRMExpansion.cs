using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sida_Solar.Migrations
{
    /// <inheritdoc />
    public partial class Phase1CRMExpansion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssignedSalesperson",
                table: "CrmContacts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "AverageMonthlyBill",
                table: "CrmContacts",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Documents",
                table: "CrmContacts",
                type: "longtext",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FollowUpHistory",
                table: "CrmContacts",
                type: "longtext",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NextFollowUpDate",
                table: "CrmContacts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PipelineStage",
                table: "CrmContacts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PropertyType",
                table: "CrmContacts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequiredCapacity",
                table: "CrmContacts",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedSalesperson",
                table: "CrmContacts");

            migrationBuilder.DropColumn(
                name: "AverageMonthlyBill",
                table: "CrmContacts");

            migrationBuilder.DropColumn(
                name: "Documents",
                table: "CrmContacts");

            migrationBuilder.DropColumn(
                name: "FollowUpHistory",
                table: "CrmContacts");

            migrationBuilder.DropColumn(
                name: "NextFollowUpDate",
                table: "CrmContacts");

            migrationBuilder.DropColumn(
                name: "PipelineStage",
                table: "CrmContacts");

            migrationBuilder.DropColumn(
                name: "PropertyType",
                table: "CrmContacts");

            migrationBuilder.DropColumn(
                name: "RequiredCapacity",
                table: "CrmContacts");
        }
    }
}
