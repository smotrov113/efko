import colors from '@config/colors.module.css';
import { makeStyles } from '@material-ui/styles';

export const useClasses = makeStyles((theme) => ({
  root: {
    '& svg': {
      stroke: colors['checkbox-border'],
      fill: colors['checkbox-background'],
    }
  },
  checked: {
    color: 'transparent !important', 
    '& svg': { stroke: colors['accent'] }
  }
}), {index: 1})
