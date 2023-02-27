import Row from "./Row";
import { GuessLetter } from "../common/type";

interface GridProps {
  guesses: GuessLetter[][];
  currentGuess: string;
  turn: number;
}

function Grid(props: GridProps) {
  return (
    <div>
      {props.guesses.map((guess, index) => (
        <Row
          key={index}
          guess={guess}
          currentGuess={props.turn === index ? props.currentGuess : ""}
        />
      ))}
    </div>
  );
}

export default Grid;
