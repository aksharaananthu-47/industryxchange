import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  DEMO_INDUSTRY_ID,
  DISPUTES,
  INDUSTRIES,
  MATERIALS,
  TRANSACTIONS,
  type Dispute,
  type Industry,
  type Material,
  type ProblemType,
  type Resolution,
  type Transaction,
  type TxStatus,
  type VerificationStatus,
} from "./mock-data";

export type Session =
  | { kind: "guest" }
  | { kind: "industry"; industryId: string }
  | { kind: "admin" };

const TODAY = "21 Sep 2026";

type Ctx = {
  session: Session;
  industries: Industry[];
  materials: Material[];
  transactions: Transaction[];
  disputes: Dispute[];
  currentIndustry: Industry | undefined;
  signInIndustry: (id?: string) => void;
  signInAdmin: () => void;
  signOut: () => void;
  getIndustry: (id: string) => Industry | undefined;
  getMaterial: (id: string) => Material | undefined;
  setVerification: (id: string, status: VerificationStatus, note?: string) => void;
  registerIndustry: (data: Omit<Industry, "id" | "verification" | "rating" | "reviewCount" | "memberSince">) => string;
  addMaterial: (data: Omit<Material, "id" | "listedOn" | "status">) => string;
  setMaterialStatus: (id: string, status: Material["status"]) => void;
  createRequest: (input: {
    materialId: string;
    quantity: number;
    price: number;
    requirements?: string;
  }) => string;
  advance: (txId: string, status: TxStatus, note?: string) => void;
  counterOffer: (txId: string, price: number, note: string) => void;
  acceptMaterial: (txId: string, rating: number, review: string) => void;
  reportProblem: (input: {
    txId: string;
    problemType: ProblemType;
    description: string;
    evidence: string[];
  }) => void;
  resolveDispute: (id: string, resolution: Resolution, note: string) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({
    kind: "industry",
    industryId: DEMO_INDUSTRY_ID,
  });
  const [industries, setIndustries] = useState<Industry[]>(INDUSTRIES);
  const [materials, setMaterials] = useState<Material[]>(MATERIALS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [disputes, setDisputes] = useState<Dispute[]>(DISPUTES);

  const value = useMemo<Ctx>(() => {
    const getIndustry = (id: string) => industries.find((i) => i.id === id);
    const getMaterial = (id: string) => materials.find((m) => m.id === id);
    const currentIndustry =
      session.kind === "industry" ? getIndustry(session.industryId) : undefined;

    const pushTimeline = (tx: Transaction, status: TxStatus, note?: string): Transaction => ({
      ...tx,
      status,
      timeline: [...tx.timeline, { status, at: TODAY, ...(note ? { note } : {}) }],
    });

    return {
      session,
      industries,
      materials,
      transactions,
      disputes,
      currentIndustry,
      getIndustry,
      getMaterial,
      signInIndustry: (id = DEMO_INDUSTRY_ID) =>
        setSession({ kind: "industry", industryId: id }),
      signInAdmin: () => setSession({ kind: "admin" }),
      signOut: () => setSession({ kind: "guest" }),
      setVerification: (id, status, note) =>
        setIndustries((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  verification: status,
                  ...(note ? { reviewNote: note } : {}),
                  documents: i.documents.map((d) => ({
                    ...d,
                    status: status === "verified" ? "Verified" : d.status,
                  })),
                }
              : i,
          ),
        ),
      registerIndustry: (data) => {
        const id = `ind-${Math.random().toString(36).slice(2, 7)}`;
        setIndustries((prev) => [
          ...prev,
          {
            ...data,
            id,
            verification: "pending",
            rating: 0,
            reviewCount: 0,
            memberSince: "Sep 2026",
          },
        ]);
        setSession({ kind: "industry", industryId: id });
        return id;
      },
      addMaterial: (data) => {
        const id = `mat-${Math.random().toString(36).slice(2, 7)}`;
        setMaterials((prev) => [{ ...data, id, listedOn: TODAY, status: "Active" }, ...prev]);
        return id;
      },
      setMaterialStatus: (id, status) =>
        setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m))),
      createRequest: ({ materialId, quantity, price, requirements }) => {
        const material = getMaterial(materialId);
        const buyerId = session.kind === "industry" ? session.industryId : DEMO_INDUSTRY_ID;
        const id = `TXN-${Math.floor(3000 + Math.random() * 900)}`;
        if (!material) return id;
        setTransactions((prev) => [
          {
            id,
            materialId,
            buyerId,
            sellerId: material.sellerId,
            quantity,
            unit: material.unit,
            proposedPrice: price,
            ...(requirements ? { requirements } : {}),
            status: "Requested" as TxStatus,
            timeline: [{ status: "Requested", at: TODAY, note: "Request sent to seller" }],
          },
          ...prev,
        ]);
        return id;
      },
      advance: (txId, status, note) =>
        setTransactions((prev) =>
          prev.map((tx) => {
            if (tx.id !== txId) return tx;
            const next = pushTimeline(tx, status, note);
            if (status === "Agreed") next.agreedPrice = tx.counterOffer?.price ?? tx.proposedPrice;
            return next;
          }),
        ),
      counterOffer: (txId, price, note) =>
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === txId
              ? {
                  ...pushTimeline(tx, "Requested", `Seller countered at ${price}`),
                  counterOffer: { price, note },
                }
              : tx,
          ),
        ),
      acceptMaterial: (txId, rating, review) =>
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === txId
              ? {
                  ...pushTimeline(tx, "Completed", "Material accepted by buyer"),
                  rating,
                  review,
                }
              : tx,
          ),
        ),
      reportProblem: ({ txId, problemType, description, evidence }) => {
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === txId
              ? pushTimeline(tx, "Problem Reported", `${problemType} reported by buyer`)
              : tx,
          ),
        );
        setDisputes((prev) => [
          {
            id: `DSP-${Math.floor(120 + Math.random() * 80)}`,
            transactionId: txId,
            problemType,
            description,
            evidence,
            status: "Open",
            raisedOn: TODAY,
          },
          ...prev,
        ]);
      },
      resolveDispute: (id, resolution, note) => {
        setDisputes((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, status: "Resolved", resolution, resolutionNote: note }
              : d,
          ),
        );
      },
    };
  }, [session, industries, materials, transactions, disputes]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
