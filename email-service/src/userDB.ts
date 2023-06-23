import mongoose, { Document, Schema } from 'mongoose';

// Define a User schema
interface IUser extends Document {
  username: string;
  password: string;
  role: string;
  dailyMailsSent: number;
  incrementDailyMailsSent(): Promise<void>;
}

export const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  dailyMailsSent: { type: Number, required: true },
});

userSchema.methods.incrementDailyMailsSent = async function () {
  this.dailyMailsSent += 1;
  await this.save();
};

const User = mongoose.model<IUser>('User', userSchema);

export const setUpDatabase = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI!, {});
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
};

export async function createUser(
  username: string,
  password: string,
  role: string,
  dailyMailsSent: number
): Promise<IUser> {
  const user = new User({ username, password, role, dailyMailsSent });
  return await user.save();
}

export async function getUsersDailyMailsSent(): Promise<IUser[]> {
  return await User.find({}, { username: 1, dailyMailsSent: 1, _id: 0 }).exec();
}

export async function getUserById(userId: string): Promise<IUser | null> {
  return await User.findById(userId).exec();
}

export async function getUserByUsername(
  username: string
): Promise<IUser | null> {
  return await User.findOne({ username }).exec();
}

export async function updateUser(
  userId: string,
  updates: Partial<IUser>
): Promise<IUser | null> {
  return await User.findByIdAndUpdate(userId, updates, { new: true }).exec();
}

export async function deleteUser(userId: string): Promise<void> {
  await User.findByIdAndDelete(userId).exec();
}
