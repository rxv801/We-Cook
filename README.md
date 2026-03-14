# Backend setup

`backend/src/UniEats.Api/Properties/launchSettings.json`
```
{
  "profiles": {
    "UniEats.Api": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "http://localhost:5103",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

# Frontend

```
- cd ./frontend/
- bun install
- bun run dev
```