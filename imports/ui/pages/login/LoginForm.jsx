import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { Accounts } from 'meteor/accounts-base';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [session, setSession] = useState('');
  const [isStudent, setIsStudent] = useState(true);

  const submit = e => {
    e.preventDefault();
    // students can sign in with any name
    if (isStudent) {
      if (!Accounts.findByUsername(username)) {
        Accounts.createUser({
          username,
          password: "",
        })
      }
      Meteor.loginWithPassword(username, "");
    } else {
      Meteor.loginWithPassword(username, password);
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
