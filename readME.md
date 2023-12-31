
## Hotel Reservations System

Welcome to the Hotel Reservations System, a full-stack web application for managing hotel room reservations. This project includes a backend API developed with Node.js and Express.js, hosted on Railway, and a frontend application hosted on Netlify. The project is done by Ehtisham Ahmed Gondal.


## API Reference

#### Get all rooms

```http
  GET /api/rooms/fetchRooms
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get room

```http
  GET /api/rooms/fetchRooms/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Add Room

```http
  GET /api/rooms/addRoom
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Add like

```http
  GET /api/rooms/likes/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Add comments

```http
  GET /api/rooms/comments/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Reserve Room

```http
  GET /api/rooms/reservation/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Delete Rerservation

```http
  GET /api/rooms/deleteReservation/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |


### Get All Reservation 

```http
  GET /api/rooms/getAllReservations:
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |


## Live 

https://pak-hotel-reservations.netlify.app/

## API 

https://hotelreservationssystemmern-production.up.railway.app 
## Deployment

To deploy this project run go to Server Directory

```bash
  nodemon .\app.js
```

## HMS Tour Video

[![Tour Video](https://img.youtube.com/vi/9T6CqIo2PyU/0.jpg)](https://youtu.be/9T6CqIo2PyU)


## Roadmap

- Node js, Express js
- JavaScript Vanilla ES6
- MongoDB Atlas


## Environment Variables

The App will work fine but if you want to add new end point so you need key to connect to mongodb Atlas, you will need to add the following environment variables to your .env file this file should be in server folder

`API_KEY`

`*************************************************`





## Authors

- [@Ehtisham Ahmed Gondal](https://github.com/ShamiGondal)


