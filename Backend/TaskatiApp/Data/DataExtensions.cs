using Microsoft.EntityFrameworkCore;

namespace TaskatiApp.Data;

public static class DataExtensions
{
        public static void AddTaskatiAppDb(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("TaskatiApp");
        builder.Services.AddSqlite<TaskatiAppContext>(connectionString);
    }
    public static async Task MigrateDbAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        
        var dbContext = scope.ServiceProvider.GetRequiredService<TaskatiAppContext>();

        await dbContext.Database.MigrateAsync();
    }
}
