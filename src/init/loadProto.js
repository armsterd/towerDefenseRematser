import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.resolve(__dirname, '../protobuf/game.proto'); // .proto 파일 경로 설정

export let GamePacket = null;

export const loadProto = () => {
  protobuf.load(PROTO_PATH, (err, root) => {
    if (err) throw err;
    GamePacket = root.lookupType('GamePacket');
    if (GamePacket) {
      console.log('GamePacket 로드 성공');
    }
  });
};
