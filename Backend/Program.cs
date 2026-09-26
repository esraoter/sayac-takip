using Backend.Data;
using Backend.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Frontend'in bu API'ye erişebilmesi için CORS izni
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

// --- Cihaz (Device) Endpoint'leri ---

app.MapGet("/", () => "Sayaç Takip API çalışıyor.");
app.MapGet("/devices", () => Store.Devices);

app.MapPost("/devices", (Device device) =>
{
    device.Id = Store.NextDeviceId++;
    Store.Devices.Add(device);
    return Results.Created($"/devices/{device.Id}", device);
});

app.MapDelete("/devices/{id}", (int id) =>
{
    var device = Store.Devices.FirstOrDefault(d => d.Id == id);
    if (device is null) return Results.NotFound();
    Store.Devices.Remove(device);
    return Results.NoContent();
});

// --- Okuma (Reading) Endpoint'leri ---

app.MapGet("/devices/{deviceId}/readings", (int deviceId) =>
    Store.Readings.Where(r => r.DeviceId == deviceId));

app.MapPost("/devices/{deviceId}/readings", (int deviceId, Reading reading) =>
{
    if (reading.Value < 0)
        return Results.BadRequest("Okuma değeri negatif olamaz.");

    reading.Id = Store.NextReadingId++;
    reading.DeviceId = deviceId;
    Store.Readings.Add(reading);
    return Results.Created($"/devices/{deviceId}/readings/{reading.Id}", reading);
});

app.Run();