import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { RunsCollection, ModulesCollection, SnapshotsCollection, FeedbackCollection, SessionsCollection } from '../imports/api/modules';
import { Roles } from 'meteor/alanning:roles';
import { createFeedback } from '../imports/api/methods/createFeedback';
import { createModule } from '../imports/api/methods/createModule';
import { createRun } from '../imports/api/methods/createRun';
import { createSession } from '../imports/api/methods/createSession';
import { createSnapshot } from '../imports/api/methods/createSnapshot';
import { rateFeedback } from '../imports/api/methods/rateFeedback';
import { updateModule } from '../imports/api/methods/updateModule';
import { addSessionUser } from '../imports/api/methods/addSessionUser';
import { updateSession } from '../imports/api/methods/updateSession';
import { initializePublications } from './publications';
import { initializeRules } from './rules';


// Placeholder for actual login credentials
// All passwords are "password"
export const INSTRUCTOR = "instructor";

Meteor.startup(() => {

  if (!Accounts.findUserByUsername(INSTRUCTOR)) {
    Accounts.createUser({
      username: INSTRUCTOR,
      password: "password",
    })
  }

  // create roles
  if (!Meteor.roles.findOne({ _id: 'student' })) {
    Roles.createRole('student');
  }

  if (!Meteor.roles.findOne({ _id: INSTRUCTOR })) {
    Roles.createRole(INSTRUCTOR);
  }

  // assign roles
  const instructorID = Meteor.users.findOne({ username: INSTRUCTOR })._id;
  Roles.addUsersToRoles(instructorID, INSTRUCTOR);

  // setup rules so meteor methods must be used
  initializeRules();

  // setup publications for limited and secure access
  initializePublications();

  // Very helpful for getting started with Meteor Methods https://guide.meteor.com/methods.html#advanced-boilerplate
  const methods = [createFeedback, createModule, createRun, createSession, updateSession, createSnapshot, rateFeedback, updateModule, addSessionUser];

  methods.forEach(method => {
    // register each method with Meteor's DDP system
    Meteor.methods({
      [method.name]: function (args) {
        method.validate.call(this, args);
        method.run.call(this, args);
      }
    })
  });

});