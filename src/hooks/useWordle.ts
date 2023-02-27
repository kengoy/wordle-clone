import { useState } from "react";
import { WORDLE_MAX_LETTERS, WORDLE_MAX_TURN_BY_MODE } from "../common/config";
import {
  GuessLetter,
  GuessState,
  GuessStateString,
  SettingsState,
} from "../common/type";

const WORDLE_API_BASE = import.meta.env.VITE_WORDLE_API_URL;
const WORDLE_API_STARTGAME = WORDLE_API_BASE + "v1/start_game/";
const WORDLE_API_FINISHGAME = WORDLE_API_BASE + "v1/finish_game/";
const WORDLE_API_GUESS = WORDLE_API_BASE + "v1/guess/";

const WORDLE_API_ERROR_NOT_A_WORD = "Not a word";
const WORDLE_API_NETWORK_ERROR = "Network error";

interface WordleIF {
  startNewGame: (settings: SettingsState) => void; // Trigger starting a new game with mode settings.
  finishGame: () => void; // Trigger finishing the current game to retrieve the answer
  turn: number; // Current turn no. with 0-index
  currentGuess: string; // Current string input by user for the current turn before submitting
  guesses: GuessLetter[][]; // Stored words data with color information in each row
  isCorrect: boolean; // True when the latest guess is correct
  usedKeys: { [key: string]: string }; // Letter with current color information to be used by Keypad component
  answer: string; // Answer word revealed when finishGame() is called.
  handleKeyInput: (e: KeyboardEvent) => void; // Callback function when user types on keyboard or clicks on Keypad.
  errMsg: string; // Error Message to be shown to users in case submitted word is 'Not a word' etc.
}

// same data structure as Wordle-API response
interface GameInfo {
  id: number;
  key: string;
  wordID: number;
}

function useWordle(): WordleIF {
  const [gameInfo, setGameInfo] = useState<GameInfo>({
    id: 0,
    key: "",
    wordID: 0,
  });
  const [turn, setTurn] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<GuessLetter[][]>(Array(6).fill(null));
  const [history, setHistory] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({});
  const [answer, setAnswer] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  function startNewGame(settings: SettingsState) {
    reset(settings);
    postData(WORDLE_API_STARTGAME).then((data) => {
      if (data.success) {
        setGameInfo({
          id: data.data.id,
          key: data.data.key,
          wordID: data.data.wordId,
        });
      } else {
        setErrMsg(data.errMsg);
      }
    });
  }

  function finishGame() {
    postData(WORDLE_API_FINISHGAME, {
      id: gameInfo.id,
      key: gameInfo.key,
    }).then((data) => {
      if (data.success) {
        setAnswer(data.data.answer);
      } else {
        setErrMsg(data.errMsg);
      }
    });
  }

  function handleKeyInput(e: KeyboardEvent) {
    const key = e.key;
    if (key === "Enter") {
      if (turn > WORDLE_MAX_LETTERS) {
        return;
      }
      if (history.includes(currentGuess)) {
        return;
      }
      if (currentGuess.length !== WORDLE_MAX_LETTERS) {
        return;
      }
      guess();
      return;
    }

    if (key === "Backspace") {
      setErrMsg("");
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    // handle only alphabet letters.
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < WORDLE_MAX_LETTERS) {
        setCurrentGuess((prev) => {
          return prev + key;
        });
      }
    }
  }

  async function postData(url: string = "", data: object = {}) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data, errMsg: "" };
      } else {
        // this should happen only the case the word is not in the dictionary with status code 400.
        if (response.status !== 400) {
          console.error("fetch failed with response:", response);
          return { success: false, data: null, errMsg: "unexpected error." };
        }
        return {
          success: false,
          data: null,
          errMsg: WORDLE_API_ERROR_NOT_A_WORD,
        };
      }
    } catch (error) {
      console.error(error);
      return { success: false, data: null, errMsg: WORDLE_API_NETWORK_ERROR };
    }
  }

  function guess() {
    postData(WORDLE_API_GUESS, {
      id: gameInfo.id,
      key: gameInfo.key,
      guess: currentGuess,
    }).then((data) => {
      if (data.success) addNewGuess(data.data);
      else setErrMsg(data.errMsg);
    });
  }

  function addNewGuess(guess: GuessLetter[]) {
    let correct = true;
    let guessString = "";

    guess.forEach((item) => {
      guessString += item.letter;
      if (item.state !== GuessState.GREEN) correct = false;
    });

    if (correct) setIsCorrect(true);

    setHistory([...history, guessString]);
    const newGuesses = [...guesses];
    newGuesses[turn] = guess.slice();
    setGuesses(newGuesses);
    setTurn(turn + 1);
    setCurrentGuess("");

    setUsedKeys((prevUsedKeys) => {
      const newKeys = { ...prevUsedKeys };
      guess.forEach((item) => {
        const currentColor = newKeys[item.letter];
        if (item.state === GuessState.GREEN) {
          newKeys[item.letter] = GuessStateString[item.state];
          return;
        }
        if (
          item.state === GuessState.YELLOW &&
          currentColor !== GuessStateString[GuessState.GREEN]
        ) {
          newKeys[item.letter] = GuessStateString[item.state];
          return;
        }
        if (
          item.state === GuessState.GREY &&
          currentColor !== GuessStateString[GuessState.GREEN] &&
          currentColor !== GuessStateString[GuessState.YELLOW]
        ) {
          newKeys[item.letter] = GuessStateString[item.state];
          return;
        }
      });
      return newKeys;
    });
  }

  function reset(settings: SettingsState) {
    setTurn(0);
    setCurrentGuess("");
    setGuesses(Array(WORDLE_MAX_TURN_BY_MODE[settings.mode]).fill(null));
    setHistory([]);
    setIsCorrect(false);
    setUsedKeys({});
    setAnswer("");
    setErrMsg("");
    setGameInfo({
      id: 0,
      key: "",
      wordID: 0,
    });
  }

  return {
    startNewGame,
    finishGame,
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedKeys,
    answer,
    handleKeyInput,
    errMsg,
  };
}

export default useWordle;
