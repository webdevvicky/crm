import { Spin } from "antd";
import { useFetch } from "../../../hooks/useFetch";

interface UserInfoProps {
  id: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ id }) => {
  // Fetch user details based on userId
  const {
    data: userInfo,
    isLoading,
    error,
  } = useFetch<User>([id], `users/${id}`);

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (error || !userInfo) {
    return <p style={{ textAlign: "center" }}>Unable to fetch user details.</p>;
  }

  return (
    <div>
      <p>
        <strong>Name:</strong> {userInfo.name}
      </p>
      <p>
        <strong>Email:</strong> {userInfo.email}
      </p>
    </div>
  );
};

export default UserInfo;
