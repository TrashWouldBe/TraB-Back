import { SerializedMessage } from '../types/serialized-message.type';

export const serializeMessage = ({ code, message, data }: SerializedMessage) => {
  return { code, message, data };
};
