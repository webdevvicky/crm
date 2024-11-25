import GenericCrudPage from "../../../components/GenericCrudPage";
import TeamForm from "./TeamForm";
import TeamInfo from "./TeamInfo";

const TeamPage = () => {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
  ];

  return (
    <GenericCrudPage
      entity="teams"
      columns={columns}
      FormComponent={TeamForm}
      InfoComponent={TeamInfo}
    />
  );
};

export default TeamPage;
