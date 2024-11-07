import { config } from '../config/config.js';
import { CLIENT_VERSION } from '../constants/constants.js';

const createHeader = (payloadLength, packetType, sequence) => {
  const { PACKET_TYPE_LENGTH, CLIENT_VERSION_LENGTH, SEQUENCE_LENGTH, PAYLOAD_LENGTH } = config.header;

  const packetTypeBuffer = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetTypeBuffer.writeUInt16BE(packetType, 0);

  const versionBuffer = Buffer.alloc(CLIENT_VERSION);

  const versionLengthBuffer = Buffer.alloc(CLIENT_VERSION_LENGTH);
  versionBuffer.writeUInt8(versionBuffer.length, 0);

  const sequenceBuffer = Buffer.alloc(SEQUENCE_LENGTH);
  sequenceBuffer.writeUInt32BE(sequence, 0);

  const payloadLengthBuffer = Buffer.alloc(PAYLOAD_LENGTH);
  payloadLengthBuffer.writeUInt32BE(payloadLength, 0);

  return Buffer.concat([packetTypeBuffer, versionLengthBuffer, versionBuffer, sequenceBuffer, payloadLengthBuffer]);
};

export default createHeader;
