import colors from '@config/colors.module.css';
import { createTheme } from '@material-ui/core/styles';

export const useProviders = {
  theme: createTheme({
    palette: {
      primary: {
        main: colors['primary']
      }
    },
    overrides: {
      MuiPaper:{
        root: {
          marginTop: '10px',
          borderRadius: '15px',
        },
        elevation8:{
          paddingBottom: '0px',
          boxShadow: '2px 2px 30px 0px rgba(0, 0, 0, 0.1)',
        } 
      },
      MuiTypography:{
        alignCenter:{
          fontSize: '14px'
        },
        colorInherit:{
          fontSize: '12px',
        }
      },
      // @ts-ignore-start
      MuiPickersBasePicker: {
        container: {
          flexDirection: 'column-reverse'
        },
        pickerView: {
          overflow: 'hidden',
          minHeight: '290px', maxHeight: '290px',
        },
      },
      // @ts-ignore-end
      MuiPickersMonth: {
        root: {
          height: '60px',
          fontSize: '14px',
          textTransform: 'uppercase'
        },
        monthSelected: {
          fontWeight: 600
        },
      },
      MuiPickersDay: {
        day: {
          width: '33px', 
          height: '33px',
          margin: '3px 5px'
        }
      },
      MuiPickersMonthSelection: {
        container: {
          padding: '0px 25px',
          '& > div': {
            height: '55px',
            fontSize: '13px',
          },
        },
      },
      MuiPickersCalendar:{
        transitionContainer: {
          //marginBottom: '12px',
        }
      },
      MuiPickersCalendarHeader: {
        switchHeader: {
          marginTop: '8px'
        },
        transitionContainer: {
          fontSize: '14px',
          textTransform: 'capitalize'
        },
        iconButton: {
          padding: '4px',
          margin: '0 6px'
        }
      }
    }
  })
}
