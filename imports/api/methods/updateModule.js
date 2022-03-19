import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { ModulesCollection } from '../modules';

// https://guide.meteor.com/methods.html#advanced-boilerplate
export const updateModule = {
  name: 'modules.update',

  // Factor out validation so that it can be run independently (1)
  validate(args) {
    new SimpleSchema({
      moduleID: { type: String },
      code: { type: String },
      createdAt: { type: Date },
    }).validate(args)
  },

  // Factor out Method body so that it can be called independently (3)
  run({ moduleID, code, createdAt }) {
    const module = ModulesCollection.findOne({ _id: moduleID });

    if (module.user != this.userId) {
      throw new Meteor.Error('modules.update.unauthorized',
        'Cannot edit module that is not yours');
    }

    ModulesCollection.update({ _id: moduleID }, {
      $set: {
        code,
        createdAt,
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


