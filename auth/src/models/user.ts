import mongoose from "mongoose";
import { PasswordHash } from "../utils/password-hash";

// creates an interface for Typescript detects User params.
interface UserAttsr {
    email: string,
    password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttsr): UserDoc
}

interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
     email: {
        type: String,
        required: true
     },
     password: {
        type: String,
        required: true
     }
});

userSchema.pre('save', async function(done) {
    if(this.isModified('password')){
        const hashed = await PasswordHash.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

userSchema.statics.build = (attrs: UserAttsr) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User };