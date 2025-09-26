import {createAction} from '@reduxjs/toolkit';

interface Props {
  url?: string;
  data?: object | string | boolean;
  method?: string;
  onStart?: string;
  onSuccess?: string;
  onFailed?: string;
  onReset?: string;
  onChange?: string;
  formData?: boolean;
  isLogin?: boolean;
}

// root action creators
export const apiCallBegan = createAction<Props>('api/callBegan');
export const apiCallSuccess = createAction<Props>('api/callSuccess');
export const apiCallFailed = createAction<Props>('api/callFailed');
