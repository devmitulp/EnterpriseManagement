var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseHttpsRedirection();

app.MapGet("/", () => "EnterpriseManagement API — Step 1 Scaffolding Initialized");

app.Run();
