import jwt from 'jsonwebtoken';

function generateJWT(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
  return token;
}

function verifyJWT(token: string) {
  const verifiedData =  jwt.verify(token, process.env.JWT_SECRET!);
  return verifiedData;
}

function decodeRefreshToken(refreshToken: string) {
  const decodedToken = jwt.decode(refreshToken);
  return decodedToken;
}

export { generateJWT, verifyJWT, decodeRefreshToken };
