import mongoose from "mongoose";
import { OrderStatus } from "@js_tickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

// creates an interface for Typescript detects Order params.
interface OrderAttsr {
    status: OrderStatus,
    userId: string,
    createdAt: Date,
    expiresAt: Date,
    ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus,
    userId: string,
    createdAt: Date,
    expiresAt: Date,
    ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttsr): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    userId: {
        type: String,
        required: true,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attrs: OrderAttsr) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);


export { Order };