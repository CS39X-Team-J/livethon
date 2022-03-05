import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { FeedbackCollection } from '../modules';
import { Roles } from 'meteor/alanning:roles';

export const createFeedback = {
  name: 'feedback.create',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      moduleID: { type: String },
      message: { type: String },
      snapshot: { type: String },
      selectedRegions: { type: Array },
      createdAt: { type: Date },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ moduleID, message, snapshot, selectedRegions, createdAt }) {
    const module = ModulesCollection.findOne({ _id: moduleID });

    if (!Roles.userIsInRole(this.userID, 'instructor')) {
        throw new Meteor.Error('feedback.create.unauthorized',
        'Cannot create feedback without role instructor');
    }

    if (!module) {
        throw new Meteor.Error('feedback.create.module_not_found',
        'Cannot give feedback to non-existent module');
    }

    FeedbackCollection.insert({
        body: message,
        module: moduleID, // TODO: is this necessary when snapshot is provided?
        snapshot,
        region: selectedRegions ? selectedRegions : [],
        createdAt,
    })
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


