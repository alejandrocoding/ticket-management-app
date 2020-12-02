import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EMPTY, Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeWhile, distinctUntilChanged, takeUntil, shareReplay, catchError } from 'rxjs/operators';

import { Ticket, User } from '@interfaces';
import { TicketsService, UsersService } from '@services';

import { TicketAddComponent } from '../ticket-add/ticket-add.component';

@Component({
    selector: 'app-tickets-list',
    templateUrl: './tickets-list.component.html',
    styleUrls: ['./tickets-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketsListComponent implements OnInit, OnDestroy {

    search = new FormControl('');

    loading$: Observable<boolean>;
    tickets$: Observable<Ticket[]>;
    users$: Observable<User[]>;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly ticketsService: TicketsService,
        private readonly usersService: UsersService,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar
    ) {
        this.loading$ = this.ticketsService.loading$;
        this.tickets$ = this.ticketsService.tickets().pipe(shareReplay());
        this.users$ = this.usersService.users().pipe(shareReplay());
    }

    ngOnInit(): void {
        this.search.valueChanges.pipe(
            debounceTime(350),
            distinctUntilChanged(),
            switchMap(ticketDescription => this.tickets$ = this.ticketsService.filter(ticketDescription)),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    goToDetails(ticket: Ticket): void {
        this.router.navigateByUrl(`/tickets/${ticket.id}`, { state: { ticket } });
    }

    openAddTicket(): void {
        if (this.dialog.openDialogs.length === 0) {
            const ref = this.dialog.open(TicketAddComponent, {
                position: { top: '10vh' } as DialogPosition,
                width: '35vw'
            });

            ref.afterClosed().pipe(
                takeWhile(v => !!v),
                switchMap((description: string) => this.ticketsService.newTicket(description))
            ).subscribe();
        }
    }

    assignTicket(ticket: Ticket, userId: number): void {
        this.ticketsService.assign(ticket, userId).pipe(
            catchError((err: Error) => {
                this.snackBar.open(err.message, '', { duration: 5000 });
                return of(EMPTY);
            })
        ).subscribe();
    }

    completeTicket(id: number): void {
        this.ticketsService.complete(id).pipe(
            catchError((err: Error) => {
                this.snackBar.open(err.message, '', { duration: 5000 });
                return of(EMPTY);
            })
        ).subscribe();
    }
}
