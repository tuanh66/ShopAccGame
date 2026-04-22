import mongoose from "mongoose";

const telecomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        minlength: 3,
        maxlength: 30,
    },
    amounts: [{
        type: Number,
        required: true,
    }],
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Telecom = mongoose.model("Telecom", telecomSchema);
export default Telecom;
