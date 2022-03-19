import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { FeedbackCollection, ModulesCollection } from '../modules';

export const rateFeedback = {
  name: 'feedback.rate',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      feedbackID: { type: String },
      rating: { type: Boolean },
      createdAt: { type: Date },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ feedbackID, rating, createdAt }) {
    const feedback = FeedbackCollection.findOne({ _id: feedbackID });
    const moduleID = feedback.module;

    const module = ModulesCollection.findOne({ _id: moduleID });
    const owner = module.user;

    if (owner != this.userId) {
      throw new Meteor.Error('feedback.rate.unauthorized',
        'Cannot rate feedback intended for users other than yourself');
    }

    FeedbackCollection.update({ _id: feedbackID }, {
      $set: {
        helpful: rating,
        ratedAt: createdAt,
      }
    });
    
  },

  // Call Method by referencing the JS object (4)
  // Also, this lets us specify Meteor.apply options once in
  // the Method implementation, rather than requiring the caller
  // to specify it at the call site.
  call(args, callback) {
    const options = {
      returnStubValue: true,     // (5)
      throwStubExceptions: true  // (6)
    }

    Meteor.apply(this.name, [args], options, callback);
  }
};


