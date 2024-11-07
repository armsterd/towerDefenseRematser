import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createResponse from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';
import { findUserById } from '../../db/user/user.db.js';

const sendErrorResponse = (socket, errorMessage) => {
  console.error(errorMessage);
  const errorResponse = createResponse(
    {
      loginResponse: {
        success: false,
        message: errorMessage,
        token: '',
        failCode: 3,
      },
    },
    PACKET_TYPE.LOGIN_RESPONSE,
  );
  socket.write(errorResponse);
};

const userLoginHandler = async (socket, payload) => {
  try {
    const { id, password } = payload.loginRequest;
    const user = await findUserById(id);

    if (!user) {
      const errorMessage = `${id} 유저가 존재하지 않습니다.`;
      sendErrorResponse(socket, errorMessage);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const errorMessage = `${id}: 비밀번호가 틀렸습니다.`;
      sendErrorResponse(socket, errorMessage);
      return;
    }

    const TEMP_SECRET_KEY = 'temporary_secret_key';

    const token = jwt.sign(user, TEMP_SECRET_KEY, { expiresIn: '1h' });
    const bearerToken = `Bearer ${token}`;

    const responsePayload = {
      loginResponse: {
        success: true,
        message: '로그인 성공',
        token: bearerToken,
        failCode: 0,
      },
    };

    const response = createResponse(responsePayload, PACKET_TYPE.LOGIN_RESPONSE);
    socket.write(response);
  } catch (err) {
    throw new Error(err);
  }
};

export default userLoginHandler;
