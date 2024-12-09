import mongoose from 'mongoose';

const schema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number },
    winners: { type: Number, required: true },
    prize: { type: String, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    winnerIds: [{ type: String }],
}) 

export default mongoose.model('Giveaway', schema);