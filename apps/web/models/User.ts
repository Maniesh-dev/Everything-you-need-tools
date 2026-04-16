import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── TypeScript Interface ───────────────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  authProvider: 'local' | 'google';
  googleId?: string;
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpiry: Date | null;
  refreshTokens: string[]; // hashed refresh tokens (supports multi-device)
  pinnedTools: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Schema ─────────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },
    password: {
      type: String,
      required: [
        function (this: any) {
          return this.authProvider === 'local';
        },
        'Password is required for local accounts.',
      ],
      minlength: [8, 'Password must be at least 8 characters.'],
      select: false, // Never return password by default in queries
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null/undefined values
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false, // Don't leak token hashes
    },
    pinnedTools: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save Hook: Hash password before saving ─────────────────────────────────
UserSchema.pre('save', async function () {
  // Only hash if password exists and was modified (or is new)
  if (!this.password || !this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance Method: Compare password ──────────────────────────────────────────
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Export ─────────────────────────────────────────────────────────────────────
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
