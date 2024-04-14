import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: CallableFunction): void {
    // this is where i would store the users id in the session
    done(null, user);
  }

  deserializeUser(payload: any, done: CallableFunction): void {
    // this is were i would fetch the user from the database
    done(null, payload);
  }
}
