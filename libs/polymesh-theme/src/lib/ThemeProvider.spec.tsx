import { render } from '@testing-library/react';

import PolymeshTheme from './ThemeProvider';

describe('PolymeshTheme', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PolymeshTheme />);
    expect(baseElement).toBeTruthy();
  });
});
