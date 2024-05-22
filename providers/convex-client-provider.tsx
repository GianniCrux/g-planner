"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
    AuthLoading,
    Authenticated,
    ConvexReactClient,
} from "convex/react";
import { Loading } from "@/components/auth/loading";
import {shadesOfPurple} from "@clerk/themes";

interface ConvexClientProviderProps {
    children: React.ReactNode; //this provider will protect all of our children (so our app) with authentication  
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
    children,
}: ConvexClientProviderProps) => {
    return (
    <ClerkProvider
        appearance={{
            baseTheme: shadesOfPurple
        }}
    >
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
            <Authenticated>
            {children}
            </Authenticated>
            <AuthLoading>
                <Loading />
            </AuthLoading>
        </ConvexProviderWithClerk>
    </ClerkProvider>
    );
};
