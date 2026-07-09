using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ChartType
{
    [JsonStringEnumMemberName("bar")]
    Bar,

    [JsonStringEnumMemberName("pie")]
    Pie,

    [JsonStringEnumMemberName("line")]
    Line,

    [JsonStringEnumMemberName("time-line")]
    Timeline,

    [JsonStringEnumMemberName("calendar")]
    Calendar,

    [JsonStringEnumMemberName("sunburst")]
    Sunburst,
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum StatsTab
{
    Overview,
    Specialized,
}

public record CategoryPoint(
    [Required, MaxLength(DTOConstants.MaxLen), MinLength(1)] string X,
    [Required] decimal Y
);

public record SunburstNode(
    [Required, MaxLength(DTOConstants.MaxLen), MinLength(1)] string Name,
    [Required] decimal Value,
    [Required] List<SunburstNode> Children
);

public record ScatterPoint(
    [Required, MaxLength(DTOConstants.MaxLen), MinLength(1)] string Name,
    [Required] decimal X,
    [Required] decimal Y
);

public record SharedChartSpec(
    [Required] ChartType Type,
    [Required, MaxLength(DTOConstants.MaxLen), MinLength(1)] string Title,
    [Required] SharedChartSpecData Data
);

public record SharedChartSpecData(
    List<CategoryPoint>? Category = null,
    List<SunburstNode>? Sunburst = null,
    List<ScatterPoint>? Scatter = null
);

public record SharedChartSlot(
    [Required, MinLength(1)] string Id,
    [Required] StatsTab Tab,
    [Required] SharedChartSpec Spec
);

public record SharedProfileView(
    int FollowerCount,
    int FollowingCount,
    List<SharedChartSlot> ChartSlots
);

public record SharedProfile
{
    [Required]
    public required List<SharedChartSlot> ChartSlots { get; init; }

    public bool ValidateSpecRules()
    {
        List<bool> flags = [];
        for (int i = 0; i < ChartSlots.Count; i++)
        {
            SharedChartSpec spec = ChartSlots[i].Spec;

            bool isValidCategoryPoint =
                spec.Data.Category != null
                && spec.Data.Scatter == null
                && spec.Data.Sunburst == null;

            bool isValidSunburstNode =
                spec.Data.Sunburst != null
                && spec.Data.Scatter == null
                && spec.Data.Category == null;

            bool isValidScatterPoint =
                spec.Data.Scatter != null
                && spec.Data.Category == null
                && spec.Data.Sunburst == null;

            switch (spec.Type)
            {
                case ChartType.Bar:
                    flags.Add(isValidCategoryPoint);
                    break;
                case ChartType.Pie:
                    flags.Add(isValidCategoryPoint);
                    break;
                case ChartType.Line:
                    flags.Add(isValidCategoryPoint);
                    break;
                case ChartType.Timeline:
                    flags.Add(isValidCategoryPoint);
                    break;
                case ChartType.Calendar:
                    flags.Add(isValidCategoryPoint);
                    break;
                case ChartType.Sunburst:
                    flags.Add(isValidSunburstNode);
                    break;
            }
        }
        return flags.All(flag => flag);
    }
}
