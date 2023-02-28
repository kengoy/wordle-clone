export enum GuessState {
  GREY = 0,
  YELLOW,
  GREEN,
}

export const GuessStateString = ["grey", "yellow", "green"];

export interface GuessLetter {
  letter: string;
  state: GuessState;
}

export interface UsedLetters {
  [key: string]: {
    color: string;
    positions: number[]; // used for Hard mode.
  };
}

export enum SETTINGS_MODE {
  NORMAL = 0,
  HARD,
}

export interface SettingsState {
  mode: SETTINGS_MODE;
}

export interface SettingsAction {
  type: SETTINGS_ACTIONS;
  payload: {
    mode: SETTINGS_MODE;
  };
}

export enum SETTINGS_ACTIONS {
  CHANGE_MODE,
}
