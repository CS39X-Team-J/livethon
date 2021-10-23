import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ModulesCollection } from '/imports/api/modules';
import { SessionsCollection } from '../imports/api/modules';

// Placeholder for actual login credentials
// All passwords are "password"
export const INSTRUCTOR = "instructor";
const STUDENTS = [];

Meteor.startup(() => {

  [...STUDENTS, INSTRUCTOR].forEach((name) => {
    if (!Accounts.findUserByUsername(name)) {
      Accounts.createUser({
        username: name,
        password: "password",
      });
    }
  });

  if (SessionsCollection.find({}).fetch().length < 1) {
    SessionsCollection.insert({
      name: "lab01",
      instructions: {
        title: "Basic functions in python",
        description: "Print \"Hello World!\" using what we learned in class last Tuesday."
      },
      users: [

      ]
    });
  }

});
