import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { PolymeshTheme } from '@polymeshassociation/polymesh-theme';

import { router } from './pages';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <PolymeshTheme>
      <RouterProvider router={router} />
    </PolymeshTheme>
  </StrictMode>
);
