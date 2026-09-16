using TaskatiApp.Data;
using TaskatiApp.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.AddTaskatiAppDb();

var app = builder.Build();

await app.MigrateDbAsync();

app.MapTasksEndpoints();
app.MapCategoriesEndpoints();

app.Run();
