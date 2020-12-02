import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { catchError, switchMap, tap, toArray } from 'rxjs/operators';
import { INIT_TICKETS } from '../constants/tickets.const';
import { INIT_USERS } from '../constants/users.const';
import { TicketsService } from './tickets.service';

describe('TicketsService testing: ', () => {
    let service: TicketsService;

    beforeEach(() => {
        service = TestBed.inject(TicketsService);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('should list 2 tickets as initial values', done => {
        service.tickets().subscribe(tickets => {
            expect(tickets).toEqual(INIT_TICKETS);
            done();
        });
    });

    it('should fetch 1 ticket by ID', done => {
        const ticket = INIT_TICKETS[0];

        service.ticket(ticket.id).subscribe(foundTicket => {
            expect(foundTicket).toEqual(ticket);
            done();
        });
    });

    it('should create a new ticket', done => {
        const newTicket = { id: service.lastId + 1, description: 'Testing new ticket feature!', assigneeId: null, completed: false };

        service.newTicket(newTicket.description).pipe(
            switchMap(_ => service.tickets()),
        ).subscribe(tickets => {
            expect(tickets.length).toBe(INIT_TICKETS.length + 1);
            expect(tickets).toContain(newTicket);
            done();
        });
    });

    it('should complete an existing ticket which initially is not completed', done => {
        const { id } = INIT_TICKETS[0];

        service.ticket(id).pipe(
            tap(ticket => expect(ticket.completed).toBeFalse()),
            switchMap(ticket => service.complete(ticket.id))
        ).subscribe(ticket => {
            expect(ticket.completed).toBeTrue();
            done();
        });
    });

    it('should assign a new ticket', done => {
        const newTicket = { id: service.lastId + 1, description: 'Testing new ticket feature!', assigneeId: null, completed: false };
        const { id } = INIT_USERS[0];

        service.newTicket(newTicket.description).pipe(
            switchMap(ticket => service.assign(ticket, id)),
        ).subscribe(ticket => {
            expect(ticket.assigneeId).toBe(id);
            done();
        });
    });

    it('should filter tickets', done => {
        const ticket = INIT_TICKETS[0];

        service.filter(ticket.description).subscribe(tickets => {
            expect(tickets[0]).toEqual(ticket);
            expect(tickets.length).toBe(1);
            done();
        });
    });

    it('should fail to fetch 1 ticket by non-existing ID', done => {
        service.ticket(999999).pipe(
            catchError((err: Error) => {
                expect(err.message).toBe('Ticket not found');
                done();
                return of(null);
            })
        ).subscribe();
    });
});
