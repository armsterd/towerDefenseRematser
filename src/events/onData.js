import { CLIENT_VERSION_LENGTH, PACKET_TYPE_LENGTH, PAYLOAD_LENGTH, SEQUENCE_LENGTH } from '../constants/header.js';
import { GamePacket } from '../init/loadProto.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const headerLength = CLIENT_VERSION_LENGTH + PACKET_TYPE_LENGTH + SEQUENCE_LENGTH + PAYLOAD_LENGTH;

  while (socket.buffer.length >= headerSize) {
    const PacketType = socket.buffer.readUInt16BE(0);
    const versionLength = socket.buffer.readUInt8(PACKET_TYPE_LENGTH);

    const totalHeaderLength = headerLength + versionLength;

    if (socket.buffer.length < totalHeaderLength) {
      break;
    }

    const versionOffset = PACKET_TYPE_LENGTH + CLIENT_VERSION_LENGTH;

    const version = socket.buffer.toString('utf-8', versionOffset, versionOffset + versionLength);

    const sequenceOffset = versionOffset + versionLength;
    const sequence = socket.buffer.readUInt32BE(sequenceOffset);

    const payloadLengthOffset = sequenceOffset + SEQUENCE_LENGTH;
    const payloadLength = socket.buffer.readUInt32BE(payloadLengthOffset);

    const packetLength = totalHeaderLength + payloadLength;

    if (socket.buffer.length < packetLength) {
      break;
    }

    const payload = socket.buffer.slice(totalHeaderLength, packetLength);

    socket.buffer = socket.buffer.slice(packetLength);

    try {
      const decodedPacket = GamePacket.decoded(payload);
      switch (PacketType) {
        case PACKET_TYPE.REGISTER.REQUEST:
          await userRegisterHandler(socket, decodedPacket.registerRequest);
          break;
        case PACKET_TYPE_LOGIN_REQUEST:
          await userLoginHandler(socket, decodedPacket.loginRequest);
          break;
      }
    } catch (err) {
      console.error('패킷 처리 에러', err);
    }
  }
};
