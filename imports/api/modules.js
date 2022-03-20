import { Mongo } from 'meteor/mongo';

export const SessionsCollection = new Mongo.Collection('sessions'); // which lab or exercise students are working on
export const SnapshotsCollection = new Mongo.Collection('snapshots'); // history of student's code
export const ModulesCollection = new Mongo.Collection('modules'); // current snapshot of code, updated more frequently than snapshots collection
export const RunsCollection = new Mongo.Collection('runs');
export const FeedbackCollection = new Mongo.Collection('feedback');
export const TestsCollection = new Mongo.Collection('tests')