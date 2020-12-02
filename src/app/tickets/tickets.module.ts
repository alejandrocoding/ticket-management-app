import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TicketsRoutingModule } from './tickets-routing.module';

import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { TicketsDetailsComponent } from './ticket-details/tickets-details.component';
import { TicketAddComponent } from './ticket-add/ticket-add.component';

import { WithLoadingPipeModule } from '@pipes';

const materialModules = [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule
];

@NgModule({
    imports: [
        CommonModule,
        ...materialModules,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        TicketsRoutingModule,
        WithLoadingPipeModule
    ],
    declarations: [
        TicketsListComponent,
        TicketsDetailsComponent,
        TicketAddComponent,
    ],
})
export class TicketsModule { }
