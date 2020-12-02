import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.scss']
})
export class TicketAddComponent implements OnInit {

  ticketDescription = new FormControl('', [Validators.required]);

  constructor(private readonly dialogRef: MatDialogRef<TicketAddComponent>) { }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close(this.ticketDescription.value);
  }

}
