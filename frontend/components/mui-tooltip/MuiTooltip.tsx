import React from 'react';
import styles from './MuiTooltip.useStyles.module.css';
import { useProviders } from './MuiTooltip.useProviders';

import { Clsx } from '@components/core';
import { MuiThemeProvider } from '@material-ui/core';
import { Tooltip, TooltipProps } from '@material-ui/core';

export const MuiTooltip = React.memo<TooltipProps>(React.forwardRef((props, refForward) => {
  const ref: any = refForward;

  return (
    <MuiThemeProvider theme={useProviders['theme']}>
      <Tooltip {...props} ref={ref}
        title={props['title'] ? props['title'] : ''}
        arrow={props['arrow'] ? props['arrow'] : true}
        className={Clsx(styles['mui-tooltip'], props['className'])}
        placement={props['placement'] ? props['placement'] : 'top'}
      />
    </MuiThemeProvider>
  )
}))