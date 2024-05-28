import mongoose, {Document, Schema} from 'mongoose';

export interface IPractice extends Document {
  name: string,
  playerId: number,
  date: Date
}

const practiceSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: Date,
  },
  playerId: {
    required: true,
    type: Number,
  },
});

const Practice = mongoose.model<IPractice>('Practice',practiceSchema);
export default Practice;