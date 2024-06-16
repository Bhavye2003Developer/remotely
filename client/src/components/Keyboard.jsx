import { useEffect, useRef, useState } from "react";

const Keyboard = ({ socket }) => {
  const [inputText, setInputText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputText)
      socket.send(
        JSON.stringify({
          type: "typing",
          data: inputText.slice(inputText.length - 1),
        })
      );
    setInputText("");
  }, [inputText]);

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter")
            socket.send(
              JSON.stringify({ type: "special_key_press", value: "enter" })
            );
          else if (e.key === "Backspace")
            socket.send(
              JSON.stringify({
                type: "special_key_press",
                value: "backspace",
              })
            );
        }}
      />
      <button
        onClick={() => {
          if (!isInputFocused) {
            inputRef.current?.focus();
          } else inputRef.current?.blur();
        }}
      >
        Enable keyboard
      </button>
    </div>
  );
};

export default Keyboard;
