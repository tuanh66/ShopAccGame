import mongoose from "mongoose";

const cardTopUpSchema = new mongoose.Schema(
  {
    partner: { 
      type: String, 
      required: true,
      enum: ["thesieure.com", "cardvip.vn", "doithe1s.vn"]
    },
    discount: { type: Number, required: true },
    partner_id: { type: String, required: true },
    partner_key: { type: String, required: true },
  },
  { timestamps: true },
);

const CardTopUp = mongoose.model("CardTopUp", cardTopUpSchema);
export default CardTopUp;
