import { Meteor } from 'meteor/meteor';
import React, { useState, useContext, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { SessionContext } from '../../App';
import { SessionsCollection } from '../../../api/modules';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { session, setSession } = useContext(SessionContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isStudent, setIsStudent] = useState(true);
  let navigate = useNavigate();

  const sessionExists = () => {
    return SessionsCollection.find({ name: session }).fetch().length > 0;
  }

  const navigateTo = (path) => {
    navigate(path)
  }

  const submit = e => {
    e.preventDefault();
    // students can sign in with any name
    if (isStudent) {
      console.log(`Current Session: ${session}`)
      if (!sessionExists()) {
        alert("Given session does not exist. Please try again!");
      } else {
        Meteor.loginWithPassword(username, "password", (e) => {
          Accounts.createUser({
            username,
            password: "password"
          });
          Meteor.loginWithPassword(username, "password");
          navigateTo("student")
        });
      }
      
    } else {

      if (!sessionExists()) {
        SessionsCollection.insert({
          name: session,
          instructions: {
            title: "Getting started with python's functions!",
            description: "Create a function that takes two strings and prints them on the same line."
          },
          users: []
        });
      }

      Meteor.loginWithPassword(username, password);
      navigateTo("instructor")
    }
  
  };

  return (           
    
      <form onSubmit={submit} className="login-form">
      
      <p>{isStudent ? "Student " : "Instructor"} sign in</p>

        <div>
          <label htmlFor="username">Username</label>

          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        {(!isStudent) ? (
            <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder=""
              name="password"
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          ) : ""}
        <div>
            <label htmlFor="session">Session</label>
            <input
              type="text"
              placeholder="Lab Name"
              name="session"
              required
              onChange={e => setSession(e.target.value)}
            />
          </div>

        <button type="submit">Log In</button>
        <a href="#" onClick={() => setIsStudent(!isStudent)}>Sign in as {isStudent ? "Instructor" : "Student"} instead</a>
       </form>  
  
    
  );
};
