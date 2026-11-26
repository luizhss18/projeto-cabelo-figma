import { AppProvider, useRoute } from "./lib/store";
import { Footer, Header } from "./components/Shell";
import Landing from "./pages/Landing";
import Simulator from "./pages/Simulator";
import Face from "./pages/Face";
import Explore from "./pages/Explore";
import Care from "./pages/Care";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Pro from "./pages/Pro";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import System from "./pages/System";
import About from "./pages/About";

function Router() {
  const r = useRoute();
  const page = (() => {
    switch (r) {
      case "simulador": return <Simulator />;
      case "rosto": return <Face />;
      case "estilos": return <Explore />;
      case "cuidados": return <Care />;
      case "perfil": return <Profile />;
      case "entrar": return <Auth mode="entrar" />;
      case "cadastro": return <Auth mode="cadastro" />;
      case "recuperar": return <Auth mode="recuperar" />;
      case "profissionais": return <Pro />;
      case "contato": return <Contact />;
      case "dashboard": return <Dashboard />;
      case "comparar": return <Compare />;
      case "sistema": return <System />;
      case "sobre": return <About />;
      default: return <Landing />;
    }
  })();
  const fullscreen = r === "simulador" || r === "entrar" || r === "cadastro" || r === "recuperar";
  return (
    <div className="min-h-screen bg-white">
      <Header route={r} dark={r === "inicio" || r === "profissionais"} />
      <main key={r}>{page}</main>
      {!fullscreen && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
