// Seeds realistic Indian government services (national + West Bengal state
// schemes) so the app is genuinely usable out of the box.
// Run with: npm run seed --prefix backend
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import Service from "../models/Service.js";
import mongoose from "mongoose";

const services = [
  {
    title: "Apply for a Birth Certificate",
    description: "Get an official copy of a birth certificate for yourself or a dependent, issued by the local municipal or panchayat registrar.",
    category: "identity_documents",
    howToApply: "Visit your local municipal corporation/panchayat registrar office with proof of birth, or apply online via your state's Civil Registration System (CRS) portal.",
    eligibility: "Anyone born within the jurisdiction, or a parent/guardian applying on behalf of a minor.",
    requiredDocuments: ["Hospital birth record or notification slip", "Valid photo ID of applicant/parent", "Proof of address"],
    fees: "Free within 21 days of birth; nominal late fee thereafter (varies by state).",
    commonRejectionReasons: ["Hospital birth record missing or illegible", "Name spelling mismatch across documents", "Application filed outside jurisdiction"],
  },
  {
    title: "Aadhaar Card - New Enrollment / Update",
    description: "Enroll for a new Aadhaar number or update existing Aadhaar details (address, mobile, biometrics).",
    category: "identity_documents",
    howToApply: "Book a slot at your nearest Aadhaar Enrollment/Update Centre via the UIDAI website or visit a centre directly with required documents.",
    eligibility: "All Indian residents, including minors (enrolled via a parent/guardian).",
    requiredDocuments: ["Proof of identity (POI)", "Proof of address (POA)", "Proof of date of birth", "Passport-size photo (for new enrollment)"],
    fees: "Free for new enrollment; ₹50 for demographic updates, ₹100 for biometric updates.",
    commonRejectionReasons: ["Document photocopy not matching original", "Address proof older than accepted validity window"],
    link: "https://uidai.gov.in",
  },
  {
    title: "PAN Card Application",
    description: "Apply for a Permanent Account Number (PAN), required for income tax filing, opening bank accounts, and financial transactions above certain thresholds.",
    category: "identity_documents",
    howToApply: "Apply online via NSDL/UTIITSL portals or through Common Service Centres (CSC), submitting identity, address, and date-of-birth proof.",
    eligibility: "Any Indian citizen, NRI, or entity required to file income tax or conduct high-value financial transactions.",
    requiredDocuments: ["Proof of identity", "Proof of address", "Proof of date of birth", "Passport-size photo"],
    fees: "Approx. ₹107 for Indian communication address, ₹1,017 for foreign address.",
    link: "https://www.onlineservices.nsdl.com",
  },
  {
    title: "Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)",
    description: "West Bengal state scholarship for meritorious students from economically weaker sections, covering school, undergraduate, and postgraduate levels.",
    category: "welfare_schemes",
    howToApply: "Register and apply online through the official SVMCM portal (svmcm.wbhed.gov.in) during the application window announced each academic year, uploading marksheets, income certificate, and bank details.",
    eligibility: "West Bengal domicile students who cleared Class 10/12 or are enrolled in UG/PG courses, meeting minimum marks and family income criteria set annually.",
    requiredDocuments: ["Previous academic marksheet/certificate", "Income certificate", "Bank passbook (student's own account)", "Domicile/residence proof", "Passport-size photo", "Aadhaar card"],
    fees: "No application fee.",
    commonRejectionReasons: ["Bank account not in student's own name", "Income certificate outdated or from wrong authority", "Mismatch between marksheet name and Aadhaar name", "Applying after the portal deadline"],
    link: "https://svmcm.wbhed.gov.in",
  },
  {
    title: "Kanyashree Prakalpa",
    description: "West Bengal government scheme providing financial incentives to adolescent girls to delay marriage and continue education.",
    category: "welfare_schemes",
    howToApply: "Apply through your school/college (K1, annual scholarship) or online via the Kanyashree portal for the one-time K2 grant after turning 18.",
    eligibility: "Unmarried girls aged 13-18 enrolled in school (K1), or unmarried girls aged 18-19 who have completed Class 13 or equivalent (K2), from West Bengal.",
    requiredDocuments: ["School/college enrollment proof", "Birth certificate", "Bank account details", "Self-declaration of unmarried status"],
    fees: "No application fee.",
    link: "https://wbkanyashree.gov.in",
  },
  {
    title: "PM-KISAN Samman Nidhi",
    description: "Central government income support scheme providing ₹6,000 per year to eligible farmer families in three equal installments.",
    category: "welfare_schemes",
    howToApply: "Register via the PM-KISAN portal, through Common Service Centres, or with the local revenue/agriculture officer, submitting land records and bank details.",
    eligibility: "Small and marginal farmer families with cultivable landholding, subject to state-specific exclusion criteria (e.g. institutional landholders, income-tax payers).",
    requiredDocuments: ["Land ownership records", "Aadhaar card", "Bank account passbook", "Mobile number linked to Aadhaar"],
    fees: "No application fee.",
    commonRejectionReasons: ["Aadhaar not linked to bank account", "Land record ownership mismatch", "Applicant falls under exclusion category"],
    link: "https://pmkisan.gov.in",
  },
  {
    title: "Ration Card (Food, Public Distribution System)",
    description: "Apply for a ration card to access subsidized food grains and essentials through the Public Distribution System.",
    category: "welfare_schemes",
    howToApply: "Submit an application at your local Food & Supplies office or apply online via your state's food & civil supplies portal, with proof of address and family details.",
    eligibility: "Resident households; category (AAY/Priority/RKSY) determined by family income and state-specific criteria.",
    requiredDocuments: ["Proof of address", "Income certificate", "Passport-size photos of all family members", "Aadhaar card of all members"],
    fees: "Nominal card issuance fee (varies by state, typically under ₹50).",
  },
  {
    title: "Building / Renovation Permit",
    description: "Get municipal approval before constructing or significantly renovating a residential or commercial property.",
    category: "permits_licenses",
    howToApply: "Submit building plans, land ownership documents, and an application form to your municipal corporation's building/planning department for review.",
    eligibility: "Property owners or their authorized representatives with clear title to the land.",
    requiredDocuments: ["Land ownership / title deed", "Building plan approved by a licensed architect/engineer", "No-objection certificate (if applicable)", "Property tax clearance"],
    fees: "Varies by plot size and municipality; typically calculated per square foot of built-up area.",
    commonRejectionReasons: ["Plan violates local building bylaws (setback, height)", "Incomplete ownership documentation", "Outstanding property tax dues"],
  },
  {
    title: "Trade License",
    description: "Mandatory license to legally operate a shop, business, or commercial establishment within municipal limits.",
    category: "permits_licenses",
    howToApply: "Apply through your municipal corporation's trade license department or online civic portal, submitting ownership/rental proof and business details.",
    eligibility: "Any individual or entity operating a commercial establishment within municipal jurisdiction.",
    requiredDocuments: ["Proof of business premises (ownership/rent agreement)", "Identity proof of owner", "NOC from fire department (for certain trade categories)", "GST registration (if applicable)"],
    fees: "Varies by trade category and establishment size; renewed annually.",
  },
  {
    title: "New Electricity Connection",
    description: "Apply for a new residential or commercial electricity connection from your state electricity distribution company.",
    category: "utilities",
    howToApply: "Apply online via your state electricity board's portal or visit the local sub-division office with property and identity documents.",
    eligibility: "Property owners or tenants (with owner's NOC) within the electricity board's service area.",
    requiredDocuments: ["Proof of address", "Identity proof", "Property ownership/rental agreement", "Load requirement details (for commercial)"],
    fees: "Security deposit plus connection charges based on sanctioned load.",
  },
  {
    title: "Water Connection (New)",
    description: "Apply for a new household or commercial water supply connection from the municipal water board.",
    category: "utilities",
    howToApply: "File an application with the local water board or municipal office along with proof of residence and property tax receipt.",
    eligibility: "Property owners or tenants with owner consent, within the water board's service area.",
    requiredDocuments: ["Proof of residence", "Latest property tax receipt", "Identity proof"],
    fees: "Connection fee plus applicable security deposit; varies by municipality.",
  },
  {
    title: "Property Tax Payment",
    description: "Pay annual property tax for a residential, commercial, or industrial property to your municipal corporation.",
    category: "taxes",
    howToApply: "Pay online via your municipal corporation's property tax portal using your Property ID/Assessee number, or in person at the municipal tax office.",
    eligibility: "Owners of residential, commercial, or industrial property within municipal limits.",
    requiredDocuments: ["Property ID / assessment number", "Previous year's tax receipt (if available)"],
    fees: "Calculated based on property valuation, location, and usage type; often discounted for early/online payment.",
  },
  {
    title: "Income Tax Return (ITR) Filing",
    description: "File your annual income tax return with the Income Tax Department, required for salaried individuals, self-employed persons, and businesses above the taxable threshold.",
    category: "taxes",
    howToApply: "File online through the Income Tax Department's e-filing portal using PAN, Form 16 (if salaried), and income/investment details.",
    eligibility: "Individuals and entities with income above the basic exemption limit, or those required to file regardless of income (e.g. certain refund claims).",
    requiredDocuments: ["PAN card", "Aadhaar card", "Form 16 / income proof", "Bank account statements", "Investment/deduction proofs (80C, 80D, etc.)"],
    fees: "Free for self-filing on the official portal.",
    commonRejectionReasons: ["PAN-Aadhaar not linked", "Mismatch between Form 16 and declared income", "Missing bank account pre-validation for refunds"],
    link: "https://www.incometax.gov.in",
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
