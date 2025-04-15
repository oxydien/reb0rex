import { Section } from "../data/sections";
import { JSX } from "preact/jsx-runtime";
import Card from "./Card";

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
    if (["hidden"].includes(section.type)) {
      return null;
    }

    if (section.type === "card") {
      return <Card section={section} section_id={index + 1} scroll={scroll} />;
    }

    return null;
  };

  return (
    <div>{sections.map((section, index) => parseSection(section, index))}</div>
  );
}
