import {
  Keypad_Letters_ROW1,
  Keypad_Letters_ROW2,
  Keypad_Letters_ROW3,
} from "../common/letters";
import { UsedLetters } from "../common/type";

interface KeypadProps {
  usedKeys: UsedLetters;
  canSubmit: boolean;
  onKeyPressedCb: (e: KeyboardEvent) => void;
}

function Keypad(props: KeypadProps) {
  const clickHandle = (key: string) => {
    const e: KeyboardEvent = new KeyboardEvent("keyup", {
      key: key,
    });
    props.onKeyPressedCb(e);
  };

  return (
    <div className="keypad">
      <div className="keypad-row">
        {Keypad_Letters_ROW1.map((letter) => {
          const color = props.usedKeys[letter.key]?.color;
          return (
            <button
              key={letter.key}
              className={color}
              onClick={() => clickHandle(letter.key)}
            >
              {letter.key.toUpperCase()}
            </button>
          );
        })}
      </div>
      <div className="keypad-row">
        {Keypad_Letters_ROW2.map((letter) => {
          const color = props.usedKeys[letter.key]?.color;
          return (
            <button
              key={letter.key}
              className={color}
              onClick={() => clickHandle(letter.key)}
            >
              {letter.key.toUpperCase()}
            </button>
          );
        })}
      </div>
      <div className="keypad-row">
        {Keypad_Letters_ROW3.map((letter) => {
          const color = props.usedKeys[letter.key]?.color;
          return (
            <button
              key={letter.key}
              className={color}
              onClick={() => clickHandle(letter.key)}
            >
              {letter.key.toUpperCase()}
            </button>
          );
        })}
        <button
          className="keypad-delete"
          onClick={() => clickHandle("Backspace")}
        >
          delete
        </button>
      </div>
      <div className="keypad-row">
        <button
          className={props.canSubmit ? "keypad-submit" : "disable"}
          disabled={!props.canSubmit}
          onClick={() => clickHandle("Enter")}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}

export default Keypad;
