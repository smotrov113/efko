import React from 'react';
import styles from './class.module.css';
import stylesTable from '@styles/TableGrid.module.css';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { RootStore } from '@store/RootStore';

import { types } from 'mobx-state-tree';
import { setQuery } from '@services/routing';
import { getSnapshot } from 'mobx-state-tree';

import moment from 'moment';
import { Button } from '@material-ui/core';
import { PrevIcon, Nextcon } from 'components/icons';

import { Clsx } from '@components/core';
import { MuiTextField } from '@components/core';
import { MuiButton, MuiCheckbox } from '@components/core';
import { MuiScrollbar, MuiPagination } from '@components/core';
import { MuiDatePickerInline, MuiLoading } from '@components/core';

import { VacationsList } from '@models/vacations/VacationsList';

export const ListVacations = React.memo<any>(observer((props) => {
  const router = useRouter();
  React.useEffect(() => { initialModel() }, []);
  const [ model ] = React.useState(VacationsList.create());

  const initialModel = () => {
    const snapshot = getSnapshot(RouteModel.create({
      page: model['paginator']['page'], 
      search: model['search'], year: model['year']
    }));
    model.initialModel({query: setQuery(snapshot)})
  }

  const onChangeYear = (value) => {
    model.changeControl('year', value);
    setTimeout(() => initialModel(), 0);
  }

  const onChangePage = (value) => {
    model['paginator'].changeControl('page', value);
    setTimeout(() => initialModel(), 0);
  }

  const onChangeSearch = (value) => {
    model['paginator'].changeControl('page', 1);
    model.changeControl('search', value);
    setTimeout(() => initialModel(), 0);
  }

  return (
    <div className={styles['list-vacations']}>

      <div className={styles['toolbar']}>
        <div className={styles['title']}>{'Календарь отпусков'}</div>

        <YearPagination
          year={model['year']}
          className={'ml-[15px]'}
          onChange={(value)=>onChangeYear(value)}
        />

        <div className={styles['functional']}>
          <MuiTextField
            value={model['search']}
            className={styles['text-field']}
            onChange={(value)=>onChangeSearch(value)}
            placeholder={'Полнотекстовый поиск по ключевым полям...'}
          />
        </div>
      </div>

      <div className={Clsx(stylesTable['table-header'], 'grid-cols-[200px,150px,150px,auto,100px,100px,150px]')}>
        <div>{'Фамилия'}</div>
        <div>{'Имя'}</div>
        <div>{'Отчество'}</div>
        <div>{'Должность'}</div>

        <div className={'text-center'}>{'Начало'}</div>
        <div className={'text-center'}>{'Окончание'}</div>
        <div className={'text-center'}>{'Согласовано'}</div>
      </div>
      
      <MuiScrollbar>
        {model['response'].map((row, index) => (
          <RowListVacations key={row['user']['id']} row={row}/>
        ))}
      </MuiScrollbar>

      <div className={styles['toolbar-bottom']}>       
        <div className={'ml-auto'}>
          <MuiPagination
            page={model['paginator']['page']}
            onChange={(value)=>onChangePage(value)}
            pageTotal={model['paginator']['page_total']}
          />
        </div>
      </div>

      {React.useMemo(() => (
        <MuiLoading visible={model['isFetching']} duration={300}/>    
      ), [model['isFetching']])}
    </div>
  )
}));


export const RowListVacations: any = React.memo<any>(observer(({row}) => (
  <div className={Clsx(stylesTable['table-row'], styles['row'], 'grid-cols-[200px,150px,150px,auto,100px,100px,150px]')}>
    <div>{row['user']['last_name']}</div>
    <div>{row['user']['first_name']}</div>
    <div>{row['user']['middle_name']}</div>
    <div><span>{row['user']['position']}</span></div>

    <div className={'px-[5px]'}>
      <MuiDatePickerInline
        value={row['date_start']}
        clearToolbar={true} readOnly={row.getOnlyView(RootStore)}
        onChange={(value)=>row.changeControl('date_start', value)}
        minDate={row.getMinDate()} maxDate={row['date_end'] || row.getMaxDate()}
        className={Clsx(styles['date-picker'], row.getOnlyView(RootStore) ? styles['date-picker-read'] : null)}
      />
    </div>
    
    <div className={'px-[5px]'}>
      <MuiDatePickerInline
        value={row['date_end']}
        onChange={(value)=>row.changeControl('date_end', value)}
        clearToolbar={true} readOnly={row.getOnlyView(RootStore)}
        maxDate={row.getMaxDate()} minDate={row['date_start'] || row.getMinDate()}
        className={Clsx(styles['date-picker'], row.getOnlyView(RootStore) ? styles['date-picker-read'] : null)}
      />
    </div>

    <div>
      {RootStore['session']['user']['is_director'] || row['is_agreed'] ?
      <MuiCheckbox
        checked={row['is_agreed']} className={'mx-[auto]'}
        onChange={(value)=>row.changeControl('is_agreed', value)}
      />
      : null}
    </div>
  </div>
)));


interface IProps { year?: number; className?: string; onChange?: any; }
export const YearPagination = React.memo<IProps>((props) => {
  const date = new Date();
  props['year'] && date.setFullYear(props['year']);
  const momentDate = moment(date ? date : date).locale('ru');
  const propsButton = {disableFocusRipple: true, disableRipple: true, tabIndex: -1};
  
  const changeMonth = (param) => {
    if(props['onChange']){
      if(param === 'prev'){
        const date = moment(momentDate);
        const year = date.add(-1, 'years');
        props.onChange(year['_d'].getFullYear());
      } else if(param === 'next'){
        const date = moment(momentDate);
        const year = date.add(1, 'years');
        props.onChange(year['_d'].getFullYear());
      }
    }
  }

  return (
    <div className={Clsx(styles['year-pagination'], props['className'])}>
      <Button {...propsButton} className={styles['button-ctrl']} onClick={()=>changeMonth('prev')}>
        <PrevIcon/>
      </Button>

      <div className={styles['year']}>
        {momentDate.format('YYYY')}
      </div>

      <Button {...propsButton} className={styles['button-ctrl']} onClick={()=>changeMonth('next')}>
        <Nextcon/>
      </Button>
    </div>
  )
})

export const RouteModel = types.model({
  year: types.maybeNull(types.number),
  page: types.maybeNull(types.number),
  search: types.maybeNull(types.string),
}).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});