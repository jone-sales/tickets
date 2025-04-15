import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

// creates an interface for Typescript detects Ticket params.
interface TicketAttsr {
    title: string,
    price: number
}

export interface TicketDoc extends mongoose.Document {
    title: string,
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttsr): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0
    },
    title: {
        type: String,
        required: true
    }
}, 
    {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttsr) => {
    return new Ticket(attrs);
}

ticketSchema.methods.isReserved = async function() {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export { Ticket };