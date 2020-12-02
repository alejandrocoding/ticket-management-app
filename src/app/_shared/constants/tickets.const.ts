import { Ticket } from '../interfaces/ticket.interface';

export const INIT_TICKETS: Ticket[] = [
    {
        id: 0,
        description: 'Install a monitor arm',
        assigneeId: 111,
        completed: false
    },
    {
        id: 1,
        description: 'Move the desk to the new location',
        assigneeId: 111,
        completed: false
    }
];
