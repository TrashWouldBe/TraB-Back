import { AUTH_PROVIDER } from './constants';

export interface UserInfo {
  uid: string;
  email: string;
}

export interface SerializedMessage {
  code: number;
  message?: string;
  data?: object | string | number | null | boolean;
}

export type ValueOf<T> = T[keyof T];

export type AuthProvider = ValueOf<typeof AUTH_PROVIDER>;
