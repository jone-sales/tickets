import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// creates an interface for Typescript detects Ticket params.
interface TicketAttsr {
    title: string,
    price: number,
    userId: string,
    createdAt: Date,
    updatedAt: Date
}

interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    version: number,
    orderId?: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttsr): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true,
      },
    orderId: {
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttsr) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export { Ticket };