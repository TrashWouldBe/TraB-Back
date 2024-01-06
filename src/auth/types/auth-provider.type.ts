import { AUTH_PROVIDER } from '../constants/auth-provider';

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
