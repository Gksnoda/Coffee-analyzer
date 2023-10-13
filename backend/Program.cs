using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using backend.Data;
using backend.View.Interface;
using backend.View;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var mySqlConnection = builder.Configuration.GetConnectionString("dbConnection");
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(mySqlConnection, Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.34-mysql")));

builder.Services.AddScoped<IDias, DiasView>();

// Configure the HTTP request pipeline.
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

// Configure Swagger if you're in the development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

// Run the application
app.Run();
