import { Clsx } from '@components/core';
import stylesModal from '@styles/Modal.module.css';

export const ModalProps: any = (props) => {
  return {
    closeEsc: true,
    direction: 'up',
    closeBackdrop: true,
    className: Clsx(stylesModal['modal'], props['className'])
  }
}

export const PopoverProps: any = (props) => {
  return {
    elevation: 0,
    marginThreshold: 0,
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
    className: Clsx(stylesModal['menu-popover'], props['className']),
  }
}