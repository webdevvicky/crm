import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./modules/user-modules/user/UserPage";
import RolesPage from "./modules/user-modules/role/RolePage";
import TeamPage from "./modules/user-modules/team/TeamPage";
import MainLayout from "./layout/MainLayout";
import LeadForm from "./modules/crm-modules/lead/LeadForm";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="teams" element={<TeamPage />} />
          <Route
            path="leads"
            element={<LeadForm onSuccess={() => console.log("first")} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
