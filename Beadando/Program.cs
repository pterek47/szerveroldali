using Beadando.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using Beadando.Contexts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure Entity Framework Core
builder.Services.AddDbContext<GyakbeaContext>(options =>
    options.UseMySql(builder.Configuration["ConnectionString:DbConnection"],
        new MySqlServerVersion(new Version(8, 0, 25))));

// Add Swagger services for API documentation
builder.Services.AddSwaggerGen(); // Swagger regisztrálása

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:5000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger(); // Swagger middleware engedélyezése
    app.UseSwaggerUI(); // Swagger UI engedélyezése
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Configure CORS
app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"); // Alapértelmezett route konfigurálása

app.Run();
