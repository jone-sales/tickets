import { Subjects, Publisher, ExpirationCompleteEvent } from "@js_tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
   subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}