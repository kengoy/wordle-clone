import { useEffect, useReducer, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { TfiSettings, TfiClose } from "react-icons/Tfi";
import useWordle from "../hooks/useWordle";
import Grid from "./Grid";
import Keypad from "./Keypad";
import Modal from "./Modal";
import Settings from "./Settings";
import {
  SETTINGS_ACTIONS,
  SETTINGS_MODE,
  SettingsAction,
  SettingsState,
} from "../common/type";
import { WORDLE_MAX_LETTERS, WORDLE_MAX_TURN } from "../common/config";
import { ErrorMsg } from "../common/string";

const initialSettings: SettingsState = {
  mode: SETTINGS_MODE.NORMAL,
};

// Reducer to share the state of settings mode(NORMAL or HARD)
function reducer(settings: SettingsState, action: SettingsAction) {
  switch (action.type) {
    case SETTINGS_ACTIONS.CHANGE_MODE:
      const newSettings = { ...settings };
      newSettings.mode = action.payload.mode;
      return newSettings;
    default:
      return settings;
  }
}

function Wordle() {
  const {
    startNewGame,
    finishGame,
    turn,
    currentGuess,
    guesses,
    isCorrect,
    usedLetters,
    answer,
    handleKeyInput,
    errMsg,
  } = useWordle();

  const [settings, dispatch] = useReducer(reducer, initialSettings);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    startNewGame(settings);
  }, [settings]);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyInput);

    if (isCorrect || turn > WORDLE_MAX_TURN - 1) {
      setTimeout(() => {
        finishGame();
        setShowModal(true);
        window.removeEventListener("keyup", handleKeyInput);
      }, 1500);
    }

    return () => {
      window.removeEventListener("keyup", handleKeyInput);
    };
  }, [handleKeyInput, isCorrect]);

  return (
    <div className="wordle">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div className="wordle-header">
                  <h1>
                    Wordle{" "}
                    {settings.mode === SETTINGS_MODE.HARD && <span>HARD</span>}
                  </h1>
                  {errMsg === ErrorMsg.NETWORK_ERROR && (
                    <div className="error-message">
                      <p>SERVER ERROR</p>
                      <p>Check your local Wordle-API server.</p>
                    </div>
                  )}
                  <NavLink to="/settings">
                    <div className="settings">
                      <button>
                        <TfiSettings />
                      </button>
                    </div>
                  </NavLink>
                </div>
                <Grid
                  guesses={guesses}
                  currentGuess={currentGuess}
                  turn={turn}
                />
                <Keypad
                  usedKeys={usedLetters}
                  onKeyPressedCb={handleKeyInput}
                  canSubmit={currentGuess.length === WORDLE_MAX_LETTERS}
                />
                {showModal && (
                  <Modal
                    isCorrect={isCorrect}
                    turn={turn}
                    answer={answer}
                    onStartNewGame={() => {
                      setShowModal(false);
                      startNewGame(settings);
                    }}
                  />
                )}
                {errMsg && errMsg !== ErrorMsg.NETWORK_ERROR && (
                  <p className="error-message">{errMsg}</p>
                )}
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div>
                <div className="wordle-header">
                  <h1>Settings</h1>
                  <NavLink to="/">
                    <div className="settings">
                      <button>
                        <TfiClose />
                      </button>
                    </div>
                  </NavLink>
                </div>
                <Settings settings={settings} dispatch={dispatch} />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Wordle;
