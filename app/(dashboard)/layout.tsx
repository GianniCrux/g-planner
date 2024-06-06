import { ClientOrgSidebar } from "./_components/client-org-sidebar";
import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/org-sidebar";



interface DashboardLayoutProps {
    children: React.ReactNode;
};

const DashboardLayout = ({
    children,
}: DashboardLayoutProps) => {
    return (
        <main className="h-full">
            <div className="pl-[10px] h-full">
                <Navbar />
                <div className="flex gap-x-3 h-full">
                <div className="pl-7">
                    <ClientOrgSidebar />
                </div>
                <div className="h-full flex-1"> 
                    {children}
                </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardLayout;