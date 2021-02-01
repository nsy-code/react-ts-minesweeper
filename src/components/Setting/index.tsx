import React, { useState } from "react";
import "./Setting.scss";

interface SettingInputState {
  [key: string]: number;
  bombs: number;
  rows: number;
  cols: number;
}

interface SettingProps {
  settingdata: SettingInputState;
  handleSave(newSetting: SettingInputState): void;
}

const Setting: React.FC<SettingProps> = ({ handleSave, settingdata }) => {
  const [data, setData] = useState<SettingInputState>(settingdata);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const id = e.target.id;
    const value = e.target.value ? parseInt(e.target.value) : 0;
    const newData = { ...data };
    newData[id] = value;
    setData(newData);
  };
  return (
    <div className="container">
      <div>
        <h2>Game Setting</h2>
      </div>
      <div>
        <div className="setting-item">
          <div className="item-name">Bombs Number:</div>{" "}
          <div>
            <input onChange={handleInputChange} id="bombs" value={data.bombs} />
          </div>
        </div>
        <div className="setting-item">
          <div className="item-name">Map Rows:</div>{" "}
          <div>
            <input onChange={handleInputChange} id="rows" value={data.rows} />
          </div>
        </div>
        <div className="setting-item">
          <div className="item-name">Map Cols:</div>{" "}
          <div>
            <input onChange={handleInputChange} id="cols" value={data.cols} />
          </div>
        </div>
      </div>
      {data.bombs > 0 &&
      data.rows <= 20 &&
      data.cols <= 20 &&
      data.rows >= 9 &&
      data.cols >= 9 ? null : (
        <div className="error-msg">{`9 <= rows & cols <= 20`}</div>
      )}
      {data.rows * data.cols > data.bombs ? null : (
        <div className="error-msg">{`bombs need to more than spaces`}</div>
      )}
      <div className="setting-btn">
        <button onClick={() => handleSave(data)}>Save</button>
      </div>
    </div>
  );
};

export default Setting;
