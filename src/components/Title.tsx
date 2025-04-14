import {useEffect, useState} from "preact/hooks";
import {getLocalSectionPercentage} from "../utils/section";
import GlitchedText from "./GlitchedText";

export default function Title({percentage}: {percentage: number}) {
    const text = "REB0REX";
    const [titlePercentage, setTitlePercentage] = useState(0);
    const [titleOpacity, setTitleOpacity] = useState(0);

    useEffect(() => {
        const localPercentage = getLocalSectionPercentage(1, percentage);
        const normalizedPercentage = localPercentage * -1.7 + 100;
        if (normalizedPercentage > 70) {
            setTitleOpacity(100);
            return;
        }
        setTitleOpacity(normalizedPercentage * 2);
    }, [percentage]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTitlePercentage(prevPercentage => {
                const target = 1;
                const diff = target - prevPercentage;
                const increment = diff * 0.1;

                if (Math.abs(diff) < 0.01) {
                    clearInterval(interval);
                    return target;
                }
                return prevPercentage + increment;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            role="heading"
            style={`opacity: ${titleOpacity / 100}; mix-blend-mode: difference;`}
            class="text-8xl font-black text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <GlitchedText text={text} speed={100} percentage={titlePercentage} />
        </div>
    );
}
