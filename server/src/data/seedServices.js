// Seeds a handful of realistic government services so the app is usable
// out of the box. Run with: npm run seed --prefix server
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import Service from "../models/Service.js";
import mongoose from "mongoose";

const services = [
  {
    title: "Apply for a Birth Certificate",
    description: "Get an official copy of a birth certificate for yourself or a dependent.",
    category: "identity_documents",
    howToApply: "Visit your local municipal registrar office with proof of birth (hospital record) and a valid ID, or apply online through your city's civil registry portal.",
  },
  {
    title: "Food Assistance / Ration Card",
    description: "Apply for subsidized food grains and essentials through the public distribution system.",
    category: "welfare_schemes",
    howToApply: "Submit an application at your local food & civil supplies office with proof of address, income certificate, and family ID photos.",
  },
  {
    title: "Building / Renovation Permit",
    description: "Get approval before constructing or significantly renovating a residential property.",
    category: "permits_licenses",
    howToApply: "Submit building plans, land ownership documents, and an application form to your municipal planning department for review.",
  },
  {
    title: "Water Connection (New)",
    description: "Apply for a new household water supply connection.",
    category: "utilities",
    howToApply: "File an application with the local water board along with proof of residence and property tax receipt.",
  },
  {
    title: "Property Tax Payment",
    description: "Pay annual property tax for a residential or commercial property.",
    category: "taxes",
    howToApply: "Pay online via your municipality's tax portal using your Property ID, or in person at the municipal tax office.",
  },
];

async function run() {
  await connectDB();
  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log(`[seed] Inserted ${services.length} services.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
