const { Schema, model } = require("mongoose");

// Schema to create a user model
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Thought",
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, {
  // Apply a getter method to format the timestamp on query
  toJSON: {
    getters: true,
  },
});

// Friend count virtual
userSchema.virtual('friendCount').get(function() {
  return this.friends.length ?? 0;
})

const User = model("user", userSchema);

module.exports = User;
