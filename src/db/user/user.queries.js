export const SQL_QUERIES = {
  CREATE_USER: 'INSERT INTO user (userId , password , email) VALUES (?, ? ,?)',

  FIND_USER_BY_ID: 'SELECT * FROM user WHERE userId = ?',
};
