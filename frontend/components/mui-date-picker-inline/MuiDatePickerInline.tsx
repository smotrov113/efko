import React from 'react';
import { Clsx } from '@components/core';
import { useStyles } from './MuiDatePickerInline.useStyles';
import { useProviders } from './MuiDatePickerInline.useProviders';

import 'moment/locale/ru';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { getRandonString } from '@services/general';
import { MuiThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';

import { MuiTextField } from '@components/core';

interface IProps {
  onChange?: any;
  clearToolbar?: boolean;
  views?: DatePickerProps['views'];
  value?: DatePickerProps['value'];
  label?: DatePickerProps['label'];
  format?: DatePickerProps['format'];
  maxDate?: DatePickerProps['maxDate'];
  minDate?: DatePickerProps['minDate'];
  readOnly?: DatePickerProps['readOnly'];
  required?: DatePickerProps['required'];
  className?: DatePickerProps['className'];
}

export const MuiDatePickerInline = React.memo<IProps>((props) => {
  const styles = useStyles(props);
  const componentRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [ clearToolbarID ] = React.useState(getRandonString(10));

  const renderInput = (param) => {
    return (
      <MuiTextField
        {...param}
        readOnly={true}
        margin={'dense'}
        label={props['label']}
        required={props['required']}
        InputProps={{...param.InputProps}}
      />
    )
  }

  const renderToolbar = (param) => {
    return (
      <div id={clearToolbarID} className={styles.clearToolbar}>
        <div data-role={'label'} onClick={()=>resetSelectValue()}>{'СБРОСИТЬ'}</div>
      </div>
    )
  }

  const resetSelectValue = () => {
    if(props['onChange']){
      setOpen(false); props.onChange(null);
    }
  }

  return (
    <div ref={componentRef} className={styles.muiDatePickerInlineContainer}>
      <MuiThemeProvider theme={useProviders.theme}>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={'ru'} libInstance={moment}>
          <DatePicker
            open={open}
            autoOk={true}
            fullWidth={true}
            margin={'dense'}
            variant={'inline'}
            views={props['views']}
            label={props['label']}
            value={props['value']}
            InputLabelProps={{shrink: true}}
            TextFieldComponent={renderInput}
            minDateMessage={null} maxDateMessage={null}
            PopoverProps={{anchorEl: componentRef.current}}
            format={props['format'] ? props['format'] : 'DD.MM.YYYY'}
            InputProps={{spellCheck: false, readOnly: props['readOnly']}}
            onOpen={()=>props['readOnly'] ? setOpen(false) : setOpen(true)}
            className={Clsx(styles.muiDatePickerInline, props['className'])}
            onClose={()=>props['readOnly'] ? setOpen(false) : setOpen(false)}
            ToolbarComponent={props['clearToolbar'] ? renderToolbar : ()=>null}
            minDate={props['minDate'] ? props['minDate'] : new Date('1900-01-01')}
            maxDate={props['maxDate'] ? props['maxDate'] : new Date('2100-01-01')}
            onChange={(value)=>props.onChange ? props.onChange(value.toDate()) : null}
          />
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </div>
  )
})