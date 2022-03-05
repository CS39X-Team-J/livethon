import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { ModulesCollection, RunsCollection } from '../modules';

export const createRun = {
  name: 'runs.create',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      moduleID: { type: String },
      input: { type: String },
      output: { type: String },
      createdAt: { type: Date },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ moduleID, input, output, createdAt }) {

    const module = ModulesCollection.findOne({ _id: moduleID });

    if (!module) {
        throw new Meteor.Error('run.create.module_not_found',
        'Referenced module is not found')
    }

    if (module.user != this.userId) {
      throw new Meteor.Error('run.create.unauthorized',
        'Cannot reference module that is not yours');
    }

    RunsCollection.insert({
        module: moduleID,
        input,
        output,
        createdAt,
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


