import React from 'react';
import styles from './class.module.css';
import stylesModal from '@styles/Modal.module.css';

import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

import { ModalProps } from '@components/props';
import { Clsx, MuiButton } from '@components/core';
import { CloseCircleIcon } from '@components/icons';
import { MuiModal, MuiAutocomplete } from '@components/core';

import { UsersModel } from '@models/users/UsersModel';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';

export const PageDirectors = observer((props: any) => {
  const router = useRouter();
  const id: any = router['query']['id'];
  const [ model ] = React.useState(UsersModel.create());

  React.useEffect(() => {
    const create = UsersModel.create();
    applySnapshot(model, {...getSnapshot(create)});
  }, [id]);

  React.useEffect(() => {
    if(id && id !== 'create'){
      model.changeControl('id', id);
      setTimeout(()=>model.getModel(),0);
    }
  }, [id]);

  const onChangeModel = (value) => {
    !value ? applySnapshot(model, {}) : null;
    value ? applySnapshot(model, value) : null;
  }

  const onRecordModel = async () => {
    if(!model['id']) {
      alert('Необходимо выбрать руководителя'); return;
    }
    if(model && model['id']) {
      model.changeControl('is_director', true);
      await model.createModel();
    }
    if(id && id !== model['id']) {
      const snapshot = {id: id, is_director: false};
      const user = UsersModel.create(snapshot);
      await user.createModel();
    };
    router.back();
  }

  const onDeleteModel = async () => {
    applySnapshot(model, {id: id, is_director: false});
    await model.createModel(); router.back();
  }

  return (
    <MuiModal {...ModalProps(props)} open={!!id} onClose={()=>router.back()}>
      <div className={stylesModal['header']}>
        <div className={stylesModal['label']}>{'Добавление руководителя'}</div>
        <div className={stylesModal['close']} onClick={()=>router.back()}><CloseCircleIcon/></div>
      </div>

      <div className={'flex flex-row w-[500px] h-[auto] p-4'}>

        <MuiAutocomplete
          required={true}
          optionLabel={'label'}
          value={model} label={'ФИО'}
          options={model['suggests']}
          component={model['component']}
          onChange={(value)=>onChangeModel(value)}
          onInputChange={(value)=>model.setSuggestsDirectors({value})}
        />

      </div>

      <div className={Clsx(stylesModal['footer'], 'justify-end')}>
        {id && id !== 'create' ?
          <MuiButton
            label={'Удалить'}
            onClick={()=>onDeleteModel()}
            loading={model['isFetching']}
          /> 
        : null }

        <MuiButton
          label={'Сохранить'}
          className={'ml-[15px]'}
          onClick={()=>onRecordModel()}
          loading={model['isFetching']}
        />
      </div>
    </MuiModal>
  )
});