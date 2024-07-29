const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
    },
    status: {
        type: Boolean,
        default: true,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

userSchema.set("toObject", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
