export interface SerializedMessage {
  code: number;
  message?: string;
  data?: object | string | number | null | boolean;
}
