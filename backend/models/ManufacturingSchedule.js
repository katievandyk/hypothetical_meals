const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturingScheduleSchema = new Schema({
    _id: Schema.Types.ObjectId, 
    name: {
        type: String, 
        required: true
    },
    lines_list: [{
        line: { type: Schema.Types.ObjectId, ref: 'manufacturingline' },
        activities: [{
            activity: { type: Schema.Types.ObjectId, ref: 'manufacturingactivity'}
        }]
    }],
    user_username: {
        type: String,
        required: true
    },
});

module.exports = ManufacturingSchedule = mongoose.model('manufacturingschedule', ManufacturingScheduleSchema);