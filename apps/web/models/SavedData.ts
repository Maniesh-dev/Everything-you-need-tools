import mongoose from 'mongoose';

const SavedDataSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please provide the category slug.'],
      // We can add enum validation based on CategorySlug from lib/categories.ts if desired later,
      // but keeping it flexible for now is often better until requirements solidify.
    },
    toolId: {
      type: String,
      description: 'Optional ID/Slug of the specific tool that generated the data',
    },
    userId: {
      type: String,
      description: 'Optional User ID. Useful for when authentication is added in the future.',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide the data to save.'],
      description: 'The specific generated data payload from the tool. Can be any structure.',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Mongoose handles compilation internally. 
// We check if the model is already on mongoose.models to prevent "OverwriteModelError" 
// which happens often during development with hot reloads in Next.js
export default mongoose.models.SavedData || mongoose.model('SavedData', SavedDataSchema);
