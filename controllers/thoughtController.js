const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });

      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  },

  // Get a single thought
  getSingleThought: async (req, res) => {
    try {
      const thought = await Thought.findOne({ _id: req.params.userId }).select(
        "-__v"
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json({
        thought,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a new thought
  createThought: async ({ body }, res) => {
    try {
      const thought = await Thought.create(body);

      const user = await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //update a thought
  updateThought: async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: "No thought with that ID" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //add reaction
  createReaction: async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const { reactionBody, username } = req.body;

      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: "Thought not found." });
      }

      const createdReaction = {
        reactionBody,
        username,
      };

      thought.reactions.push(createdReaction);

      const savedThought = await thought.save();

      res.json(savedThought);
    } catch (error) {
      res.status(500).json({ message: "Failed to create reaction.", error });
    }
  },

  // Delete a reaction by its reactionId from a thought
  deleteReaction: async (req, res) => {
    try {
      const { thoughtId, reactionId } = req.params;

      const removedReaction = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { _id: reactionId } } },
        { new: true }
      );

      if (!removedReaction) {
        return res.status(404).json({ message: "Thought not found." });
      }

      res.json(removedReaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete reaction.", error });
    }
  },
};
