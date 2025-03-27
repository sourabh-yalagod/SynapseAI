import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },
    name: { type: String, required: true, default: "Unnamed" },
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
  mongoose?.models?.documents ||
  mongoose?.models?.Document ||
  mongoose.model("Document", DocumentSchema);

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
  mongoose.model("Transaction", TransactionSchema);

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    customerId: { type: String, required: true },
    isValid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Subscription =
  mongoose.models?.subscriptions ||
  mongoose.model("subscriptions", subscriptionSchema);

const chatsSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
    chats: [
      {
        role: {
          type: String,
          enum: ["ai", "human"],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        timeStamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
const Chat = mongoose?.models?.chats || mongoose.model("chats", chatsSchema);

export { Document, Transaction, Chat, Subscription };
