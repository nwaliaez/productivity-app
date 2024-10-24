// models/Task.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  tag?: string;
  assignedTo?: number; // Assuming the Postgres key is a number
  status?: string;
  priority?: string;
  dueDate?: Date;
  createdBy?: number; // ID from Postgres table
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tag: { type: String },
    assignedTo: { type: Number }, // Stores Postgres key (e.g., user ID)
    status: { type: String, default: 'pending' },
    priority: { type: String, default: 'medium' },
    dueDate: { type: Date },
    createdBy: { type: Number }, // ID from Postgres table
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default (mongoose.models.Task as Model<ITask>) ||
  mongoose.model<ITask>('Task', TaskSchema);
