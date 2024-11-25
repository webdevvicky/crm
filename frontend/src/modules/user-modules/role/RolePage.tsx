import GenericCrudPage from "../../../components/GenericCrudPage";
import RoleForm from "./RoleForm";
import RoleInfo from "./RoleInfo";

const RolesPage = () => {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Created", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <GenericCrudPage
      entity="roles"
      columns={columns}
      FormComponent={RoleForm}
      InfoComponent={RoleInfo}
    />
  );
};

export default RolesPage;
