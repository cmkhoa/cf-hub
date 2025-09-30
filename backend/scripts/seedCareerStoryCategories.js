const mongoose = require("mongoose");
const Category = require("../models/Category");

const careerStoryCategories = [
  {
    name: "Resume Tips",
    slug: "resume-tips",
    description: "Tips and advice for creating effective resumes",
  },
  {
    name: "Interview Tips",
    slug: "interview-tips",
    description: "Guidance for successful job interviews",
  },
  {
    name: "Technical Tips",
    slug: "technical-tips",
    description: "Technical career advice and insights",
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/cf-hub"
    );

    console.log("Seeding career story categories...");

    for (const categoryData of careerStoryCategories) {
      const existing = await Category.findOne({ slug: categoryData.slug });
      if (!existing) {
        await Category.create(categoryData);
        console.log(`Created category: ${categoryData.name}`);
      } else {
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }

    console.log("Career story categories seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
