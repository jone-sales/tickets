import mongoose from "mongoose";

// creates an interface for Typescript detects User params.
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
    updatedAt: Date
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
}, {
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

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export { Ticket };