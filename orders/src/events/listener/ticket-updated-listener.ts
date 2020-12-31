import {Message} from 'node-nats-streaming';
import {Subjects} from '../publishers/subjects'; 
import {Listener} from '../publishers/base-listener'; 
import {TicketCreatedEvent} from '../publishers/ticket-created-event'; 
import {Ticket} from '../../models/ticket'; 
import {queueGroupName} from './queue-group-name';
import {TicketUpdatedEvent} from '../publishers/ticket-updated-event';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
  
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
      const ticket = await Ticket.findByEvent(data);
  
      if (!ticket) {
        throw new Error('Ticket not found');
      }
  
      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();
  
      msg.ack();
    }
  }
  