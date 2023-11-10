import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "eu-north-1_bCStU3PvI",
  tokenUse: "access",
  clientId: "70mcdsr4svtmll851ehcccv7lj",
});

@Injectable()
export class HttpBearerStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super(async (token, done) => { 
                const modToken = token.substring(1, token.length - 1) // Frontend adds enclosing quotes for whatever reason
                try {
                    const payload = await verifier.verify(modToken)
                    return done(null, payload)
                } catch (err) {
                    return done(null, false)
                }}
            );
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}