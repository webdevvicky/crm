import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersForm from "./pages/UsersForm";
import UsersPage from "./pages/UsersPage";

const App: React.FC = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/users/create" element={<UsersForm />} />
        <Route path="/users/edit/:id" element={<UsersForm />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
