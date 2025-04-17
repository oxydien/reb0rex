// Props: This part of the site was "vibe-coded" with claude Sonnet 3.7
// Yes I know, vibe coding is bad, but this project wouldn't be possible without it
// and I have learned a lot from it. ONLY THIS FILE IS VIBE-CODED (thanks for understanding)

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useEffect, useRef, useState } from "react";

export interface Vector3KeyframeValue {
  x: number;
  y: number;
  z: number;
}

interface Vector3Keyframe {
  percentage: number;
  value: Vector3KeyframeValue;
  easing?: (t: number) => number;
}

interface OpacityKeyframe {
  percentage: number;
  value: number;
  easing?: (t: number) => number;
}

export interface ModelKeyframes {
  position?: Vector3Keyframe[];
  opacity?: OpacityKeyframe[];
}

export interface CameraKeyframes {
  position?: Vector3Keyframe[];
  target?: Vector3Keyframe[];
}

interface ComputerPartsViewerProps {
  percentage?: number;
  modelKeyframes?: Record<string, ModelKeyframes>;
  cameraKeyframes?: CameraKeyframes;
  onLoad?: () => void;
  onError?: () => void;
}

export const easingFunctions = {
  linear: (t: number) => t,
  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
};

export default function ComputerPartsViewer({
  percentage = 0,
  modelKeyframes = {},
  cameraKeyframes = {},
  onLoad = () => {},
  onError = () => {},
}: ComputerPartsViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelsRef = useRef<Record<string, THREE.Group>>({});
  const originalPositionsRef = useRef<Record<string, THREE.Vector3>>({});
  const originalMaterialsRef = useRef<
    Record<string, THREE.Material | THREE.Material[]>
  >({});

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const createVector3 = (value: Vector3KeyframeValue): THREE.Vector3 => {
    return new THREE.Vector3(value.x, value.y, value.z);
  };

  const interpolateVector3 = (
    keyframes: Vector3Keyframe[],
    percentage: number,
  ): THREE.Vector3 => {
    if (keyframes.length === 0) return new THREE.Vector3();
    if (keyframes.length === 1) return createVector3(keyframes[0].value);

    if (percentage <= keyframes[0].percentage)
      return createVector3(keyframes[0].value);
    if (percentage >= keyframes[keyframes.length - 1].percentage) {
      return createVector3(keyframes[keyframes.length - 1].value);
    }

    let startFrame = keyframes[0];
    let endFrame = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (
        percentage >= keyframes[i].percentage &&
        percentage <= keyframes[i + 1].percentage
      ) {
        startFrame = keyframes[i];
        endFrame = keyframes[i + 1];
        break;
      }
    }

    const segmentPercentage =
      (percentage - startFrame.percentage) /
      (endFrame.percentage - startFrame.percentage);

    const easingFn = endFrame.easing || easingFunctions.linear;
    const t = easingFn(segmentPercentage);

    const start = createVector3(startFrame.value);
    const end = createVector3(endFrame.value);

    return new THREE.Vector3().lerpVectors(start, end, t);
  };

  const interpolateOpacity = (
    keyframes: OpacityKeyframe[],
    percentage: number,
  ): number => {
    if (keyframes.length === 0) return 1;
    if (keyframes.length === 1) return keyframes[0].value;

    if (percentage <= keyframes[0].percentage) return keyframes[0].value;
    if (percentage >= keyframes[keyframes.length - 1].percentage) {
      return keyframes[keyframes.length - 1].value;
    }

    let startFrame = keyframes[0];
    let endFrame = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (
        percentage >= keyframes[i].percentage &&
        percentage <= keyframes[i + 1].percentage
      ) {
        startFrame = keyframes[i];
        endFrame = keyframes[i + 1];
        break;
      }
    }

    const segmentPercentage =
      (percentage - startFrame.percentage) /
      (endFrame.percentage - startFrame.percentage);

    const easingFn = endFrame.easing || easingFunctions.linear;
    const t = easingFn(segmentPercentage);

    return startFrame.value + (endFrame.value - startFrame.value) * t;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131313);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 2);
    scene.add(directionalLight);

    const models = [
      { name: "motherboard", path: "/reborex_mb.glb" },
      { name: "ram", path: "/reborex_ram.glb" },
      { name: "psu", path: "/reborex_psu.glb" },
      { name: "gpu", path: "/reborex_gpu.glb" },
      { name: "cpu", path: "/reborex_cpu.glb" },
      { name: "io", path: "/reborex_io.glb" },
      //      { path: "" },
    ];

    let loadedCount = 0;
    const totalModels = models.length;

    models.forEach((model) => {
      const loader = new GLTFLoader();
      loader.load(
        model.path,
        (gltf) => {
          modelsRef.current[model.name] = gltf.scene;

          gltf.scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              if (!originalMaterialsRef.current[model.name]) {
                originalMaterialsRef.current[model.name] =
                  node.material.clone();
              }

              node.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 1,
              });
            }
          });

          scene.add(gltf.scene);
          originalPositionsRef.current[model.name] =
            gltf.scene.position.clone();

          loadedCount++;
          setLoadingProgress((loadedCount / totalModels) * 100);

          if (loadedCount === totalModels) {
            setIsLoading(false);

            const allObjects = Object.values(modelsRef.current);
            if (allObjects.length > 0) {
              const box = new THREE.Box3();

              allObjects.forEach((obj) => {
                box.expandByObject(obj);
              });

              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());

              const maxDim = Math.max(size.x, size.y, size.z);
              const fov = camera.fov * (Math.PI / 180);
              let cameraDistance = maxDim / (2 * Math.tan(fov / 2));

              cameraDistance *= 1.5;

              camera.position.set(
                center.x,
                center.y,
                center.z + cameraDistance,
              );
              camera.lookAt(center);
              controls.target.copy(center);
              controls.update();
            }

            onLoad();
          }
        },
        (xhr) => {
          console.log(
            `${model.name}: ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`,
          );
        },
        (err) => {
          console.error(`Error loading ${model.name}:`, err);
          setError(`Failed to load ${model.name}`);
          setIsLoading(false);
          onError();
        },
      );
    });

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight || 400;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current)
        return;

      requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      Object.values(modelsRef.current).forEach((model) => {
        scene.remove(model);
        model.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach((mat) => mat.dispose());
              } else {
                obj.material.dispose();
              }
            }
          }
        });
      });
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    Object.entries(modelKeyframes).forEach(([modelName, keyframes]) => {
      const model = modelsRef.current[modelName];
      if (!model) return;

      if (keyframes.position && keyframes.position.length > 0) {
        const newPosition = interpolateVector3(keyframes.position, percentage);
        model.position.copy(newPosition);
      }

      if (keyframes.opacity && keyframes.opacity.length > 0) {
        const newOpacity = interpolateOpacity(keyframes.opacity, percentage);
        model.traverse((node) => {
          if (node instanceof THREE.Mesh && node.material) {
            if (Array.isArray(node.material)) {
              node.material.forEach((mat) => {
                if (mat.transparent !== true && newOpacity < 1) {
                  mat.transparent = true;
                }
                mat.opacity = newOpacity;
              });
            } else {
              if (node.material.transparent !== true && newOpacity < 1) {
                node.material.transparent = true;
              }
              node.material.opacity = newOpacity;
            }
          }
        });
      }
    });

    if (cameraRef.current && controlsRef.current) {
      if (cameraKeyframes.position && cameraKeyframes.position.length > 0) {
        const newPosition = interpolateVector3(
          cameraKeyframes.position,
          percentage,
        );
        cameraRef.current.position.copy(newPosition);
      }

      if (cameraKeyframes.target && cameraKeyframes.target.length > 0) {
        const newTarget = interpolateVector3(
          cameraKeyframes.target,
          percentage,
        );
        controlsRef.current.target.copy(newTarget);
        controlsRef.current.update();
      }
    }
  }, [percentage, modelKeyframes, cameraKeyframes, isLoading]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white">
          <div className="mb-2">
            Loading models: {Math.round(loadingProgress)}%
          </div>
          <div className="w-64 h-2 bg-gray-600 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-800 bg-opacity-20 text-red-100">
          {error}
        </div>
      )}

      <div ref={containerRef} className="w-full h-full model_renderer" />
    </div>
  );
}
