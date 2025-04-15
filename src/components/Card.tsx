import { Section } from "../data/sections";
import { useEffect, useState } from "preact/hooks";
import {
  getGlobalPercentagePerSection,
  getLocalSectionPercentage,
} from "../utils/section";
import GlitchedText from "./GlitchedText";
import { t } from "../lang/lang";

export default function ({
  section,
  section_id,
  scroll,
}: {
  section: Section;
  section_id: number;
  scroll: number;
}) {
  const [position, setPosition] = useState("100vh"); // Start off-screen at bottom
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const localPercentage = getLocalSectionPercentage(section_id, scroll);

    if (localPercentage <= 30) {
      setOpacity((localPercentage * 3.4) / 100);
    } else if (localPercentage >= 60) {
      setOpacity(((100 - localPercentage) * 3.4) / 100);
    } else {
      setOpacity(1);
    }

    if (localPercentage <= 30) {
      const progress = localPercentage / 30;
      const startPosition = 100;
      const centerPosition = 50;

      const calculatedPosition =
        startPosition - progress * (startPosition - centerPosition);
      setPosition(`${calculatedPosition}vh`);
    } else if (localPercentage >= 60) {
      const progress = (localPercentage - 60) / 40;
      const centerPosition = 50;
      const endPosition = 0;

      const calculatedPosition =
        centerPosition - progress * (centerPosition - endPosition);
      setPosition(`${calculatedPosition}vh`);
    } else {
      setPosition("50vh");
    }
  }, [scroll]);

  return (
    <div
      className={`card card-${section.detail || "right"}`}
      style={{
        position: "fixed",
        top: position,
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: opacity,
        zIndex: 15 - section_id,
      }}
    >
      <div className="card-details">
        <h3 className="card-title">
          <GlitchedText text={section.title} speed={200} percentage={opacity} />
        </h3>
        <span className="part-name">{section.part}</span>
        <p className="card-description">
          {t(section.translation || "error.notrans")}
        </p>
      </div>
      <div className="class-image">{/* TODO: Add image*/}</div>
    </div>
  );
}
