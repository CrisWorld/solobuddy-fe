import HomeLayout from '@/components/layout/HomeLayout';

export default function LayoutHome({ children }: { children: React.ReactNode }) {
    return <HomeLayout>{children}</HomeLayout>;
}