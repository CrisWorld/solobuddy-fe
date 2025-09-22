import { Footer } from '@/components/common/footer';
import { Header } from '@/components/common/header';
import React from 'react';

interface HomeLayoutProps {
    children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default HomeLayout;