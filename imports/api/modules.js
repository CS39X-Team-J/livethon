import { Mongo } from 'meteor/mongo';

export const SessionsCollection = new Mongo.Collection('sessions');
export const ModulesCollection = new Mongo.Collection('modules');
export const RunsCollection = new Mongo.Collection('runs');
export const FeedbackCollection = new Mongo.Collection('feedback');
