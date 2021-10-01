import React from 'react';
import { useClasses } from './MuiCheckbox.useClasses';
import styles from './MuiCheckbox.useStyles.module.css';

import { Clsx } from '@components/core';
import { Checkbox, CheckboxProps } from '@material-ui/core';
import { CircleIcon, CheckCircleIcon } from '@components/icons';

interface MuiCheckboxProps extends CheckboxProps{onChange?: any};
export const MuiCheckbox = React.memo<MuiCheckboxProps>((props) => {
  const classes = useClasses(props);

  const onChange = (value) => {
    if(props['onChange']){
      props.onChange(value);
    }
  }

  return (
    <Checkbox {...props}
      color={'primary'} classes={classes}
      icon={<CircleIcon/>} checkedIcon={<CheckCircleIcon/>}
      onChange={(event)=>onChange(event['target']['checked'])}
      className={Clsx(styles['mui-checkbox'], props['className'])}
    />
  )
})