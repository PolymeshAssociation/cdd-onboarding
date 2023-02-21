import '@fontsource/poppins';

const theme = require('../src/lib/theme');

export const parameters = {
  chakra: {
    theme,
  },
  options: {
    storySort: {
      order: [
        'theme',
        'typography',
        'atoms',
        'molecules',
        'organisms',
        'templates',
      ],
    },
  },
};
