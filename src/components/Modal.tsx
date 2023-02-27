interface ModalProps {
  isCorrect: boolean;
  turn: number;
  answer: string;
  onStartNewGame: () => void;
}

function Modal(props: ModalProps) {
  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="modal-body">
          {props.isCorrect && (
            <div>
              <h1>YOU WIN!</h1>
              <p>You found the solution in {props.turn} guesses!</p>
            </div>
          )}
          {!props.isCorrect && (
            <div>
              <h1>GAME OVER</h1>
              <h2>
                Answer is{" "}
                <span className="fc-green">{props.answer.toUpperCase()}</span>
              </h2>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="bn-blue" onClick={props.onStartNewGame}>
            Start a new game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
