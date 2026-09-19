using TaskatiApp.Data;
using TaskatiApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.AddTaskatiAppDb();

builder.AddAngularCorsPolicy();

builder.Services.AddControllers();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

var app = builder.Build();

await app.MigrateDbAsync();

app.UseAngularCorsPolicy();

app.MapControllers();

app.Run();