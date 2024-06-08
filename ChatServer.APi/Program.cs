using ChatServer.APi.Hubs;
using Microsoft.AspNetCore.ResponseCompression;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddControllers();
// Add CORS services
builder.Services.AddCors(options =>
{
   options.AddPolicy("AllowAnyOrigin",
       builder =>
       {
          builder.WithOrigins("http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
       });
});

builder.Services.AddResponseCompression(opts =>
{
   opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
      new[] { "application/octer-stream" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
   app.UseDeveloperExceptionPage();
   app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowAnyOrigin"); // Εφαρμογή των ρυθμίσεων CORS

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/inChat");
app.MapHub<ChatHub>("/checkActiveHub");


app.Run();
