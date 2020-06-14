import React, { useState } from "react";
import { Title, Panel } from "./Components";

const PasteBinGuestScreen = ({ onConnect, onCancel }) => {
  const [pasteId, setPasteId] = useState("");
  const [error, setError] = useState(false);
  return (
    <Panel>
      <Title>Join Session</Title>
      <div className="f5 gray">Paste host code here:</div>
      <div className="flex flex-column space-y-0">
        <input
          placeholder="Host Code"
          className="ba b--silver flex-auto bg-white pa4 br1 mono f4"
          value={pasteId}
          onChange={(e) => {
            setError(false);
            setPasteId(e.target.value);
          }}
        />
        {error && <div className="red">This is not a valid pastebin URL.</div>}
      </div>

      <div className="flex items-end">
        <button
          className="pv3 ph4 bg-purple bn near-white br1 bg-white pointer mr-auto"
          onClick={() => {
            if (pasteId.trim().length < 4) {
              setError(true);
            } else {
              onConnect(pasteId);
            }
          }}
        >
          Create Answer
        </button>

        <button
          className="pv1 ph2 b--dark-red ba dark-red br1 bg-white pointer f6"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </Panel>
  );
};

export default PasteBinGuestScreen;
