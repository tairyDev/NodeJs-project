import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
    insertedAt: { type: Date, default: Date.now },
    ipAddress: String,
    targetParamValue: String,
    // targetValueName: String, // Ensure this field exists
});

const targetValueSchema = new mongoose.Schema({
    name: String,
    value: String,
});

const linksSchema = new mongoose.Schema({
    originalUrl: String,
    clicks: [clickSchema],
    targetParamName: String,
    targetValues: [targetValueSchema],
});

const LinksModel = mongoose.model('Links', linksSchema);

export default LinksModel;