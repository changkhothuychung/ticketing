import {  Subjects } from './subjects';
import {TicketUpdatedEvent} from './ticket-updated-event';
import {Publisher} from './base-publisher';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
