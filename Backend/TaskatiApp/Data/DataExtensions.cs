using Microsoft.EntityFrameworkCore;
using TaskatiApp.Models;

namespace TaskatiApp.Data;

public static class DataExtensions
{
        public static void AddTaskatiAppDb(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("TaskatiApp");
        builder.Services.AddSqlite<TaskatiAppContext>(
            connectionString,
            optionsAction: options =>
            {
                options.UseSeeding((context, _) =>
                {
                    var dbContext = (TaskatiAppContext)context;
                    if(!dbContext.Categories.Any())
                    {
                        dbContext.Categories.AddRange(
                            new Category {Name = "Work"},
                            new Category {Name = "Personal"},
                            new Category {Name = "Study"}
                        );

                        dbContext.SaveChanges();
                    }
                });

                options.UseAsyncSeeding(async (context, _, cancellationToken) =>
                {
                    var dbContext = (TaskatiAppContext)context;

                    if(!await dbContext.Categories.AnyAsync(cancellationToken))
                    {
                        dbContext.Categories.AddRange(
                            new Category {Name = "Work"},
                            new Category {Name = "Personal"},
                            new Category {Name = "Study"}
                        );

                        await dbContext.SaveChangesAsync(cancellationToken);
                    }
                });
            } );
    }
    public static async Task MigrateDbAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        
        var dbContext = scope.ServiceProvider.GetRequiredService<TaskatiAppContext>();

        await dbContext.Database.MigrateAsync();
    }
}
