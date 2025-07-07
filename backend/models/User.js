const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// Define the User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        trim: true,
        lowercase: true, // Store emails in lowercase
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Basic email regex validation
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Define possible roles
        default: 'user' // Default role for new users
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set creation date
    }
});

// Pre-save hook to hash the password before saving a new user
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    // Generate a salt (random string) to add to the password for hashing
    const salt = await bcrypt.genSalt(10); // 10 rounds of hashing
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Continue to the next middleware/save operation
});

// Method to compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Use bcrypt.compare to compare the plain text password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);