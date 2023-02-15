import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const gameTemplateSchema = new Schema(
  {
    name: { type: String },
    slug: { type: String },
    modes: { type: [String], default: ["casual"] },
    playerCounts: { type: [Number] },
    description: { type: String },
    howToPlay: { type: String },
    icon: { type: String },
  	isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

gameTemplateSchema.pre("save", function (next) {
  this.slug = this.name.split(" ").join("-");
  next();
});

export default models.GameTemplate || model("GameTemplate", gameTemplateSchema);
