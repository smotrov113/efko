import React from 'react';
import styles from './class.module.css';
import stylesTable from '@styles/TableGrid.module.css';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

import { types } from 'mobx-state-tree';
import { setQuery } from '@services/routing';
import { getSnapshot } from 'mobx-state-tree';

import { Clsx, MuiTextField } from '@components/core';
import { MuiLoading, MuiButton } from '@components/core';
import { MuiScrollbar, MuiPagination } from '@components/core';

import { UsersList } from '@models/users/UsersList';
import { PageDirectors } from '@app/directors/PageDirectors';

export const ListDirectors = observer((props) => {
  const router = useRouter();
  React.useEffect(() => { initialModel() }, []);
  const [ model ] = React.useState(UsersList.create());
  const [ path, setPath ] = React.useState(router['asPath']);

  React.useEffect(() => {
    path === router['asPath'] && initialModel();
   }, [router['asPath']])

  const initialModel = () => {
    const snapshot = getSnapshot(RouteModel.create({
      page: model['paginator']['page'], search: model['search']
    }));
    model.initialModelDirectors({query: setQuery(snapshot)})
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

  const onClickRow = (row = null) => {
    router.push({
      pathname: router.pathname,
      query: { id: row ? row['id'] : 'create' },
    })
  }

  return (
    <div className={styles['list-directors']}>

      <div className={styles['toolbar']}>
        <div className={styles['title']}>{'Список руководителей'}</div>

        <div className={styles['functional']}>
          <MuiTextField
            value={model['search']}
            className={styles['text-field']}
            onChange={(value)=>onChangeSearch(value)}
            placeholder={'Полнотекстовый поиск по ключевым полям...'}
          />
          
          <MuiButton
            label={'Добавить'}
             className={'ml-[15px]'}
            onClick={()=>onClickRow()}
          />
        </div>
      </div>

      <div className={Clsx(stylesTable['table-header'], 'grid-cols-[350px,auto]')}>
        <div>{'Руководитель'}</div>
        <div>{'Должность'}</div>
      </div>
      
      <MuiScrollbar>
        {model['response'].map((row, index) => (
          <div key={row['id']} className={Clsx(stylesTable['table-row'], 'grid-cols-[350px,auto]')} onClick={()=>onClickRow(row)}>
            <div>{row['label']}</div>
            <div>{row['position']}</div>
          </div>
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

      <PageDirectors/>
      <MuiLoading visible={model['isFetching']} duration={300}/>
    </div>
  )
})

const RouteModel = types.model({
  page: types.maybeNull(types.number),
  search: types.maybeNull(types.string),
}).preProcessSnapshot((snapshot) => {
  return {...snapshot};
});