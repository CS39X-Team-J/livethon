import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { SessionsCollection } from '../../../api/modules';
import { useNavigate, useParams } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

export const LoginForm = () => {
  const [session, setSession] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isStudent, setIsStudent] = useState(true);
  let navigate = useNavigate();

  const sessionExists = useTracker(() => {
    const subscription = Meteor.subscribe('sessions');
    const doesExist = SessionsCollection.find({ name: session }).fetch().length > 0;
    return subscription.ready() ? doesExist : undefined;
  });

  const navigateTo = (path) => {
    navigate(path)
  }

  const studentLogin = () => {
    Meteor.loginWithPassword(username, "password", () => {
      navigateTo(`student/session/${session}`);
    });
  }

  const submit = e => {
    e.preventDefault();
    // students can sign in with any name

    console.log(sessionExists)

    if (username == '') {
      alert("Username field cannot be empty.")
      return;
    }

    if (isStudent) {

      if (!sessionExists) {
        alert("Given session does not exist. Please try again!");
      } else {

        Meteor.loginWithPassword(username, "password", (e) => {

          if (e && e.reason == "User not found") {

            // turn into meteor method to get cal
            Accounts.createUser({
              username,
              password: "password"
            }, () => {
              studentLogin();
            });

          } else {
            studentLogin();
          }        

        });

      }

    } else {

      Meteor.loginWithPassword(username, password, (e) => {

        // This doesn't prevent people from just navigating to these
        // pages manually.
        if (!e) {
          if (!sessionExists) {
            navigateTo("instructor/session/create");
          } else {
            navigateTo(`instructor/session/view/${session}`);
          }
        } else {
          alert("Username or password is incorrect");
        }

      });
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
