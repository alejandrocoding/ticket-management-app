import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { TicketsDetailsComponent } from './ticket-details/tickets-details.component';

const routes: Routes = [
    { path: '', component: TicketsListComponent },
    { path: ':id', component: TicketsDetailsComponent },
    { path: '**', redirectTo: '/tickets', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketsRoutingModule { }
