import mongoose from "mongoose";
import { OrderStatus } from "@js_tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

// creates an interface for Typescript detects Order params.
interface OrderAttsr {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus,
    userId: string,
    price: number;
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttsr): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttsr) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };