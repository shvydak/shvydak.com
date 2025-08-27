import mongoose, {Document, Schema} from 'mongoose'
import bcrypt from 'bcryptjs'
import {IUser, UserRole} from '@/types'

// Extend the IUser interface to include Mongoose Document methods
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(candidatePassword: string): Promise<boolean>
    toJSON(): any
}

// User schema definition
const userSchema = new Schema<IUserDocument>(
    {
        username: {
            type: String,
            required: false,
            unique: false,
            lowercase: false,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false, // Don't include password in queries by default
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
        toJSON: {virtuals: true}, // Include virtual fields when converting to JSON
        toObject: {virtuals: true},
    }
)

// Virtual for full name
userSchema.virtual('fullName').get(function (this: IUserDocument): string {
    return `${this.firstName} ${this.lastName}`
})

// Index for better query performance
userSchema.index({email: 1})
userSchema.index({role: 1})
userSchema.index({isActive: 1})

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next()
    }

    try {
        // Hash password with salt rounds of 10
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error as Error)
    }
})

// Pre-save middleware to validate email uniqueness
userSchema.pre('save', async function (next) {
    if (this.isModified('email')) {
        try {
            const existingUser = await mongoose.model('User').findOne({
                email: this.email,
                _id: {$ne: this._id}, // Exclude current user from check
            })

            if (existingUser) {
                throw new Error('Email already exists')
            }
        } catch (error) {
            return next(error as Error)
        }
    }
    next()
})

// Instance method to compare password
/**
 * Compares a provided password with the user's hashed password.
 * Returns true if the passwords match, false otherwise.
 * Throws an error if the comparison fails.
 */
userSchema.methods['comparePassword'] = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        // bcrypt.compare checks if the candidate password matches the stored hash
        return await bcrypt.compare(candidatePassword, this['password'])
    } catch (error) {
        throw new Error('Password comparison failed')
    }
}

// Override toJSON method to exclude password
userSchema.methods['toJSON'] = function (): any {
    const userObject = this['toObject']()
    delete userObject.password
    return userObject
}

// Static method to find user by email
userSchema.statics['findByEmail'] = function (email: string) {
    return this.findOne({email: email.toLowerCase()})
}

// Static method to find active users
userSchema.statics['findActive'] = function () {
    return this.find({isActive: true})
}

// Export the model
export const User = mongoose.model<IUserDocument>('User', userSchema)
