import { createTheme } from '@mui/system';

const theme = createTheme({
  palette: {
      background: {
          back: '#4F2583',
          container: '#552496', 
          post: '#B5AAB5',
      },
      text: {
          primary: '#161616',
          secondary: '#353535',
          contrast: '#FFFFFF',
      },
  },
});

export default theme;