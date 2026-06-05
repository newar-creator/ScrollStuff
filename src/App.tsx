import ScrollVideo from "./ScrollVideo";
import PillNav from "./PillNav";
import ScrollFloat from "./ScrollFloat";
import GlassPanel from "./GlassPanel";

export default function App() {
  return (
    <>
      <ScrollVideo src="https://stream.mux.com/43NlHXsaMrmyzWamMk87m01fNyxSTekAD669BBAPBNm00.m3u8" />
      <PillNav />
      <div style={{ position: "relative", height: "500vh" }}>
        <ScrollFloat>{`Unleash The\nFull Power`}</ScrollFloat>
        <GlassPanel />
      </div>
    </>
  );
}
