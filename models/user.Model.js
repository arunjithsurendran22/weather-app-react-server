import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "Delhi",
  },
  savedLocations: [
    {
      title: {
        type: String,
      },
    },
  ],
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
