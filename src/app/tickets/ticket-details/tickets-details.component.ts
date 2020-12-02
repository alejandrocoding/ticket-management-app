import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { iif, Observable, of } from 'rxjs';
import { concatMap, shareReplay } from 'rxjs/operators';

import { Ticket } from '@interfaces';
import { TicketsService } from '@services';

@Component({
    selector: 'app-tickets-details',
    templateUrl: './tickets-details.component.html',
    styleUrls: ['./tickets-details.component.scss']
})
export class TicketsDetailsComponent implements OnInit {

    ticket$!: Observable<Ticket | undefined>;
    loading$: Observable<boolean>;

    constructor(
        private readonly ticketsService: TicketsService,
        private readonly route: ActivatedRoute,
    ) {
        this.loading$ = this.ticketsService.loading$;
    }

    ngOnInit(): void {
        this.ticket$ = of(this.getTicketByRouteState()).pipe(
            concatMap(ticket => iif(() => (!!ticket), of(ticket), this.getTicketByRouteId())),
            shareReplay()
        );
    }

    private getTicketByRouteState(): Ticket | undefined {
        return history.state.ticket as Ticket;
    }

    private getTicketByRouteId(): Observable<Ticket | undefined> {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            return of(undefined);
        }
        return this.ticketsService.ticket(+id);
    }
}
