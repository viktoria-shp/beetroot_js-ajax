# JS-MODULE-COBRA - VSCODE REST CLIENT

## Setup

Plugin: [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

Add next code to the `.vscode/settings.json` file:

```json
{
  "rest-client.environmentVariables": {
    "$shared": {
      "host": "https://jsonplaceholder.typicode.com",
      "api": "https://jsonplaceholder.typicode.com"
    }
  }
}
```
