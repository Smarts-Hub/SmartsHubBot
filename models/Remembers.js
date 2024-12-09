import mongoose from 'mongoose';

const schema = mongoose.Schema({
    name: { type: String, required: true },
    creatorId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    remember: { type: Number, default: 1 }
}) 

export default mongoose.model('Remembers', schema);