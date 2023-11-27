const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const hotelRoomsSchema = new Schema({


    picture: {
        type: String, required: true
    },
    name: {
        type: String, required: true
    },
    description: {
        type: String, required: true
    },
    Rtype: {
        type: String, required: true
    },
    comments:
    {
        type: [String], Default: ['This room was osm']
    },
    likes: {
        type: Number, Default: 20
    },

    reservation: [
        {
            fullName: { type: String, required: false },
            email: { type: String, required: false },
            startDate: { type: Date, required: true, default: Date.now },
            startTime: { type: String, required: true, default: '00:00' },
            endDate: { type: Date, required: false, default: Date.now },
            endTime: { type: String, required: true, default: '00:00' },

        }],
    price:
    {
        type: Number, required: true
    },
    date:
    {
        type: Date, default: Date.now
    },

});

const hotelRoomsModel = mongoose.model('hotelRooms', hotelRoomsSchema);

module.exports = hotelRoomsModel