using TaskatiApp.Data;
using TaskatiApp.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.AddTaskatiAppDb();

builder.AddAngularCorsPolicy();

var app = builder.Build();

await app.MigrateDbAsync();

app.UseAngularCorsPolicy();

app.MapTasksEndpoints();
app.MapCategoriesEndpoints();

app.Run();