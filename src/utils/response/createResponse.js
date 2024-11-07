import { GamePacket } from '../../init/loadProto.js';
import createHeader from '../createHeader.js';

const createResponse = (ResponsePayload, packetType) => {
  const payloadBuffer = GamePacket.encode(GamePacket.create(ResponsePayload)).finish();
  const header = createHeader(payloadBuffer.length, packetType, 0);

  return Buffer.concat([header, payloadBuffer]);
};

export default createResponse;
