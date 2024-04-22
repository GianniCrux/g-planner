import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
  return (
  <div className="flex gap-y-4">
    <div>
      Home
    </div>
    <div className="justify-content p-4 ">
      <UserButton />
    </div>
  </div>
  );
};

export default DashboardPage;