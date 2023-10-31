import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
    		    private jwtService: JwtService
	) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if ( user.success ) {
            const passwordValid = await bcrypt.compare(password, user.password)
            if (passwordValid) {
                const { password, ...result } = user;
                return result;
            }
            else {
                return null;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.success };
	    return {
	  	    access_token: this.jwtService.sign(payload)
	    };
    }
}
