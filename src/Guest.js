import React, { useState } from "react";
import { Title, Panel, TextAreaCopyButton } from "./Components";

export const GuestAnswerScreen = ({ description, iceCandidates, onCancel }) => {
  const encodedAnswer = btoa(JSON.stringify({ description, iceCandidates }));
  return (
    <Panel>
      <Title>Join Session</Title>
      <div className="ba b--light-green bg-washed-green pa3 green">
        Answer created successfully!
      </div>
      <div className="f5 gray">Copy this answer to the host:</div>
      <TextAreaCopyButton
        text={encodedAnswer}
        label="Copy answer to clipboard"
      />

      <button
        className="pv1 ph2 b--dark-red ba dark-red br1 bg-white pointer f6"
        onClick={onCancel}
      >
        Cancel
      </button>
    </Panel>
  );
};

export const GuestScreen = ({ onConnect, onCancel }) => {
  const [remoteOffer, setRemoteOffer] = useState("");
  return (
    <Panel>
      <Title>Join Session</Title>
      <div className="f5 gray">Paste offer from host here:</div>
      <textarea
        className="ba b--silver w-100 bg-white h5 pa2 br1 mono f7"
        value={remoteOffer}
        onChange={(e) => setRemoteOffer(e.target.value)}
      ></textarea>
      <div className="flex items-end">
        <button
          className="pv3 ph4 bg-purple bn near-white br1 bg-white pointer mr-auto"
          onClick={() => {
            onConnect(remoteOffer);
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
