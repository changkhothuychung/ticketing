
import {Subjects} from '../subjects';
import {Publisher} from '../base-publisher';
import {PaymentCreatedEvent} from '../payment-created-event';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
