// import { MuiColors } from '@config/colors';
import { makeStyles } from '@material-ui/styles';

// const colorsInputField = MuiColors['inputField'];
///////////////////////////////////////////
export const useStyles = makeStyles((theme) => ({
  muiDatePickerInline: {
    '& *': { cursor: 'pointer' },
    '& input': { textTransform: 'capitalize' }
  },
  muiDatePickerInlineContainer: {
    
  },
  inputButton: {
    padding: '0px',
    minWidth: 'auto',
    borderRadius: '50%',
    marginRight: '6px', marginTop: '-2px',
    '& > span > svg': { color: '#1E1E1E' },
    '&:hover': { backgroundColor: 'transparent' }
  },
  clearToolbar: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%', height: 'auto',
    marginTop: '0px', marginBottom: '10px',
    '& > div[data-role="label"]': {
      cursor: 'pointer',
      padding: '5px 5px',
      letterSpacing: '2px',
      // color: colorsInputField['label'],
      fontSize: '12px', fontWeight: 500,
      marginLeft: 'auto', marginRight: '10px',
    }
  }
}));