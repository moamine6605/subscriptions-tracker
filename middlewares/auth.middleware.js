import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

const secret = process.env.JWT_SECRET;

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, no token provided' });
        }

        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.userId).select('-password'); 

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

export default authorize;
