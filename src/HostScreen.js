import React, { useState } from "react";
import { Title, Panel, TextAreaCopyButton } from "./Components";

const HostScreen = ({ onConfirm, onCancel, description, iceCandidates }) => {
  //   console.log("renderHostScreen", description, iceCandidates);
  const [remoteAnswer, setRemoteAnswer] = useState("");
  const encodedOffer = btoa(JSON.stringify({ description, iceCandidates }));
  return (
    <Panel>
      <Title>Host Session</Title>

      <div className="space-y-0 flex flex-column">
        <div className="f5 gray">Copy the offer to the guest:</div>
        <TextAreaCopyButton
          text={encodedOffer}
          label="Click to copy offer to clipboard"
        />
        {/* <button className="pointer underline flex f7 items-center self-end outline-0 ma0 pa0 purple bg-white bn">
          show raw
        </button> */}
      </div>
      <div className="space-y-0">
        <div className="f5 gray">Paste answer from guest here:</div>
        <textarea
          value={remoteAnswer}
          onChange={(e) => setRemoteAnswer(e.target.value)}
          className="w-100 ba b--silver w-100 bg-white h5 pa2 br1 mono f7"
        ></textarea>
      </div>
      <div className="flex items-end">
        <button
          className="pv3 ph4 bg-purple bn near-white br1 bg-white pointer mr-auto"
          onClick={() => onConfirm(remoteAnswer)}
        >
          Connect
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

export default HostScreen;
