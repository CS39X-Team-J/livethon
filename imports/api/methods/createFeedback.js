import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { FeedbackCollection, ModulesCollection } from '../modules';
import { Roles } from 'meteor/alanning:roles';

export const createFeedback = {
  name: 'feedback.create',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    // TODO: fix schema to validate highlighted regions
    // new SimpleSchema({
    //   moduleID: { type: String },
    //   message: { type: String },
    //   snapshot: { type: String },
    //   createdAt: { type: Date },
    // }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ body, moduleID, snapshotID, selectedRegions, createdAt }) {

    const module = ModulesCollection.findOne({ _id: moduleID });
    
    if (!Roles.userIsInRole(this.userId, 'instructor')) {
      throw new Meteor.Error('run.create.unauthorized',
        'Cannot create feedback that is not yours');
    }

    if (!module) {
      throw new Meteor.Error('feedback.create.module_not_found',
        'Cannot give feedback to non-existent module');
    }

    const data = {
      body: body,
      module: moduleID, // TODO: is this necessary when snapshot is provided?
      snapshot: snapshotID,
      region: selectedRegions,
      createdAt,
    };

    console.log(data)

    FeedbackCollection.insert(data)

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








