import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "def"
    },
    email: {
        type: String,
        required: true,
        default: "def"
    },
    password: {
        type: String,
        required: true,
        default: "def"
      },
   
    links: []
});

export default mongoose.model("user", usersSchema);
