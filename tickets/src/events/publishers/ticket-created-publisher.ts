import { Subjects, TicketCreatedEvent, Publisher } from "@js_tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}


