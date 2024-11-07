import Joi from 'joi';
import bcrypt from 'bcrypt';
import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserById } from '../../db/user/user.db.js';
import { createResponse } from '../../utils/response/createResponse.js';

const sendErrorResponse = (socket, errorMessage) => {
  console.error(errorMessage);
  const errorResponse = createResponse(
    {
      registerResponse: {
        success: false,
        message: errorMessage,
        failCode: 3,
      },
    },
    PACKET_TYPE.REGISTER_RESPONSE,
  );
  socket.write(errorResponse);
};

const userRegisterHandler = async (socket, payload) => {
  try {
    const schema = Joi.object({
      id: Joi.string().min(4).max(20).required(),
      password: Joi.string().min(8).max(20).required(),
      email: Joi.string().email().required(),
    });

    const validation = schema.validate(payload.registerRequest);
    const validationError = validation.error;
    if (validationError) {
      sendErrorResponse(socket, `검증 실패: ${validationError}`);
      return;
    }

    const { id, password, email } = payload.registerRequest;
    const user = await findUserById(id);
    if (user) {
      sendErrorResponse(socket, '이미 존재하는 아이디입니다.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(id, hashedPassword, email);
    console.log('유저 생성 완료');

    const responsePayload = {
      registerResponse: {
        success: true,
        message: 'register success',
        failCode: 0,
      },
    };

    const response = createResponse(responsePayload, PACKET_TYPE.REGISTER_RESPONSE);
    socket.write(response);
  } catch (err) {
    throw new Error(err);
  }
};

export default userRegisterHandler;
