import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { JWT_SECRET } from './env.config';
import { AppDataSource } from './db.config';
import { User } from '../entities/user.entity';
import i18next from 'i18next';

const cookieExtractor = (req: any): string | null => {
    if (req && req.cookies) {
        return req.cookies.auth_token || null;
    }
    return null;
};

export const configurePassport = (passport: PassportStatic) => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET,

    };

    passport.use(
        new JwtStrategy(opts, async (jwtPayload, done) => {
            try {
                const currentTime = Math.floor(Date.now() / 1000);

                if (jwtPayload.exp && jwtPayload.exp < currentTime) {
                    return done(null, false, {
                        message: i18next.t('auth.tokenExpired'),
                    });
                }

                const userRepository = AppDataSource.getRepository(User);

                // Check if user exists
                const user = await userRepository.findOne({
                    where: { systemId: jwtPayload.systemId },
                });

                if (!user) {
                    return done(null, false, {
                        message: i18next.t('auth.unauthorized'),
                    });
                }

                // Attach user details to req.user
                return done(null, jwtPayload);
            } catch (err) {
                return done(err, false);
            }
        })
    );
}
