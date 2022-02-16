import React from 'react';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';

Meteor.startup(() => {
  render(<BrowserRouter><App/></BrowserRouter>, document.getElementById('react-target'));
});
