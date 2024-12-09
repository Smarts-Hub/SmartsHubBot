import {Schema, model} from 'mongoose';

const ApplicationSchema = new Schema({
    channelId: String,
    ticketNumber: Number,
    creatorId: String,
    status: Number,
    claimed: Boolean,
    claimerId: String,
    closedBy: String,
    closingReason: String,
    closedAt: Date,
    createdAt: Date,
})


export default model("Tickets", ApplicationSchema);
