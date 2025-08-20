import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'technology'],
        required: true,
        trim: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        trim: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past or today'
        }
    },
    renewalDate:{
        type: Date,
        trim: true,
        validate: {
            validator: function(value){ 
                return value > this.startDate;
            },
            message: 'Renewal date must be in the future'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }

}, {timestamps: true})

subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.category]);
    }

    if(this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);


export default Subscription;