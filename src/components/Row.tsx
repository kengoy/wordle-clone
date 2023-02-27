import { WORDLE_MAX_LETTERS } from "../common/config";
import { GuessLetter, GuessStateString } from "../common/type";

interface RowProps {
  guess: GuessLetter[];
  currentGuess: string;
}

function Row(props: RowProps) {
  if (props.guess) {
    return (
      <div className="row">
        {props.guess.map((letter, index) => (
          <div key={index} className={GuessStateString[letter.state]}>
            {letter.letter}
          </div>
        ))}
      </div>
    );
  }
  if (props.currentGuess) {
    const letters = props.currentGuess.split("");
    return (
      <div className="row current">
        {letters.map((letter, index) => (
          <div key={index} className="filled">
            {letter}
          </div>
        ))}
        {[...Array(WORDLE_MAX_LETTERS - letters.length)].map((_, index) => (
          <div key={index}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="row">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Row;
