/**
 * Sahyogi Initial Civic Dataset
 * Seeded with standard government services, welfare schemes, and active civic issues
 * matching the Celestial Governance design system.
 */

export const INITIAL_SERVICES = [
  {
    _id: "srv_passport_001",
    title: "Passport Application",
    description: "Apply for a new national passport or renew an existing one. Ensure you have all required identity proofs before starting the application.",
    category: "identity_documents",
    howToApply: "1. Register on the Passport Seva portal.\n2. Fill out the application form online.\n3. Schedule an appointment at your nearest Passport Seva Kendra (PSK).\n4. Attend verification with original documents and biometrics.",
    eligibility: "All citizens residing in the country with valid proof of identity, address, and date of birth.",
    requiredDocuments: [
      "Proof of Date of Birth (Birth Certificate or Matriculation Certificate)",
      "Proof of Identity (Aadhaar Card, Voter ID, or PAN Card)",
      "Proof of Current Address (Utility Bill, Rental Agreement, or Bank Passbook)",
      "Recent passport-sized photographs (white background)"
    ],
    fees: "₹1,500 for Normal Application (36 pages) / ₹2,000 for Jumbo Book (60 pages)",
    commonRejectionReasons: [
      "Discrepancy in spelling of names between birth certificate and ID proofs",
      "Incomplete address proof or unverified current residential tenure (< 1 year)",
      "Unresolved criminal charges or pending court summon records"
    ],
    link: "https://passportindia.gov.in",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    _id: "srv_pension_002",
    title: "Senior Citizen Pension Scheme",
    description: "Financial assistance program for senior citizens meeting eligibility criteria. Provides monthly stipend directly to linked bank accounts.",
    category: "welfare_schemes",
    howToApply: "1. Download form from Municipal Social Welfare portal or visit District Collectorate.\n2. Submit duly filled application with age verification and income certificate.\n3. Biometric KYC authentication at Common Service Center (CSC).\n4. Direct monthly DBT disbursement upon verification.",
    eligibility: "Citizens aged 60 years and above with annual household income below the notified BPL/low-income threshold.",
    requiredDocuments: [
      "Age Proof (Voter ID, School Leaving Certificate, or Birth Certificate)",
      "Income Certificate issued by Revenue Authority",
      "Bank Account details linked with Aadhaar",
      "Residence proof of residing in the state for minimum 3 years"
    ],
    fees: "Free of charge (Government Subsidized)",
    commonRejectionReasons: [
      "Applicant receiving other conflicting central or state pension benefits",
      "Family income exceeding prescribed income ceiling",
      "Bank account not mapped to NPCI Aadhaar payment bridge"
    ],
    link: "https://socialjustice.gov.in/schemes",
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    _id: "srv_license_003",
    title: "Commercial Driving License",
    description: "Application for issuing a new commercial driving license. Requires prior standard driving experience and medical fitness certificate.",
    category: "permits_licenses",
    howToApply: "1. Hold a valid Light Motor Vehicle (LMV) Learner's or Permanent license for at least 1 year.\n2. Complete authorized commercial driver training course.\n3. Submit Form 1A medical fitness certificate.\n4. Pass practical automated track driving test.",
    eligibility: "Individuals aged 20 years or older with minimum 8th standard education and valid LMV license history.",
    requiredDocuments: [
      "Existing LMV Driving License",
      "Form 1A Medical Fitness Certificate signed by a registered practitioner",
      "Commercial Driving School Training Certificate",
      "Address and Age Proof documents"
    ],
    fees: "₹1,000 application fee + ₹500 driving test fee",
    commonRejectionReasons: [
      "Failure in practical heavy motor vehicle / commercial driving skill test",
      "Expired or invalid medical fitness evaluation certificate",
      "History of severe traffic violation suspensions"
    ],
    link: "https://parivahan.gov.in",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    _id: "srv_water_004",
    title: "New Water & Sewerage Connection",
    description: "Apply for piped municipal water supply connection and wastewater drainage setup for residential or commercial properties.",
    category: "utilities",
    howToApply: "1. Submit property ownership documentation on the Municipal Water Board portal.\n2. Pay inspection and connection assessment fees.\n3. Municipal engineer site inspection for pipeline feasibility.\n4. Installation of digital water meter and activation.",
    eligibility: "Property owners or registered long-term leaseholders with authorized municipal building permits.",
    requiredDocuments: [
      "Property Tax Receipt of the current fiscal year",
      "Sanctioned Building Plan / Occupancy Certificate",
      "Identity Proof of Property Owner",
      "Plumber Certificate from certified municipal agency"
    ],
    fees: "₹2,500 initial connection deposit + pipeline laying charges based on distance",
    commonRejectionReasons: [
      "Outstanding property tax arrears on the applicant property",
      "Unsanctioned structural construction deviating from master plan"
    ],
    link: "https://municipalwater.gov.in",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    _id: "srv_property_tax_005",
    title: "Property Tax Assessment & Self-Declaration",
    description: "Assess annual property tax, calculate rebates for green energy installations, and obtain official digital clearance receipts.",
    category: "taxes",
    howToApply: "1. Enter Property Identification Number (PIN/PID).\n2. Review auto-calculated built-up area and zone slab rates.\n3. Claim applicable senior citizen or rainwater harvesting rebates.\n4. Make payment online via UPI, net banking, or debit card.",
    eligibility: "All owners of residential, commercial, industrial, and vacant land within municipal corporation limits.",
    requiredDocuments: [
      "Previous Year Tax Receipt or Sale Deed",
      "Building Approval Plan",
      "Electricity Bill for meter verification"
    ],
    fees: "Calculated based on Unit Area Value (UAV) method and zonal classification",
    commonRejectionReasons: [
      "Incorrect zone or built-up area input deviating from GIS satellite records"
    ],
    link: "https://propertytax.gov.in",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: "srv_food_safety_006",
    title: "FSSAI Food Business Registration",
    description: "Mandatory food safety registration and license for restaurants, street vendors, cloud kitchens, and food manufacturers.",
    category: "permits_licenses",
    howToApply: "1. Select Registration (turnover < ₹12L) or State/Central License.\n2. Upload kitchen layout and food safety management system plan.\n3. Undergo municipal health inspector audit.\n4. Receive 14-digit FSSAI QR certificate.",
    eligibility: "Any individual or business entity manufacturing, processing, packaging, storing, distributing, or selling food items.",
    requiredDocuments: [
      "Photo ID and Address Proof of Proprietor/Partners",
      "Proof of Business Premises (Rent Agreement/Electricity Bill)",
      "Food Safety Management Plan / Water Test Report",
      "List of food categories proposed to be manufactured or served"
    ],
    fees: "₹100/year for Basic Registration, ₹2,000 - ₹5,000/year for State License",
    commonRejectionReasons: [
      "Unsanitary water source or failure to submit potable water testing report",
      "Inappropriate commercial zoning clearance for kitchen equipment"
    ],
    link: "https://foscos.fssai.gov.in",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const INITIAL_ISSUES = [
  {
    _id: "iss_001",
    title: "Severe Pothole on Main St",
    description: "Large pothole forming near the intersection of Main and 4th. It's deep enough to cause vehicle damage and is poorly lit at night.",
    category: "roads",
    status: "in_progress",
    location: {
      address: "Intersection of Main St & 4th Ave, Central Ward",
      lat: 40.7128,
      lng: -74.0060
    },
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqKV22K4PvG4W1eF8QqM-Sdp4BByuBybuLCDgEBCjUsswstGMd2ZAEFoC77z_FGQbvEadeoZ2GuBnLSuEG9RyPLXgVN0G9KoRkWOD_uxG3mxUjqNAl11s5AqHe1b4ANhxKMax7KwuHU1SlyfrlSmBuUq4TS5UZ_j3x37cFnEUmD-O5_U44ambacEy1LQLKhnry78iYyXxMZk9HS78iMJvKDvfEJrgzu2NskWKFlgB4CrOQRvvcRWJquw",
    reportedBy: {
      _id: "usr_alex",
      name: "Alex"
    },
    statusHistory: [
      { status: "submitted", changedAt: new Date(Date.now() - 86400000 * 2).toISOString(), changedBy: "usr_alex" },
      { status: "in_review", changedAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), changedBy: "usr_staff" },
      { status: "in_progress", changedAt: new Date(Date.now() - 86400000 * 0.8).toISOString(), changedBy: "usr_staff" }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.8).toISOString()
  },
  {
    _id: "iss_002",
    title: "Low Water Pressure in Sector 4",
    description: "Consistent low pressure during morning peak hours for the last week. Affecting multiple apartment blocks in the area.",
    category: "water_supply",
    status: "submitted",
    location: {
      address: "Sector 4 Residential Block B, North District",
      lat: 40.7282,
      lng: -73.9942
    },
    imageUrl: "",
    reportedBy: {
      _id: "usr_priya",
      name: "Priya"
    },
    statusHistory: [
      { status: "submitted", changedAt: new Date(Date.now() - 3600000 * 5).toISOString(), changedBy: "usr_priya" }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    _id: "iss_003",
    title: "Streetlights Out on Park Ave",
    description: "A block of streetlights has been out for three nights, creating a safety hazard for pedestrians and late night cyclists.",
    category: "electricity",
    status: "resolved",
    location: {
      address: "Park Ave between 18th and 22nd Street",
      lat: 40.7350,
      lng: -73.9850
    },
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWBVV-sr3e7ifiRSniK1eTiOa6y13gNImO8bdnlQMKvf1xwQ9yJoHzJJgUETcrjvXPpbQZiOMgvJmhDcaGYVAYM9PgMo5isAK3Yp8h_NHz9OFXlv24u9goK7Z5KeIHfLnAc06CikymSDOlOIFJ2smLB8xHHc3tyw2F_dicaAqNpYC-DvDaQTLlifIlhHqrSxiamWDEZ1TkMAF_7PyG3U1hTbNbyd19lqiP1MNIFnFJ8CIqlmqXimJLIg",
    reportedBy: {
      _id: "usr_sarah",
      name: "Sarah"
    },
    statusHistory: [
      { status: "submitted", changedAt: new Date(Date.now() - 86400000 * 7).toISOString(), changedBy: "usr_sarah" },
      { status: "in_review", changedAt: new Date(Date.now() - 86400000 * 5).toISOString(), changedBy: "usr_staff" },
      { status: "in_progress", changedAt: new Date(Date.now() - 86400000 * 3).toISOString(), changedBy: "usr_staff" },
      { status: "resolved", changedAt: new Date(Date.now() - 86400000 * 1).toISOString(), changedBy: "usr_admin" }
    ],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    _id: "iss_004",
    title: "Overflowing Garbage Dumpster near Central Market",
    description: "Waste collection has been missed for four days. Stray animals are scattering trash across the sidewalk creating severe sanitary concerns.",
    category: "sanitation",
    status: "in_review",
    location: {
      address: "East Gate Commercial Plaza, Central Market",
      lat: 40.7200,
      lng: -74.0010
    },
    imageUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80",
    reportedBy: {
      _id: "usr_rahul",
      name: "Rahul"
    },
    statusHistory: [
      { status: "submitted", changedAt: new Date(Date.now() - 86400000 * 1).toISOString(), changedBy: "usr_rahul" },
      { status: "in_review", changedAt: new Date(Date.now() - 3600000 * 4).toISOString(), changedBy: "usr_staff" }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export const INITIAL_CHAT_HISTORY = [
  {
    _id: "chat_001",
    sessionId: "sess_1",
    sessionTitle: "Property Tax Assessment",
    timestamp: "Today, 10:42 AM",
    messages: [
      { role: "user", content: "How do I calculate rebate for solar rooftop on property tax?" },
      { role: "assistant", content: "Under the Municipal Property Tax Assessment & Self-Declaration scheme, residential buildings with grid-connected solar rooftop panels or rainwater harvesting systems are eligible for an upfront 10% rebate on their annual property tax value. You will need your electricity net-metering synchronization certificate when applying." }
    ]
  },
  {
    _id: "chat_002",
    sessionId: "sess_2",
    sessionTitle: "Utility Bill Dispute Setup",
    timestamp: "Today, 09:15 AM",
    messages: [
      { role: "user", content: "I need help understanding a utility dispute process. What are the required documents?" },
      { role: "assistant", content: "For a utility billing dispute, you need: 1) Your last 3 consecutive utility bills showing sudden variance, 2) Digital meter reading photograph with timestamp, 3) Current property ownership/tax receipt, and 4) A formal grievance declaration outlining the metering discrepancy." }
    ]
  },
  {
    _id: "chat_003",
    sessionId: "sess_3",
    sessionTitle: "Water Supply Registration",
    timestamp: "Yesterday",
    messages: [
      { role: "user", content: "What is the fee for new water supply connection?" },
      { role: "assistant", content: "The initial deposit for a New Water & Sewerage Connection is ₹2,500, plus pipeline installation charges calculated on actual distance from the municipal main line. Processing usually takes 7 business days following engineer site inspection." }
    ]
  }
];
