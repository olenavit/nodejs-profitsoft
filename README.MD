# About

A Node.js express project that has endpoints described below


## How to run the app
1. docker compose build
2. docker compose up
3. npm run devel

## How to run tests
1. npm run test

### Endpoints

| Method | URL                 | Description                                                                         |
|--------|---------------------|-------------------------------------------------------------------------------------|
| `GET`  | `/practice`         | Get practice by player id. Query params: playerId(required), size, from             |
| `POST` | `/practice`         | Create a new team. [Example of body](#create-practice)                              |
| `POST` | `/practice/_counts` | Returns practises count by specified player ids [Example of body](#practice-counts) |

####

## Create Practice

```json
{
  "name": "Training1",
  "playerId": 1,
  "date": "2028-09-25"
}
```

## Practice Counts

```json
{
  "playerIds": [
    "1",
    "2"
  ]
}
```
