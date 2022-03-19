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


// Placeholder for actual login credentials
// All passwords are "password"
export const INSTRUCTOR = "instructor";
const STUDENTS = [];

Meteor.startup(() => {
  // TODO: Why include empty array of students???
  [...STUDENTS, INSTRUCTOR].forEach((name) => {
    if (!Accounts.findUserByUsername(name)) {
      Accounts.createUser({
        username: name,
        password: "password",
      });
    }
  });

  // create roles
  if (!Meteor.roles.findOne({ _id: 'student' })) {
    Roles.createRole('student');
  }

  if (!Meteor.roles.findOne({ _id: 'instructor' })) {
    Roles.createRole('instructor');
  }

  // assign roles
  const instructorID = Meteor.users.findOne({ username: "instructor" })._id;
  Roles.addUsersToRoles(instructorID, 'instructor');

  // prevent direct client-side database access
  // Meteor recommends to use Methods instead for security
  ModulesCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  SessionsCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  SnapshotsCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  FeedbackCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  RunsCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  Meteor.publish('userData', function () {
    return Meteor.users.find({}, {
      fields: { username: 1, createdAt: 1, _id: 1 }
    });
  });

  Meteor.publish('sessions', function () {
    return SessionsCollection.find();
  });

  Meteor.publish('modules', function () {
    const userID = this.userId;
    // if instructor, return all modules, else only return modules owned by user making the request
    return ModulesCollection.find(Roles.userIsInRole(this.userId, 'instructor') ? {} : { user: userID });
  });

  Meteor.publish('runs', function () {
    const userID = this.userId;
    
    // if instructor, return all runs, else only return modules owned by user making the request
    const modules = ModulesCollection.find(Roles.userIsInRole(this.userId, 'instructor') ? {} : { user: userID }).fetch();
    return RunsCollection.find({ module: { $in: modules.map(module => module._id) }});
  });

  Meteor.publish('snapshots', function () {
    const userID = this.userId;
    // if instructor, return all snapshots, else only return modules owned by user making the request
    return SnapshotsCollection.find(Roles.userIsInRole(this.userId, 'instructor') ? {} : { user: userID });
  });

  Meteor.publish('feedback', function () {
    const userID = this.userId;
    const studentModules = ModulesCollection.find({ user: userID }).fetch();
    return FeedbackCollection.find(Roles.userIsInRole(this.userId, 'instructor') ? {} : { module: { $in: studentModules.map(m => m._id) } })
  });

  // Very helpful for getting started with Meteor Methods https://guide.meteor.com/methods.html#advanced-boilerplate
  const methods = [createFeedback, createModule, createRun, createSession, createSnapshot, rateFeedback, updateModule, addSessionUser];

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