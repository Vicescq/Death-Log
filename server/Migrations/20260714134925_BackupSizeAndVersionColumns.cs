using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class BackupSizeAndVersionColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "SizeBytes",
                table: "Backups",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Backups",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "SizeBytes",
                table: "AutoBackups",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "AutoBackups",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            // Backfill the new columns from the existing jsonb, so rows written
            // before this migration still describe themselves correctly.
            // octet_length on the text form matches Encoding.UTF8.GetByteCount.
            foreach (var table in new[] { "Backups", "AutoBackups" })
            {
                migrationBuilder.Sql(
                    $"""
                    UPDATE "{table}"
                    SET "SizeBytes" = octet_length("Data"::text),
                        "Version" = CASE
                            WHEN jsonb_typeof("Data" -> 'version') = 'number'
                                THEN ("Data" ->> 'version')::int
                            ELSE 0
                        END;
                    """
                );
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizeBytes",
                table: "Backups");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Backups");

            migrationBuilder.DropColumn(
                name: "SizeBytes",
                table: "AutoBackups");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "AutoBackups");
        }
    }
}
