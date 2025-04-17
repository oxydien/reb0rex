import { Section } from "../data/sections";
import { JSX } from "preact/jsx-runtime";
import Card from "./Card";
import KofiPropagation from "./KofiPropagation";

export default function Supplier({
  sections,
  scroll,
}: {
  sections: Section[];
  scroll: number;
}) {
  const parseSection = (
    section: Section,
    index: number,
  ): JSX.Element | undefined => {
    if (section.type === "card") {
      return <Card section={section} section_id={index + 1} scroll={scroll} />;
    } else if (section.type === "kofi") {
      return <KofiPropagation section_id={index + 1} scroll={scroll} />;
    }

    return <div className={"empty"}></div>;
  };

  return (
    <div>{sections.map((section, index) => parseSection(section, index))}</div>
  );
}
