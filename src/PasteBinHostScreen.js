import React, { useState } from "react";
import {
  Title,
  Panel,
  CopyButton,
  LoadingPanel,
  ErrorPanel,
} from "./Components";

const PasteBinHostScreen = ({
  onCancel,
  pasteBinOfferUrl,
  config,
  onConnect,
}) => {
  //   const [showDetails, setShowDetails] = useState(false);

  const [connecting, setConnecting] = useState(false);
  const [answerCode, setAnswerCode] = useState("");
  const [error, setError] = useState(null);

  if (!pasteBinOfferUrl) {
    return <LoadingPanel>creating offer paste, please wait</LoadingPanel>;
  }

  const isSuccess = pasteBinOfferUrl.match(/^https?:\/\/pastebin.com\/(.*)$/);

  if (!isSuccess) {
    return <ErrorPanel onCancel={onCancel}>{pasteBinOfferUrl}</ErrorPanel>;
  }

  const [, pasteId] = pasteBinOfferUrl.match(/^https?:\/\/pastebin.com\/(.+)$/);

  if (connecting) {
    return <LoadingPanel>connecting, please wait</LoadingPanel>;
  }

  return (
    <Panel>
      <Title>Confirm Answer</Title>

      <div className="space-y-0">
        <div className="f5 gray">Copy this code to the guest:</div>
        <CopyButton text={pasteId} />
      </div>

      <div className="space-y-0">
        <div className="f5 gray">Paste the code from the guest here:</div>
        <div className="flex-auto flex">
          <input
            className="f4 pa4 br1 ba b--silver flex flex-auto"
            placeholder="Answer Code"
            value={answerCode}
            onChange={(e) => {
              setError(null);
              setAnswerCode(e.target.value);
            }}
          />
        </div>

        {error && <div className="red pv1">{error}</div>}
      </div>

      <div className="flex items-start">
        <button
          className="pv3 ph4 bg-purple bn near-white br1 bg-white pointer mr-auto"
          onClick={async () => {
            //TODO
            if (answerCode.trim().length < 4) {
              setError("Cannot find paste with this code.");
              return;
            }
            setConnecting(true);
            try {
              const response = await fetch(
                config.corsProxy + `https://pastebin.com/raw/${answerCode}`
              );
              if (!response.ok) {
                setError("Cannot find paste with this code.");
                setConnecting(false);
                return;
              }
              const text = await response.text();
              const remote = JSON.parse(atob(text));
              onConnect(remote);
            } catch (e) {
              setError(e.toString());
              setConnecting(false);
            }
          }}
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

export default PasteBinHostScreen;
