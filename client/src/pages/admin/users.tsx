import { GetServerSideProps } from "next";

const UsersAdminPage = () => {
  return <div>Hello from the users page.</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default UsersAdminPage;
