import Switch from "react-switch";
import {
  SettingsAction,
  SettingsState,
  SETTINGS_ACTIONS,
  SETTINGS_MODE,
} from "../common/type";

enum SettingsType {
  SWITCH,
}

interface SettingsProps {
  settings: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
}

interface SettingsItemProps {
  settingsProps: SettingsProps;
  title: string;
  description: string;
  type: SettingsType;
}

function SettingsItem({
  settingsProps,
  title,
  description,
  type,
}: SettingsItemProps) {
  return (
    <div className="settingItem">
      <div className="settingInfo">
        <div className="settingTitle">
          <h2>{title}</h2>
        </div>
        <div className="settingDescription">
          <p>{description}</p>
        </div>
      </div>
      {type === SettingsType.SWITCH && (
        <Switch
          onChange={(checked) => {
            const mode = checked ? SETTINGS_MODE.HARD : SETTINGS_MODE.NORMAL;
            settingsProps.dispatch({
              type: SETTINGS_ACTIONS.CHANGE_MODE,
              payload: { mode: mode },
            });
          }}
          checked={
            settingsProps.settings.mode === SETTINGS_MODE.HARD ? true : false
          }
          checkedIcon={false}
          uncheckedIcon={false}
          onColor={"#6495ed"}
        />
      )}
    </div>
  );
}

function Settings(props: SettingsProps) {
  return (
    <div className="settings-container">
      <SettingsItem
        settingsProps={props}
        title="Hard Mode"
        description="Any revealed hints must be used in subsequent guesses. Changing mode will restart a new game."
        type={SettingsType.SWITCH}
      />
    </div>
  );
}

export default Settings;
