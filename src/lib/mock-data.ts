import copperWire from "@/assets/copper-wire.jpg";
import hdpeFlakes from "@/assets/hdpe-flakes.jpg";
import cottonWaste from "@/assets/cotton-waste.jpg";
import cartonBales from "@/assets/carton-bales.jpg";
import glassCullet from "@/assets/glass-cullet.jpg";
import ewasteBoards from "@/assets/ewaste-boards.jpg";
import aluminiumScrap from "@/assets/aluminium-scrap.jpg";

export const CATEGORIES = [
  "Metal",
  "Plastic",
  "Textile",
  "Paper",
  "Glass",
  "Electronic Waste",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const UNITS = ["kg", "tonne", "unit"] as const;
export type Unit = (typeof UNITS)[number];

export const CONDITIONS = [
  "Clean / Sorted",
  "Mixed / Unsorted",
  "Lightly Contaminated",
  "Surplus - Unused",
  "Used - Reusable",
] as const;

export const PROBLEM_TYPES = [
  "Wrong Material",
  "Quantity Mismatch",
  "Quality Mismatch",
  "Damaged Material",
  "Contamination",
  "Certification / Document Issue",
  "Other",
] as const;
export type ProblemType = (typeof PROBLEM_TYPES)[number];

export const RESOLUTIONS = [
  "Buyer claim accepted",
  "Seller claim accepted",
  "Partial settlement",
  "Replacement",
  "Cancelled",
] as const;
export type Resolution = (typeof RESOLUTIONS)[number];

export type VerificationStatus = "pending" | "verified" | "rejected";

export type DocumentRecord = {
  name: string;
  status: "Uploaded" | "Verified";
};

export type Industry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  lat: number;
  lng: number;
  verification: VerificationStatus;
  rating: number;
  reviewCount: number;
  memberSince: string;
  about: string;
  documents: DocumentRecord[];
  reviewNote?: string;
};

export type Material = {
  id: string;
  name: string;
  category: Category;
  sellerId: string;
  image: string;
  description: string;
  quantity: number;
  unit: Unit;
  condition: string;
  reusable: boolean;
  recyclable: boolean;
  specs: { label: string; value: string }[];
  documents: DocumentRecord[];
  pricePerUnit: number;
  priceType: "Fixed" | "Negotiable";
  minOrder: number;
  address: string;
  city: string;
  state: string;
  pin: string;
  lat: number;
  lng: number;
  listedOn: string;
  status: "Active" | "Flagged" | "Hidden";
};

export type TxStatus =
  | "Requested"
  | "Agreed"
  | "Delivered"
  | "Inspection"
  | "Completed"
  | "Rejected"
  | "Problem Reported";

export type TimelineEntry = { status: string; at: string; note?: string };

export type Dispute = {
  id: string;
  transactionId: string;
  problemType: ProblemType;
  description: string;
  evidence: string[];
  sellerResponse?: string;
  status: "Open" | "Resolved";
  resolution?: Resolution;
  resolutionNote?: string;
  raisedOn: string;
};

export type Transaction = {
  id: string;
  materialId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  unit: Unit;
  proposedPrice: number;
  agreedPrice?: number;
  requirements?: string;
  status: TxStatus;
  timeline: TimelineEntry[];
  counterOffer?: { price: number; note: string };
  rating?: number;
  review?: string;
};

export const DEMO_INDUSTRY_ID = "ind-0";

export const INDUSTRIES: Industry[] = [
  {
    id: "ind-0",
    name: "Anantha Engineering Works",
    email: "ops@ananthaengg.in",
    phone: "+91 98400 11220",
    category: "Metal Fabrication",
    address: "Plot 14, SIDCO Industrial Estate, Kurichi",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pin: "641021",
    lat: 10.9601,
    lng: 76.9629,
    verification: "verified",
    rating: 4.6,
    reviewCount: 18,
    memberSince: "Jan 2024",
    about:
      "Precision sheet metal fabrication unit. We sell aluminium and steel offcuts from our press shop and buy recycled polymer and packaging material for in-house use.",
    documents: [
      { name: "Business Registration Certificate", status: "Verified" },
      { name: "GST / Business ID", status: "Verified" },
      { name: "Industry Authorization Certificate", status: "Verified" },
    ],
  },
  {
    id: "ind-1",
    name: "Bharat Copper Works",
    email: "sales@bharatcopper.in",
    phone: "+91 98401 33445",
    category: "Metal Processing",
    address: "34 Ganapathy Industrial Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pin: "641006",
    lat: 11.0168,
    lng: 76.9558,
    verification: "verified",
    rating: 4.7,
    reviewCount: 42,
    memberSince: "Mar 2023",
    about:
      "Copper rod and wire manufacturer. Regular seller of bare bright copper wire scrap and copper granules.",
    documents: [
      { name: "Business Registration Certificate", status: "Verified" },
      { name: "GST / Business ID", status: "Verified" },
      { name: "Industry Authorization Certificate", status: "Verified" },
    ],
  },
  {
    id: "ind-2",
    name: "Sundaram Polymers Pvt Ltd",
    email: "contact@sundarampolymers.in",
    phone: "+91 98402 55667",
    category: "Plastics & Polymers",
    address: "Unit 7, Ambattur Industrial Estate",
    city: "Chennai",
    state: "Tamil Nadu",
    pin: "600058",
    lat: 13.0827,
    lng: 80.2707,
    verification: "verified",
    rating: 4.5,
    reviewCount: 31,
    memberSince: "Jul 2023",
    about: "Polymer recycling and compounding. Supplier of washed HDPE and PP flakes.",
    documents: [
      { name: "Business Registration Certificate", status: "Verified" },
      { name: "GST / Business ID", status: "Verified" },
      { name: "Industry Authorization Certificate", status: "Verified" },
    ],
  },
  {
    id: "ind-3",
    name: "Kaveri Textile Mills",
    email: "purchase@kaveritextiles.in",
    phone: "+91 98403 77889",
    category: "Textiles",
    address: "SF 210, Palladam Road",
    city: "Tiruppur",
    state: "Tamil Nadu",
    pin: "641604",
    lat: 11.1085,
    lng: 77.3411,
    verification: "verified",
    rating: 4.8,
    reviewCount: 55,
    memberSince: "Nov 2022",
    about: "Knitted fabric mill generating cotton cutting waste and yarn waste every month.",
    documents: [
      { name: "Business Registration Certificate", status: "Verified" },
      { name: "GST / Business ID", status: "Verified" },
      { name: "Industry Authorization Certificate", status: "Verified" },
    ],
  },
  {
    id: "ind-4",
    name: "Nova Packaging Industries",
    email: "hello@novapack.in",
    phone: "+91 98404 22110",
    category: "Paper & Packaging",
    address: "89 Peenya 2nd Stage",
    city: "Bengaluru",
    state: "Karnataka",
    pin: "560058",
    lat: 12.9716,
    lng: 77.5946,
    verification: "verified",
    rating: 4.3,
    reviewCount: 26,
    memberSince: "Feb 2024",
    about: "Corrugated box plant. Sells OCC bales and buys recycled kraft material.",
    documents: [
      { name: "Business Registration Certificate", status: "Verified" },
      { name: "GST / Business ID", status: "Verified" },
      { name: "Industry Authorization Certificate", status: "Verified" },
    ],
  },
  {
    id: "ind-5",
    name: "Crystal Glass Works",
    email: "info@crystalglassworks.in",
    phone: "+91 98405 66332",
    category: "Glass Manufacturing",
    address: "Sipcot Phase 1, Hosur",
    city: "Hosur",
    state: "Tamil Nadu",
    pin: "635126",
    lat: 12.7409,
    lng: 77.8253,
    verification: "verified",
    rating: 4.1,
    reviewCount: 14,
    memberSince: "Sep 2024",
    about: "Container glass plant with continuous cullet surplus.",
    documents: [
      { name: "Business Registration Certificate", status: "Verified" },
      { name: "GST / Business ID", status: "Verified" },
      { name: "Industry Authorization Certificate", status: "Verified" },
    ],
  },
  {
    id: "ind-6",
    name: "GreenCircle E-Waste Recyclers",
    email: "admin@greencircle-ewaste.in",
    phone: "+91 98406 90011",
    category: "Electronics Recycling",
    address: "12 Perungudi Industrial Area",
    city: "Chennai",
    state: "Tamil Nadu",
    pin: "600096",
    lat: 13.033,
    lng: 80.22,
    verification: "pending",
    rating: 0,
    reviewCount: 0,
    memberSince: "Sep 2026",
    about: "Authorised e-waste dismantler handling sorted PCB and component scrap.",
    documents: [
      { name: "Business Registration Certificate", status: "Uploaded" },
      { name: "GST / Business ID", status: "Uploaded" },
      { name: "Industry Authorization Certificate", status: "Uploaded" },
    ],
  },
  {
    id: "ind-7",
    name: "Deccan Alloys & Metals",
    email: "trade@deccanalloys.in",
    phone: "+91 98407 44556",
    category: "Metal Processing",
    address: "Plot 61, Balanagar Industrial Area",
    city: "Hyderabad",
    state: "Telangana",
    pin: "500037",
    lat: 17.385,
    lng: 78.4867,
    verification: "verified",
    rating: 4.6,
    reviewCount: 37,
    memberSince: "Jun 2023",
    about: "Aluminium extrusion and alloy casting plant with regular process scrap.",
    documents: [
      { name: "Business Registration Certificate", status: "Verified" },
      { name: "GST / Business ID", status: "Verified" },
      { name: "Industry Authorization Certificate", status: "Verified" },
    ],
  },
  {
    id: "ind-8",
    name: "Vikram Industrial Surplus",
    email: "office@vikramsurplus.in",
    phone: "+91 98408 12345",
    category: "Industrial Surplus",
    address: "Gate 3, Bhosari MIDC",
    city: "Pune",
    state: "Maharashtra",
    pin: "411026",
    lat: 18.5204,
    lng: 73.8567,
    verification: "pending",
    rating: 0,
    reviewCount: 0,
    memberSince: "Sep 2026",
    about: "Dealer of unused industrial surplus stock, spares and packaging material.",
    documents: [
      { name: "Business Registration Certificate", status: "Uploaded" },
      { name: "GST / Business ID", status: "Uploaded" },
      { name: "Industry Authorization Certificate", status: "Uploaded" },
    ],
  },
];

export const MATERIALS: Material[] = [
  {
    id: "mat-1",
    name: "Scrap Copper Wire (Bare Bright)",
    category: "Metal",
    sellerId: "ind-1",
    image: copperWire,
    description:
      "Bare bright copper wire scrap from rod drawing line. No insulation, no oxidation, packed in coils on wooden pallets. Ready for immediate dispatch.",
    quantity: 12000,
    unit: "kg",
    condition: "Clean / Sorted",
    reusable: true,
    recyclable: true,
    specs: [
      { label: "Purity", value: "99.9% Cu" },
      { label: "Form", value: "Coiled wire, 2.6 mm" },
      { label: "Packing", value: "Palletised coils, 500 kg each" },
      { label: "Contamination", value: "Nil" },
    ],
    documents: [
      { name: "Material Test Report", status: "Verified" },
      { name: "Quality Certificate", status: "Verified" },
    ],
    pricePerUnit: 685,
    priceType: "Negotiable",
    minOrder: 500,
    address: "34 Ganapathy Industrial Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pin: "641006",
    lat: 11.0168,
    lng: 76.9558,
    listedOn: "18 Sep 2026",
    status: "Active",
  },
  {
    id: "mat-2",
    name: "HDPE Plastic Flakes (Natural)",
    category: "Plastic",
    sellerId: "ind-2",
    image: hdpeFlakes,
    description:
      "Hot-washed natural HDPE flakes from post-industrial drums and crates. Single source, consistent colour, low moisture.",
    quantity: 25000,
    unit: "kg",
    condition: "Clean / Sorted",
    reusable: true,
    recyclable: true,
    specs: [
      { label: "Melt Flow Index", value: "0.7 g/10min" },
      { label: "Flake size", value: "8-12 mm" },
      { label: "Moisture", value: "< 1%" },
      { label: "Packing", value: "1000 kg jumbo bags" },
    ],
    documents: [
      { name: "Quality Certificate", status: "Verified" },
      { name: "Lab Test Report", status: "Uploaded" },
    ],
    pricePerUnit: 62,
    priceType: "Fixed",
    minOrder: 1000,
    address: "Unit 7, Ambattur Industrial Estate",
    city: "Chennai",
    state: "Tamil Nadu",
    pin: "600058",
    lat: 13.0827,
    lng: 80.2707,
    listedOn: "16 Sep 2026",
    status: "Active",
  },
  {
    id: "mat-3",
    name: "Cotton Textile Waste Bales",
    category: "Textile",
    sellerId: "ind-3",
    image: cottonWaste,
    description:
      "Knitted cotton cutting waste in pressed bales. Mixed white and light shades, suitable for open-end spinning and wiping cloth manufacture.",
    quantity: 40,
    unit: "tonne",
    condition: "Mixed / Unsorted",
    reusable: true,
    recyclable: true,
    specs: [
      { label: "Composition", value: "95% cotton, 5% lycra" },
      { label: "Bale weight", value: "180 kg" },
      { label: "Shades", value: "White / pastel mix" },
      { label: "Moisture", value: "Dry storage" },
    ],
    documents: [{ name: "Quality Certificate", status: "Uploaded" }],
    pricePerUnit: 18500,
    priceType: "Negotiable",
    minOrder: 2,
    address: "SF 210, Palladam Road",
    city: "Tiruppur",
    state: "Tamil Nadu",
    pin: "641604",
    lat: 11.1085,
    lng: 77.3411,
    listedOn: "19 Sep 2026",
    status: "Active",
  },
  {
    id: "mat-4",
    name: "Corrugated Carton Bales (OCC)",
    category: "Paper",
    sellerId: "ind-4",
    image: cartonBales,
    description:
      "Old corrugated container bales from our box plant trim and rejects. Wire bound, dry, minimal foreign matter.",
    quantity: 60,
    unit: "tonne",
    condition: "Clean / Sorted",
    reusable: false,
    recyclable: true,
    specs: [
      { label: "Grade", value: "OCC 11" },
      { label: "Bale size", value: "1.1 x 0.8 x 0.9 m" },
      { label: "Outthrows", value: "< 2%" },
      { label: "Moisture", value: "< 12%" },
    ],
    documents: [{ name: "Quality Certificate", status: "Verified" }],
    pricePerUnit: 14200,
    priceType: "Fixed",
    minOrder: 5,
    address: "89 Peenya 2nd Stage",
    city: "Bengaluru",
    state: "Karnataka",
    pin: "560058",
    lat: 12.9716,
    lng: 77.5946,
    listedOn: "14 Sep 2026",
    status: "Active",
  },
  {
    id: "mat-5",
    name: "Mixed Glass Cullet (Clear & Green)",
    category: "Glass",
    sellerId: "ind-5",
    image: glassCullet,
    description:
      "Furnace-ready crushed cullet from container glass rejects. Separated clear and green lots available, metal and ceramic removed.",
    quantity: 80,
    unit: "tonne",
    condition: "Clean / Sorted",
    reusable: false,
    recyclable: true,
    specs: [
      { label: "Particle size", value: "5-25 mm" },
      { label: "Colour split", value: "60% clear / 40% green" },
      { label: "Ceramic content", value: "< 10 ppm" },
      { label: "Loading", value: "Loose in tipper" },
    ],
    documents: [{ name: "Lab Test Report", status: "Uploaded" }],
    pricePerUnit: 4800,
    priceType: "Negotiable",
    minOrder: 10,
    address: "Sipcot Phase 1, Hosur",
    city: "Hosur",
    state: "Tamil Nadu",
    pin: "635126",
    lat: 12.7409,
    lng: 77.8253,
    listedOn: "12 Sep 2026",
    status: "Active",
  },
  {
    id: "mat-6",
    name: "Sorted PCB / Circuit Board Scrap",
    category: "Electronic Waste",
    sellerId: "ind-6",
    image: ewasteBoards,
    description:
      "Depopulated motherboards and memory modules sorted by grade. Handled under authorised e-waste dismantling process.",
    quantity: 3500,
    unit: "kg",
    condition: "Clean / Sorted",
    reusable: false,
    recyclable: true,
    specs: [
      { label: "Grade", value: "Mid grade motherboards" },
      { label: "Sorting", value: "Category-wise crates" },
      { label: "Batteries", value: "Removed" },
      { label: "Packing", value: "Plastic crates, 40 kg" },
    ],
    documents: [{ name: "Authorisation Copy", status: "Uploaded" }],
    pricePerUnit: 410,
    priceType: "Negotiable",
    minOrder: 100,
    address: "12 Perungudi Industrial Area",
    city: "Chennai",
    state: "Tamil Nadu",
    pin: "600096",
    lat: 13.033,
    lng: 80.22,
    listedOn: "20 Sep 2026",
    status: "Active",
  },
  {
    id: "mat-7",
    name: "Aluminium Sheet Offcuts (5052)",
    category: "Metal",
    sellerId: "ind-0",
    image: aluminiumScrap,
    description:
      "Press shop offcuts of 5052 aluminium sheet, 1.2 to 3 mm thickness. Oil-free, single alloy, stacked on pallets.",
    quantity: 8000,
    unit: "kg",
    condition: "Surplus - Unused",
    reusable: true,
    recyclable: true,
    specs: [
      { label: "Alloy", value: "AA 5052 H32" },
      { label: "Thickness", value: "1.2 - 3.0 mm" },
      { label: "Coating", value: "Mill finish, no paint" },
      { label: "Packing", value: "Strapped pallets" },
    ],
    documents: [
      { name: "Material Test Report", status: "Verified" },
      { name: "Quality Certificate", status: "Uploaded" },
    ],
    pricePerUnit: 172,
    priceType: "Negotiable",
    minOrder: 250,
    address: "Plot 14, SIDCO Industrial Estate, Kurichi",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pin: "641021",
    lat: 10.9601,
    lng: 76.9629,
    listedOn: "17 Sep 2026",
    status: "Active",
  },
  {
    id: "mat-8",
    name: "Aluminium Extrusion Profiles (6063)",
    category: "Metal",
    sellerId: "ind-7",
    image: aluminiumScrap,
    description:
      "Mill-finish 6063 extrusion cut ends and rejected profiles from our press line. Uniform alloy, no paint or thermal break.",
    quantity: 15000,
    unit: "kg",
    condition: "Clean / Sorted",
    reusable: true,
    recyclable: true,
    specs: [
      { label: "Alloy", value: "AA 6063 T6" },
      { label: "Length", value: "0.3 - 1.5 m" },
      { label: "Surface", value: "Mill finish" },
      { label: "Packing", value: "Bundled" },
    ],
    documents: [{ name: "Material Test Report", status: "Verified" }],
    pricePerUnit: 198,
    priceType: "Fixed",
    minOrder: 500,
    address: "Plot 61, Balanagar Industrial Area",
    city: "Hyderabad",
    state: "Telangana",
    pin: "500037",
    lat: 17.385,
    lng: 78.4867,
    listedOn: "10 Sep 2026",
    status: "Active",
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2041",
    materialId: "mat-2",
    buyerId: "ind-0",
    sellerId: "ind-2",
    quantity: 5000,
    unit: "kg",
    proposedPrice: 60,
    status: "Requested",
    requirements: "Need moisture below 1%. Dispatch in two lots of 2500 kg.",
    timeline: [{ status: "Requested", at: "20 Sep 2026", note: "Request sent to seller" }],
  },
  {
    id: "TXN-2038",
    materialId: "mat-4",
    buyerId: "ind-0",
    sellerId: "ind-4",
    quantity: 10,
    unit: "tonne",
    proposedPrice: 14000,
    agreedPrice: 14200,
    status: "Agreed",
    requirements: "Wire bound bales only.",
    timeline: [
      { status: "Requested", at: "15 Sep 2026" },
      { status: "Agreed", at: "16 Sep 2026", note: "Agreed at listed price" },
    ],
  },
  {
    id: "TXN-2033",
    materialId: "mat-1",
    buyerId: "ind-0",
    sellerId: "ind-1",
    quantity: 1000,
    unit: "kg",
    proposedPrice: 680,
    agreedPrice: 682,
    status: "Delivered",
    timeline: [
      { status: "Requested", at: "8 Sep 2026" },
      { status: "Agreed", at: "9 Sep 2026" },
      { status: "Delivered", at: "17 Sep 2026", note: "Marked delivered by seller" },
    ],
  },
  {
    id: "TXN-2029",
    materialId: "mat-7",
    buyerId: "ind-3",
    sellerId: "ind-0",
    quantity: 1500,
    unit: "kg",
    proposedPrice: 168,
    agreedPrice: 170,
    status: "Agreed",
    requirements: "Please confirm alloy grade in writing.",
    timeline: [
      { status: "Requested", at: "12 Sep 2026" },
      { status: "Agreed", at: "13 Sep 2026" },
    ],
  },
  {
    id: "TXN-2025",
    materialId: "mat-3",
    buyerId: "ind-0",
    sellerId: "ind-3",
    quantity: 4,
    unit: "tonne",
    proposedPrice: 18000,
    agreedPrice: 18200,
    status: "Completed",
    rating: 5,
    review: "Consistent shades and accurate bale weights. Will buy again.",
    timeline: [
      { status: "Requested", at: "26 Aug 2026" },
      { status: "Agreed", at: "27 Aug 2026" },
      { status: "Delivered", at: "2 Sep 2026" },
      { status: "Inspection", at: "3 Sep 2026" },
      { status: "Completed", at: "3 Sep 2026", note: "Material accepted by buyer" },
    ],
  },
  {
    id: "TXN-2018",
    materialId: "mat-5",
    buyerId: "ind-4",
    sellerId: "ind-5",
    quantity: 15,
    unit: "tonne",
    proposedPrice: 4700,
    agreedPrice: 4750,
    status: "Problem Reported",
    timeline: [
      { status: "Requested", at: "18 Aug 2026" },
      { status: "Agreed", at: "19 Aug 2026" },
      { status: "Delivered", at: "28 Aug 2026" },
      { status: "Inspection", at: "29 Aug 2026" },
      { status: "Problem Reported", at: "29 Aug 2026", note: "Contamination reported by buyer" },
    ],
  },
];

export const DISPUTES: Dispute[] = [
  {
    id: "DSP-118",
    transactionId: "TXN-2018",
    problemType: "Contamination",
    description:
      "Roughly 2 tonnes of the delivered cullet contained ceramic pieces and metal caps. Furnace batch had to be stopped for manual sorting.",
    evidence: ["contamination-photo-1.jpg", "sorting-report.pdf"],
    sellerResponse:
      "Loading was from the approved bay. We are willing to discuss a partial settlement for the affected quantity.",
    status: "Open",
    raisedOn: "29 Aug 2026",
  },
];
