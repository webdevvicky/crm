import GenericCrudPage from "../../../components/GenericCrudPage";
import UserForm from "./UserForm";

import UserInfo from "./UserInfo";

const UsersPage = () => {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  return (
    <GenericCrudPage
      entity="users"
      columns={columns}
      FormComponent={UserForm}
      InfoComponent={UserInfo}
    />
  );
};

export default UsersPage;
