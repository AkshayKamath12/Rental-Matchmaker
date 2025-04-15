'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../lib/queryClient';

function Providers({ children }: { children: React.ReactNode }) {
    return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
    );
}

export default Providers;