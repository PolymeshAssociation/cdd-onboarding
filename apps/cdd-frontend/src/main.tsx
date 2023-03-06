import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { PolymeshTheme } from '@polymeshassociation/polymesh-theme';

import { router } from './pages';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PolymeshTheme>
        <RouterProvider router={router} />
      </PolymeshTheme>
    </QueryClientProvider>
  </StrictMode>
);
