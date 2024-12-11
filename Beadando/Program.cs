using Beadando.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using Beadando.Contexts;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllersWithViews();

// mysql
builder.Services.AddDbContext<GyakbeaContext>(options =>
    options.UseMySql(builder.Configuration["ConnectionString:DbConnection"],
        new MySqlServerVersion(new Version(8, 0, 25))));


builder.Services.AddSwaggerGen(); // Swagger 


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

// swaggerek
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger(); 
    app.UseSwaggerUI(); 
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
    pattern: "{controller=Home}/{action=Index}/{id?}"); // alapertelmezett

app.Run();
