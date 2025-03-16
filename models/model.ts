import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    username: { type: String, required: true },
    url: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["basic", "pro", "platinum"],
      default: "basic",
    },
  },
  { timestamps: true }
);

const Document =
  mongoose?.models?.Document || mongoose.model("Document", DocumentSchema);

const TransactionSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, default: "stripe" },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["successful", "failed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema); // ✅ Use Singular Name

export { Document, Transaction };
