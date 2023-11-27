const mongoose = require('mongoose');
const express = require('express');
const Room = require('../model/rooms');
const multer = require('multer');
const moment = require('moment'); 
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//.end point to fetch the rooms

router.get('/fetchRooms', [], async (req, res) => {

  try {

    const allRooms = await Room.find()
    res.json(allRooms)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }

})


//end point to fetch the rooms with id
router.get('/fetchRoom/:id', [], async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {

    const singleRoom = await Room.findOne({ _id: id });
    res.json(singleRoom)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }

})


//end point to add the room

router.post('/addRoom', upload.single('picture'), async (req, res) => {

  try {

    const { picture, name, description, Rtype, comments, likes, price } = req.body;
    const newRoom = new Room({ picture, name, description, Rtype, comments, likes, price });
    const savedRoom = await newRoom.save()
    res.json(savedRoom)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred +backend");
  }

});


//end point to like the room
router.post('/likes/:id', [], async (req, res) => {
  const roomId = req.params.id.replace(/["']/g, '');

  try {
    const hotelRoom = await Room.findById(roomId);
    if (!hotelRoom) {
      return res.status(404).json({ success: false, message: 'Hotel room not found' });
    }
    if (hotelRoom.likes === undefined) {
      return res.status(500).json({ success: false, message: 'Likes property not found in the hotel room' });
    }
    hotelRoom.likes += 1;
    await hotelRoom.save();
    res.json({ success: true, message: 'Like increased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//end point to comment on room
router.post('/comments/:id', [], async (req, res) => {
  try {
    const id = req.params.id;

    const hotelRoom = await Room.findById(id);
    if (!hotelRoom) {
      return res.status(404).json({ success: false, message: 'Hotel room not found' });
    }
    if (hotelRoom.comments === undefined) {
      return res.status(500).json({ success: false, message: 'comment property not found in the hotel room' });
    }
    const { comments } = req.body;
    hotelRoom.comments.push(comments);
    await hotelRoom.save()
    res.json({ success: true, message: 'Comment added successfully', hotelRoom });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }

})

//end point to reserve the room
router.post('/reservation/:id', [], async (req, res) => {
  const roomId = req.params.id.replace(/["']/g, '');

  try {
    const hotelRoom = await Room.findById(roomId);
    if (!hotelRoom) {
      return res.status(404).json({ success: false, message: 'Hotel room not found' });
    }

    if (!hotelRoom.reservation) {
      return res.status(500).json({ success: false, message: 'Reservation property not found in the hotel room' });
    }

    const { fullName, email, startDate, startTime, endDate, endTime } = req.body;

    if (!fullName || !email || !startDate || !startTime || !endDate || !endTime) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    if (!moment(startDate, moment.ISO_8601, true).isValid() || !moment(endDate, moment.ISO_8601, true).isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    if (!moment(startTime, 'HH:mm', true).isValid() || !moment(endTime, 'HH:mm', true).isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid time format' });
    }


    const overlap = hotelRoom.reservation.some(reservation => {
      const resStart = moment(reservation.startDate + ' ' + reservation.startTime);
      const resEnd = moment(reservation.endDate + ' ' + reservation.endTime);
      const newStart = moment(startDate + ' ' + startTime);
      const newEnd = moment(endDate + ' ' + endTime);

      return (
        (newStart.isBetween(resStart, resEnd) || newEnd.isBetween(resStart, resEnd)) ||
        (resStart.isBetween(newStart, newEnd) || resEnd.isBetween(newStart, newEnd))
      );
    });

    if (overlap) {
      return res.status(400).json({ success: false, message: 'Room already reserved for the specified time period' });
    }

    hotelRoom.reservation.push({
      fullName: fullName,
      email: email,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime
    });

    await hotelRoom.save();
    res.json({ success: true, message: 'Room Reserved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//end point to delete the reservation
router.delete('/deleteReservation/:id', async (req, res) => {
  const reservationId = req.params.id.replace(/["']/g, '');

  try {
    const room = await Room.findOne({ 'reservation._id': reservationId });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const reservationIndex = room.reservation.findIndex(r => r._id.toString() === reservationId);

    if (reservationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Reservation not found in the room' });
    }

    room.reservation.splice(reservationIndex, 1);

    await room.save();

    res.json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//end point to get all the reservation
router.get('/getAllReservations', async (req, res) => {
  try {
    const allRooms = await Room.find();
    const allReservations = allRooms.map(room => ({
      roomId: room._id,
      reservations: room.reservation || []  // If there are no reservations, default to an empty array
    }));

    res.json(allReservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;