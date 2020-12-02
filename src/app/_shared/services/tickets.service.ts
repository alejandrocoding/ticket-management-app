import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, mergeMap, tap } from 'rxjs/operators';

import { INIT_TICKETS } from '../constants/tickets.const';
import { randomDelay } from '../helpers/utils';
import { Ticket } from '../interfaces/ticket.interface';

@Injectable({ providedIn: 'root' })
export class TicketsService {

    private ticketsSource = new BehaviorSubject<Ticket[]>(INIT_TICKETS);
    private tickets$ = this.ticketsSource.asObservable();

    private loadingSource = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSource.asObservable();

    lastId = Math.max(...INIT_TICKETS.map(ticket => ticket.id));

    constructor() { }

    tickets(): Observable<Ticket[]> {
        return this.tickets$.pipe(
            tap(() => this.loadingSource.next(true)),
            delay(randomDelay()),
            tap(() => this.loadingSource.next(false))
        );
    }

    ticket(id: number): Observable<Ticket> {
        return this.tickets$.pipe(
            tap(() => this.loadingSource.next(true)),
            delay(randomDelay()),
            mergeMap(tickets => {
                const foundTicket = tickets.find(ticket => ticket.id === id);
                if (foundTicket) {
                    return of(foundTicket);
                }
                this.loadingSource.next(false);
                return throwError(new Error('Ticket not found'));
            }),
            tap(() => this.loadingSource.next(false)),
        );
    }

    filter(description: string): Observable<Ticket[]> {
        const filtered$ = this.tickets$.pipe(
            map(tickets => tickets.filter(ticket => ticket.description.toLowerCase().includes(description.toLowerCase())))
        );
        const ticketObs = (description) ? filtered$ : this.tickets$;

        return ticketObs.pipe(
            tap(() => this.loadingSource.next(true)),
            delay(randomDelay()),
            tap(() => this.loadingSource.next(false)),
        );
    }

    newTicket(description: string): Observable<Ticket> {
        const newTicket: Ticket = {
            id: ++this.lastId,
            description,
            assigneeId: null,
            completed: false
        };

        return of(newTicket).pipe(
            tap(() => this.loadingSource.next(true)),
            delay(randomDelay()),
            tap((ticket: Ticket) => this.ticketsSource.next([...this.ticketsSource.getValue(), ticket])),
        );
    }

    assign(ticket: Ticket, userId: number): Observable<Ticket> {
        return of(ticket).pipe(
            tap(() => this.loadingSource.next(true)),
            delay(randomDelay()),
            tap(updatedTicket => {
                updatedTicket.assigneeId = userId;
                const index = this.ticketsSource.getValue().findIndex(tick => tick.id === updatedTicket.id);
                this.ticketsSource.getValue()[index] = { ...updatedTicket };
            }),
            tap(() => this.loadingSource.next(false))
        );
    }

    complete(ticketId: number): Observable<Ticket> {
        return this.ticket(ticketId).pipe(
            tap(() => this.loadingSource.next(true)),
            delay(randomDelay()),
            tap(foundTicket => {
                foundTicket.completed = true;
                const index = this.ticketsSource.getValue().findIndex(ticket => ticket.id === foundTicket.id);
                this.ticketsSource.getValue()[index] = { ...foundTicket };
            }),
            tap(() => this.loadingSource.next(false))
        );
    }
}
