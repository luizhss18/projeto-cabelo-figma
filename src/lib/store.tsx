import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Hair } from "./head";
import { DEFAULT_HAIR, SEED_LOOKS, type Look } from "./data";

export const parseRoute = () => window.location.hash.replace(/^#\/?/, "").split("?")[0] || "inicio";
export const go = (r: string) => {
  window.location.hash = "/" + r;
  window.scrollTo({ top: 0 });
};
export function useRoute() {
  const [r, setR] = useState(parseRoute);
  useEffect(() => {
    const f = () => setR(parseRoute());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return r;
}

type Ctx = {
  user: { name: string; email: string } | null;
  login: (name?: string, email?: string) => void;
  logout: () => void;
  hair: Hair;
  setHair: (h: Hair | ((p: Hair) => Hair)) => void;
  looks: Look[];
  saveLook: (name: string) => void;
  compare: [Hair, Hair];
  setCompare: (c: [Hair, Hair]) => void;
};
const C = createContext<Ctx>(null as never);
export const useApp = () => useContext(C);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Ctx["user"]>(null);
  const [hair, setHair] = useState<Hair>(DEFAULT_HAIR);
  const [looks, setLooks] = useState<Look[]>(SEED_LOOKS);
  const [compare, setCompare] = useState<[Hair, Hair]>([
    { ...DEFAULT_HAIR },
    { cut: "curto", length: 1, color: "#d9b36c", texture: "liso", style: "franja", face: "oval" },
  ]);
  return (
    <C.Provider
      value={{
        user,
        login: (name = "Marina", email = "marina@email.com") => setUser({ name, email }),
        logout: () => setUser(null),
        hair,
        setHair,
        looks,
        saveLook: (name) => setLooks((l) => [{ id: String(Date.now()), name, date: "Agora", hair }, ...l]),
        compare,
        setCompare,
      }}
    >
      {children}
    </C.Provider>
  );
}
