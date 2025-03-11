import { ClientOrgSidebar } from "./_components/client-org-sidebar";
import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/org-sidebar";
import { ProjectProvider } from "./contexts/ProjectContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full bg-white dark:bg-gray-900">
      <ProjectProvider>
        <div className="h-full">
          <Navbar />
          <div className="flex gap-x-3 h-full">
            <div className="">
              <ClientOrgSidebar />
            </div>
            <div className="h-full flex-1">{children}</div>
          </div>
        </div>
      </ProjectProvider>
    </main>
  );
};

export default DashboardLayout;
