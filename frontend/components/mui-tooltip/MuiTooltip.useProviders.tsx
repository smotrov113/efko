import colors from '@config/colors.module.css';
import { createTheme } from '@material-ui/core/styles';

export const useProviders = {
  theme: createTheme({
    overrides: {
      MuiTooltip: {
        arrow: {
          color: colors['primary']
        },
        tooltip: {
          fontSize: '11px', fontWeight: 300,
          backgroundColor: colors['primary'],
        }
      }
    }
  })
}
