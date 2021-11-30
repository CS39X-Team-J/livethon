import React, { createContext, useState } from "react";
import { SessionCreationForm } from "./SessionCreateForm.jsx";
import { SubmissionsView } from "./SubmissionsView.jsx";

export const InstructorViewContext = createContext("create session");

export const InstructorView = () => {
  const [selectedView, selectView] = useState('create session')
  const selection = {
    'submissions': <SubmissionsView></SubmissionsView>,
    'create session': <SessionCreationForm></SessionCreationForm>
  }

  return (
    <InstructorViewContext.Provider value={{selectedView, selectView}}>
      {selection[selectedView]}
    </InstructorViewContext.Provider>
  );
};
