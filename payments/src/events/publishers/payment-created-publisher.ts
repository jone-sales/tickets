import { PaymentCreatedEvent, Publisher, Subjects } from "@js_tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}