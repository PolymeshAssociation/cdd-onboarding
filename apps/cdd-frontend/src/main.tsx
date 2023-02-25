import { PolymeshTheme } from '@polymeshassociation/polymesh-theme';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <PolymeshTheme>
      <App />
    </PolymeshTheme>
  </StrictMode>
);
