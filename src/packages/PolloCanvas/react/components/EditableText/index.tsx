import { Html } from "react-konva-utils";
import { useRef, useState } from "react";
import { Text as KonvaText } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
interface TextProps {
  x: number;
  y: number;
  initialText: string;
  onChange: (text: string) => void;
  fontSize?: number;
  width?: number;
  onClick?: (e: KonvaEventObject<MouseEvent>) => void;
}

function Text({
  x,
  y,
  initialText,
  onChange,
  fontSize = 16,
  width = 200,
  onClick,
}: TextProps) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  // 双击两次才能设置为true
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTextClick = (evt: KonvaEventObject<MouseEvent>) => {
    // Reset click count after a delay
    if (clickCount === 1) {
     
      if (clickTimer.current) clearTimeout(clickTimer.current);

      clickTimer.current = setTimeout(() => {
        setClickCount(0);
      }, 300); // 300ms timeout for double-click
    }

    // Increment click count
    setClickCount(clickCount + 1);
    if (clickCount === 0) {
      onClick?.(evt);
    }

    // Only set editing to true after two clicks
    if (clickCount >= 1) {
      // This is the second click
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setClickCount(0);
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (onChange) {
      onChange(newText);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      setIsEditing(false);
    }
  };

  return (
    <>
      <KonvaText
        draggable
        x={x}
        y={y}
        fontSize={fontSize}
        width={width}
        text={text}
        onClick={handleTextClick}
      />
      {isEditing && (
        <Html>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              fontSize: `${fontSize}px`,
              fontFamily: "Arial",
              padding: "0px",
              margin: "0px",
              border: "1px solid #999",
              background: "white",
              outline: "none",
              resize: "none",
              zIndex: -1,
              minHeight: "20px",
              lineHeight: "1.2",
            }}
            autoFocus
          />
        </Html>
      )}
    </>
  );
}

export default Text;
