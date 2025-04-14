import {calculateViewDistance} from "../utils/view";
import {Vector3KeyframeValue} from "../components/renderer";


export type PartKeyframes = {
    position: Vector3Keyframe,
    opacity: number
}
export type Vector3Keyframe = {
    value: Vector3KeyframeValue;
    easing?: (t: number) => number;
};

export type CameraKeyframes = {
    position: Vector3Keyframe;
    target: Vector3Keyframe;
};

export interface Section {
    title: string;
    type: "hidden" | "card" | "sticky" | "title";
    part?: string,
    translation?: string,
    keyframes: Record<string, PartKeyframes>;
    camera: CameraKeyframes;
}

const vec = (x: number,y: number,z: number): Vector3KeyframeValue => {
    return {x,y,z}
}

export const SECTIONS = (windowWidth: number, windowHeight: number): Section[] => {
    const offsetX = 0.4;
    const offsetZ = calculateViewDistance(75, windowWidth, windowHeight, {width: 1.2, height: 1, depth: 0.3});
    
    const opacityBackground = 0.05;

    return [
        {
            title: "Landing",
            type: "title",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: 1},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: 1},
                ram: { position: {value: vec(0, 0, 0)}, opacity: 1},
                psu: { position: {value: vec(0, 0, 0)}, opacity: 1},
                io: { position: {value: vec(0, 0, 0)}, opacity: 1},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: 1},
            },
            camera: {
                position: {value: vec(offsetX, 0, offsetZ + 0.8)},
                target: {value: vec(offsetX, 0, 0)},
            }
        },
        {
            title: "Showcase",
            type: "sticky",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: 1},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: 1},
                ram: { position: {value: vec(0, 0, 0)}, opacity: 1},
                psu: { position: {value: vec(0, 0, 0)}, opacity: 1},
                io: { position: {value: vec(0, 0, 0)}, opacity: 1},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: 1},
            },
            camera: {
                position: {value: vec(offsetX - 0.3, 0.4, -(offsetZ + 1.4))},
                target: {value: vec(offsetX, 0, 0)},
            }
        },
        {
            title: "CPU",
            type: "card",
            part: "AMD Ryzen 5 7600",
            translation: "section.card.cpu",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                cpu: { position: {value: vec(0, 0, 2)}, opacity: 1},
                ram: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                io: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                psu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
            },
            camera: {
                position: {value: vec(offsetX - 0.6, 0.12, offsetZ + 2.1)},
                target: {value: vec(offsetX, 0.12, 2)},
            }
        },
        {
            title: "GPU",
            type: "card",
            part: "AMD Ryzen 5 7600",
            translation: "section.card.cpu",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 2)}, opacity: 1},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                ram: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                io: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                psu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
            },
            camera: {
                position: {value: vec(offsetX + 0.8, -0.6, offsetZ + 1.9)},
                target: {value: vec(0, 0, 1.6)},
            }
        },
        {
            title: "RAM",
            type: "card",
            part: "2x 16GB DDR5",
            translation: "section.card.ram",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                ram: { position: {value: vec(-1.5, 0, 1.5)}, opacity: 1},
                io: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                psu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
            },
            camera: {
                position: {value: vec(offsetX - 2.2, 0.1, 1.9)},
                target: {value: vec(-1.5, 0.1, 1.6)},
            }
        },
        {
            title: "Power Supply",
            type: "card",
            part: "MSI MAG A750GL PCIE5 750 W 80+ Gold",
            translation: "section.card.psu",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                ram: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                io: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                psu: { position: {value: vec(-1, 0, 2)}, opacity: 1},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
            },
            camera: {
                position: {value: vec(offsetX - 1.3, 1.2, offsetZ + 2.3)},
                target: {value: vec(0.6, -0.4, 2)},
            }
        },
        {
            title: "Mother board",
            type: "card",
            part: "Gigabyte B650M D3HP",
            translation: "section.card.mb",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                ram: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                io: { position: {value: vec(0, 0, -2)}, opacity: 1},
                psu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                motherboard: { position: {value: vec(0, 0, -2)}, opacity: 1},
            },
            camera: {
                position: {value: vec(offsetX + 0.5, 0, offsetZ - 1.3)},
                target: {value: vec(0.5, 0, -2.5)},
            }
        },
        {
            title: "Status",
            type: "hidden",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                ram: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                io: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                psu: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: opacityBackground},
            },
            camera: {
                position: {value: vec(offsetX, 0, offsetZ)},
                target: {value: vec(0, 0, 0)},
            }
        },
        {
            title: "Footer",
            type: "hidden",
            keyframes: {
                gpu: { position: {value: vec(0, 0, 0)}, opacity: 0.6},
                cpu: { position: {value: vec(0, 0, 0)}, opacity: 0.6},
                ram: { position: {value: vec(0, 0, 0)}, opacity: 0.6},
                io: { position: {value: vec(0, 0, 0)}, opacity: 0.6},
                psu: { position: {value: vec(0, 0, 0)}, opacity: 0.6},
                motherboard: { position: {value: vec(0, 0, 0)}, opacity: 0.6},
            },
            camera: {
                position: {value: vec(offsetX, 0, offsetZ + 0.6)},
                target: {value: vec(offsetX, 0, 0)},
            }
        }
    ];
}