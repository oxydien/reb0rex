import { t } from "../lang/lang";
import { getLocalSectionPercentage } from "../utils/section";
import { useState, useEffect } from "preact/hooks";
import { getKofiWidget } from "../assets/kofi-widget.js";
import GlitchedText from "./GlitchedText";

export default function KofiPropagation({
  scroll,
  section_id,
}: {
  scroll: number;
  section_id: number;
}) {
  const [opacity, setOpacity] = useState(0);

  const PROGRESS = 100;

  useEffect(() => {
    const localPercentage = getLocalSectionPercentage(section_id, scroll);

    if (localPercentage < 30) {
      setOpacity((localPercentage * 3.4) / 100);
    } else if (localPercentage > 60) {
      setOpacity(((100 - localPercentage) * 3.4) / 100);
    } else {
      setOpacity(1);
    }
  }, [scroll]);

  const selectable = (): string => {
    return opacity === 1 ? "inherit" : "none";
  };

  const kofiWidget = (): string => {
    return getKofiWidget(t("section.kofi.button"), "#030303", "oxydien") || "";
  };

  return (
    <div
      className={"kofi-propagation"}
      style={{
        opacity: opacity,
        userSelect: selectable(),
        WebkitUserSelect: selectable(),
        msUserSelect: selectable(),
        pointerEvents: selectable(),
      }}
    >
      <h3 className="kofi-title">
        <GlitchedText
          text={t("section.kofi.title")}
          speed={200}
          percentage={opacity}
        />
      </h3>
      <strong className="kofi-amount">
        <GlitchedText
          text={t("section.kofi.amount")}
          speed={200}
          percentage={opacity}
        />
      </strong>
      <p className="kofi-description">{t("section.kofi.description")}</p>
      <div className={"kofi-progress"}>
        <div
          className={"kofi-progress-bar"}
          style={{ width: `${PROGRESS}%` }}
        ></div>
      </div>
      <div
        className={"kofi-propagation-button"}
        dangerouslySetInnerHTML={{ __html: kofiWidget() }}
      ></div>
    </div>
  );
}
