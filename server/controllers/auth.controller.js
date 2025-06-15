const jwt = require('jsonwebtoken');
const secret = 'secretKey';

class TokenController {
    GenerateToken(user) {
        const userPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
        }
    
        const token = jwt.sign(userPayload, secret, {algorithm: 'HS256', expiresIn: '12h'});
        return token;
    }
    VerifyToken(token) {
        try {
            const payload = jwt.verify(token, secret);
            return payload;
        } catch (error) {
            throw error;
        }
    }
}


module.exports = {
    TokenController
}