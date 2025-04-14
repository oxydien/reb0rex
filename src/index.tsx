import { render } from "preact";
import ModelRenderer, {ModelKeyframes, CameraKeyframes} from "./components/renderer";
import { easingFunctions } from "./components/renderer";
import "./assets/tailwind.js";
import "./style.css";
import { useEffect, useState } from "preact/hooks";
import Title from "./components/Title";
import {Section, SECTIONS} from "./data/sections";
import {getGlobalPercentagePerSection, getSectionPercentage} from "./utils/section";

export function App() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [partKeys, setPartKeys] = useState<Record<string, ModelKeyframes>>({});
  const [cameraKeys, setCameraKeys] = useState<CameraKeyframes>({});
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage =
        (scrollTop / (scrollHeight - window.innerHeight)) * 100;
      setScrollPercentage(scrollPercentage);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const data = SECTIONS(width, height);
      parseSections(data);
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []);

  const parseSections = (data: Section[]) => {
    const modelKeyframes: Record<string, ModelKeyframes> = {};
    const cameraKeyframes: CameraKeyframes = {position:[], target: []};

    console.debug("RAW", data);

    for (let i = 1; i <= data.length; i++) {
      const section = data[i-1];
      const startPercentage = getSectionPercentage(i);
      const endPercentage = startPercentage + getGlobalPercentagePerSection(10);

      // Part keyframes
      for (const key of Object.keys(section.keyframes)) {
        const frame = section.keyframes[key];
        const positionFrame = frame.position;
        const opacityFrame = frame.opacity;

        if (modelKeyframes[key] == null) {
            modelKeyframes[key] = {position: [], opacity: []};
        }

        modelKeyframes[key].position.push({
          percentage: startPercentage,
          value: positionFrame.value,
          easing: positionFrame.easing || easingFunctions.easeInOut
        });

        modelKeyframes[key].opacity.push({
          percentage: startPercentage,
          value: opacityFrame,
          easing: easingFunctions.easeInOut
        });

        if (!["sticky", "title"].includes(section.type)) {
          modelKeyframes[key].opacity.push({
            percentage: endPercentage,
            value: opacityFrame,
            easing: easingFunctions.easeInOut
          });
          modelKeyframes[key].position.push({
            percentage: endPercentage,
            value: positionFrame.value,
            easing: positionFrame.easing || easingFunctions.easeInOut
          });
        }
      }

      // Camera keyframes
      const cameraPos = section.camera.position;
      const cameraTarget = section.camera.target;

      cameraKeyframes.position.push({
        percentage: startPercentage,
        value: cameraPos.value,
        easing: cameraPos.easing || easingFunctions.easeInOut
      });

      cameraKeyframes.target.push({
        percentage: startPercentage,
        value: cameraTarget.value,
        easing: cameraTarget.easing || easingFunctions.easeInOut
      });

      if (!["sticky", "title"].includes(section.type)) {
        cameraKeyframes.position.push({
          percentage: endPercentage,
          value: cameraPos.value,
          easing: cameraPos.easing || easingFunctions.easeInOut
        });
        cameraKeyframes.target.push({
          percentage: endPercentage,
          value: cameraTarget.value,
          easing: cameraTarget.easing || easingFunctions.easeInOut
        });
      }
    }

    console.debug("NEW", cameraKeyframes, modelKeyframes)

    setCameraKeys(cameraKeyframes);
    setPartKeys(modelKeyframes);
  }

  return (
    <div className={modelLoaded ? "model_show" : "model_hidden"}>
      <Title percentage={scrollPercentage}/>

      <ModelRenderer
        percentage={scrollPercentage}
        modelKeyframes={partKeys}
        cameraKeyframes={cameraKeys}
        onLoad={() => setModelLoaded(true)}
      />
    </div>
  );
}

render(<App />, document.getElementById("mount"));
