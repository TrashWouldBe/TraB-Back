import { SerializedMessage } from './types';

export const serializeMessage = ({
  code,
  message,
  data,
}: SerializedMessage) => {
  return { code, message, data };
};
