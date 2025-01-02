import mongoose from 'mongoose';

const schema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String },
    type: { type: String, required: true },
    price: { type: String, required: true },
    platforms: [{ type: String }],
    version: { type: String, required: true, default: '1.0.0' },
    image: { type: String, default: 'https://placehold.co/1080x1920?text=Not_Found_404'}
}) 

export default mongoose.model('Resource', schema);