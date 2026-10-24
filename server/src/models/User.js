
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      select: false,
      default: null,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    favoriteCities: {
      type: [
        {
          name: String,
          country: String,
          latitude: Number,
          longitude: Number,
        },
      ],
      default: [],
    },

    preferredUnit: {
      type: String,
      enum: ["celsius", "fahrenheit"],
      default: "celsius",
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ lastLoginAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
