using Microsoft.EntityFrameworkCore;
using TaskatiApp.Models;

namespace TaskatiApp.Data;

public class TaskatiAppContext(DbContextOptions<TaskatiAppContext> options) : DbContext(options)
{
    public DbSet<AppTask> Tasks => Set<AppTask>();

    public DbSet<Category> Categories => Set<Category>();
}