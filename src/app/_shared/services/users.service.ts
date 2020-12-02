import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

import { User } from '../interfaces/user.interface';
import { randomDelay } from '../helpers/utils';
import { INIT_USERS } from '../constants/users.const';

@Injectable({ providedIn: 'root' })
export class UsersService {

    private usersSource = new BehaviorSubject<User[]>(INIT_USERS);
    private users$ = this.usersSource.asObservable();

    users(): Observable<User[]> {
        return this.users$.pipe(
            delay(randomDelay()),
        );
    }

    user(id: number): Observable<User> {
        return this.users$.pipe(
            delay(randomDelay()),
            mergeMap(users => {
                const foundUser = users.find(user => user.id === id);
                if (foundUser) {
                    return of(foundUser);
                }
                return throwError(new Error('User not found'));
            }),
        );
    }
}
