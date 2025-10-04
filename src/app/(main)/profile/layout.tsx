import ProtectedRoute from "@/components/layout/ProtectedLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ProtectedRoute children={children} roles={["user","guide"]} />;
}