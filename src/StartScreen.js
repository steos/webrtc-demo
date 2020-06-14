import React, { useState } from "react";
import { Title, Panel } from "./Components";

const SignalingButton = ({ selected, children, onClick }) => {
  return (
    <button
      className={
        "ma0 pa0 outline-0 flex items-center bg-white ba br1 pointer " +
        (selected ? "dark-gray b--gray" : "silver b--silver")
      }
      onClick={onClick}
    >
      <div className="w3 pa3 flex items-center">
        <i className="material-icons md-36">
          {selected ? "radio_button_checked" : "radio_button_unchecked"}
        </i>
      </div>
      <div className="pa3 b">{children}</div>
    </button>
  );
};

const StartScreen = ({ defaults, onHost, onJoin }) => {
  const [iceUrl, setIceUrl] = useState(defaults.iceUrl);
  const [iceUser, setIceUser] = useState(defaults.iceUser);
  const [iceCredential, setIceCredential] = useState(defaults.iceCredential);
  const [pasteBinApiKey, setPasteBinApiKey] = useState(defaults.pasteBinApiKey);
  const [corsProxy, setCorsProxy] = useState(defaults.corsProxy);
  const [signaling, setSignaling] = useState(defaults.signaling);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const data = {
    iceUrl,
    iceUser,
    iceCredential,
    signaling,
    pasteBinApiKey,
    corsProxy,
  };
  return (
    <Panel>
      <Title>New Session</Title>

      <div className="flex flex-column flex-auto space-y-2 mw6">
        <div className="flex flex-column space-y-0">
          <h2 className="ma0 f5 mv2">Signal Channel</h2>
          <SignalingButton
            selected={signaling === "manual"}
            onClick={() => setSignaling("manual")}
          >
            Manual
          </SignalingButton>

          <SignalingButton
            selected={signaling === "pastebin"}
            onClick={() => setSignaling("pastebin")}
          >
            pastebin.com
          </SignalingButton>

          {signaling === "pastebin" && (
            <div className="bg-near-white b--moon-gray gray">
              <div className="flex">
                <div className="w3 pa3">
                  <div style={{ width: 36 }} />
                </div>
                <div className="pa3 flex-auto flex">
                  <input
                    className="pa2 lh-copy ba b--moon-gray br1 flex-auto"
                    value={pasteBinApiKey}
                    onChange={(e) => setPasteBinApiKey(e.target.value)}
                    placeholder="pastebin API key"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {showAdvanced && (
          <>
            <div className="flex flex-column space-y-0">
              <h2 className="ma0 f5 mv2">ICE Server</h2>
              <input
                className="pa2 lh-copy ba b--silver br1"
                value={iceUrl}
                placeholder="url"
                onChange={(e) => setIceUrl(e.target.value)}
              />
              <input
                className="pa2 lh-copy ba b--silver br1"
                value={iceUser}
                onChange={(e) => setIceUser(e.target.value)}
                placeholder="username"
              />
              <input
                className="pa2 lh-copy ba b--silver br1"
                value={iceCredential}
                placeholder="credential"
                onChange={(e) => setIceCredential(e.target.value)}
              />
            </div>

            <div className="flex flex-column space-y-0">
              <h2 className="ma0 f5 mv2">CORS Proxy</h2>
              <input
                className="pa2 lh-copy ba b--silver br1"
                value={corsProxy}
                placeholder="url"
                onChange={(e) => setCorsProxy(e.target.value)}
              />
            </div>
            <div className="flex">
              <button
                className="pointer outline-0 bg-inherit purple b--purple o-50 glow f6 ba br1 pa1 f7 pa0 ma0"
                onClick={() => setShowAdvanced(false)}
              >
                Hide advanced settings
              </button>
            </div>
          </>
        )}
        {!showAdvanced && (
          <div className="flex ">
            <button
              className="pointer outline-0 bg-inherit purple b--purple o-50 glow f6 ba br1 pa1 f7 pa0 ma0"
              onClick={() => setShowAdvanced(true)}
            >
              Show advanced settings
            </button>
          </div>
        )}

        <div className="space-x-1 flex">
          <button
            className="pv3 ph4 bg-purple bn near-white br1 bg-white pointer "
            onClick={() => onHost(data)}
          >
            Host Session
          </button>
          <button
            className="pv3 ph4 b--purple ba purple br1 bg-white pointer "
            onClick={() => onJoin(data)}
          >
            Join Session
          </button>
        </div>
      </div>
    </Panel>
  );
};

export default StartScreen;
