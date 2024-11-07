import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../constants/env.js';
import { CLIENT_VERSION_LENGTH, PACKET_TYPE_LENGTH, SEQUENCE_LENGTH, PAYLOAD_LENGTH } from '../constants/header.js';

export const config = {
  server: {
    host: '127.0.0.1',
    port: 5555,
  },
  database: {
    USER_DB: {
      name: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      prot: DB_PORT,
    },
  },
  header: {
    PACKET_TYPE_LENGTH,
    CLIENT_VERSION_LENGTH,
    SEQUENCE_LENGTH,
    PAYLOAD_LENGTH,
  },
};
