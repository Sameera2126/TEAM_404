// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['farmer', 'expert', 'government', 'admin'],
      default: 'farmer',
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      // This ensures the password is not returned in queries unless explicitly asked for
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
// In User.js, add this before the model export
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });
// userSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// }
export default mongoose.model('User', userSchema);