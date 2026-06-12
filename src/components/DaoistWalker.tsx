import taoistMaster from "../assets/taoist_master_keyed.png";

function DaoistLayerGroup() {
  return (
    <div className="daoist-layer-group">
      <img className="daoist-layer daoist-hat" src={taoistMaster} alt="" />
      <img className="daoist-layer daoist-body-layer" src={taoistMaster} alt="" />
      <img className="daoist-layer daoist-hem" src={taoistMaster} alt="" />
      <img className="daoist-layer daoist-hem-flap left" src={taoistMaster} alt="" />
      <img className="daoist-layer daoist-hem-flap right" src={taoistMaster} alt="" />
      <img className="daoist-layer daoist-step left" src={taoistMaster} alt="" />
      <img className="daoist-layer daoist-step right" src={taoistMaster} alt="" />
      <div className="daoist-ribbons" aria-hidden="true">
        <img className="daoist-layer daoist-ribbon left" src={taoistMaster} alt="" />
        <img className="daoist-layer daoist-ribbon right" src={taoistMaster} alt="" />
      </div>
    </div>
  );
}

export function DaoistWalker() {
  return (
    <div className="daoist-stage pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <div className="daoist-track">
        <div className="daoist-soft-shadow" />
        <div className="daoist-figure">
          <DaoistLayerGroup />
        </div>
        <div className="daoist-reflection">
          <DaoistLayerGroup />
        </div>
      </div>
    </div>
  );
}
