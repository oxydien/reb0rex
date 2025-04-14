import {useEffect, useState} from "preact/hooks";

interface GlitchedTextProps {
    text: string;
    speed: number;
    percentage?: number
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890Đ~°&[]Łł<{}^$'*>þø→↓←%#@!` ".split("");

const getRandomChar = (): string => {
    const random = Math.floor(Math.random() * alphabet.length);
    return alphabet[random];
}

export default function GlitchedText( { text, speed, percentage = 0 }: GlitchedTextProps ) {
    const [currentText, setCurrentText] = useState(text);

    useEffect(() => {
        const randomText = () => {
            let updatedText = currentText;
            for (let i = 0; i < text.length; i++) {
                if (i / text.length < percentage) {
                    updatedText = updatedText.slice(0, i) + text[i] + updatedText.slice(i + 1);
                    continue;
                }
                const randomChar = getRandomChar();
                updatedText = updatedText.slice(0, i) + randomChar + updatedText.slice(i + 1);
            }
            setCurrentText(updatedText);
        }
        const interval = setInterval(randomText, speed);
        randomText();
        return () => clearInterval(interval);
    }, [text, speed, percentage]);

    return (
        <div>
            {currentText.split("").map((char, index) => (
                <span key={index}>{char}</span>
            ))}
        </div>
    );
}
