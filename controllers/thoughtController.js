const { Thought, Reaction } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thought = await Thought.find();
            res.json(thought);
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
          const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v');
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' })
          }
    
          res.json(thought);
        } catch (err) {
          return res.status(500).json(err);
        }
      },
     
      async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            });
            res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
      },

      async updateThought(req, res) {
        try {
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
          }
    
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
      },
     
      async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
    
          if (!thought) {
            return res.status(404).json({ message: 'No such thought exists' });
          }
    
          res.json({ message: 'Thought successfully deleted' });
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
    
      async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$addToSet: {reactions: req.body}},
                {runValidators: true, new: true},
            )
            
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
        
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
      },

      async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reactions: {reactionId: req.params.reactionId}}},
                {runValidators: true, new: true},
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
    
            res.json(thought);
            } catch (err) {
            res.status(500).json(err);
            }
      },
}