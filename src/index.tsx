import { render } from "preact";
import ModelRenderer from "./components/renderer";
import * as THREE from "three";
import { easingFunctions } from "./components/renderer";
import "./assets/tailwind.js";
import "./style.css";
import { useEffect, useState } from "preact/hooks";

export function App() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

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

  return (
    <div>
      <p
        style={
          "text-align: center;margin-top:12rem;font-size:6rem;font-weight:900;z-index: 5;color:#FFFFFF;mix-blend-mode:difference"
        }
      >
        REB0REX
      </p>
      <ModelRenderer
        percentage={scrollPercentage}
        modelKeyframes={{
          gpu: {
            position: [
              { percentage: 0, value: new THREE.Vector3(0, 0, 0) },
              {
                percentage: 50,
                value: new THREE.Vector3(0, 0, 2),
                easing: easingFunctions.easeInOut,
              },
              { percentage: 100, value: new THREE.Vector3(0, 0, 0) },
            ],
            opacity: [
              { percentage: 0, value: 0 },
              { percentage: 25, value: 1, easing: easingFunctions.easeIn },
              { percentage: 75, value: 1 },
              { percentage: 100, value: 0, easing: easingFunctions.easeOut },
            ],
          },
        }}
        cameraKeyframes={{
          position: [
            { percentage: 0, value: new THREE.Vector3(1, 0, 3) },
            {
              percentage: 50,
              value: new THREE.Vector3(2, 1, 3),
              easing: easingFunctions.easeInOut,
            },
            { percentage: 100, value: new THREE.Vector3(1, 0, 3) },
          ],
          target: [
            { percentage: 0, value: new THREE.Vector3(0, 0, 0) },
            { percentage: 50, value: new THREE.Vector3(0, 0, 2) },
            { percentage: 100, value: new THREE.Vector3(0, 2, 0) },
          ],
        }}
      />
    </div>
  );
}

render(<App />, document.getElementById("mount"));
