import ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import StartScreen from "./StartScreen";
import HostScreen from "./HostScreen";
import PasteBinHostScreen from "./PasteBinHostScreen";
import PasteBinGuestScreen from "./PasteBinGuestScreen";
import MessageScreen from "./MessageScreen";
import { GuestAnswerScreen, GuestScreen } from "./Guest";
import {
  Panel,
  Title,
  LoadingPanel,
  ErrorPanel,
  CopyButton,
} from "./Components";

const postPasteBin = async (conf, content, expire = "10M") => {
  const params = {
    api_option: "paste",
    api_dev_key: conf.pasteBinApiKey,
    api_paste_code: content,
    api_paste_private: "2", // 0=public 1=unlisted 2=private
    api_paste_expire_date: expire,
  };
  const body = Object.entries(params)
    .map(([k, v]) => [k, encodeURIComponent(v)].join("="))
    .join("&");
  const response = await fetch(
    conf.corsProxy + "https://pastebin.com/api/api_post.php",
    {
      mode: "cors",
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const text = await response.text();
  return text;
};

const storageBaseKey = "webrtc-demo-0819ad5b";
const LocalKey = {
  config: `${storageBaseKey}-config`,
};

const App = ({ defaultConfig }) => {
  const [view, setView] = useState("start");
  const [conf, setConfig] = useState(defaultConfig);
  const connRef = useRef(null);
  const chanRef = useRef(null);

  const [localDescription, setLocalDescription] = useState(null);
  const [iceCandidates, setIceCandidates] = useState([]);

  const [messages, setMessages] = useState([]);

  const [pasteBinOfferUrl, setPasteBinOfferUrl] = useState(null);

  const connect = () => {
    return new RTCPeerConnection({
      iceServers: conf.iceUrl.trim().length
        ? [
            {
              urls: conf.iceUrl,
              username: conf.iceUser,
              credential: conf.iceCredential,
            },
          ]
        : [],
    });
  };

  const cancel = () => {
    if (connRef.current) {
      connRef.current.close();
      connRef.current = null;
      chanRef.current = null;
    }
    setLocalDescription(null);
    setIceCandidates([]);
    setMessages([]);
    setView("start");
    setPasteBinOfferUrl(null);
  };

  const onMessage = (event) => {
    // console.log("received", event, messages);
    setMessages((xs) => xs.concat([{ type: "incoming", msg: event.data }]));
  };

  const connectGuest = async (remote) => {
    connRef.current = connect();
    connRef.current.ondatachannel = (event) => {
      chanRef.current = event.channel;
      chanRef.current.onmessage = onMessage;
      chanRef.current.onopen = () => setView("message");
      chanRef.current.onclose = cancel;
    };
    connRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        setIceCandidates((xs) => xs.concat([event.candidate]));
      }
    };
    connRef.current.setRemoteDescription(remote.description);
    const answer = await connRef.current.createAnswer();
    connRef.current.setLocalDescription(answer);
    remote.iceCandidates.forEach((candidate) => {
      connRef.current.addIceCandidate(candidate);
    });
    setLocalDescription(answer);
  };

  //   return (
  //     <PasteBinHostScreen
  //       config={conf}
  //       pasteBinOfferUrl="https://pastebin.com/quUx"
  //     />
  //   );

  if (view === "start") {
    return (
      <StartScreen
        defaults={conf}
        onHost={async (conf) => {
          connRef.current = connect();
          chanRef.current = connRef.current.createDataChannel("comms");
          chanRef.current.onmessage = onMessage;
          chanRef.current.onopen = () => setView("message");
          chanRef.current.onclose = cancel;
          connRef.current.onicecandidate = (event) => {
            // console.log("onicecandidate", event.candidate);
            if (event.candidate) {
              setIceCandidates((xs) => xs.concat([event.candidate]));
            }
          };
          const offer = await connRef.current.createOffer();
          connRef.current.setLocalDescription(offer);
          setLocalDescription(offer);

          sessionStorage.setItem(LocalKey.config, JSON.stringify(conf));

          if (conf.signaling === "pastebin") {
            setTimeout(async () => {
              const text = await postPasteBin(
                conf,
                btoa(JSON.stringify({ description: offer, iceCandidates }))
              );
              setPasteBinOfferUrl(text);
            }, 1000);
          }

          setConfig(conf);
          setView("host");
        }}
        onJoin={(conf) => {
          //TODO
          setConfig(conf);
          setView("guest");
        }}
      ></StartScreen>
    );
  } else if (view === "host") {
    if (conf.signaling === "pastebin") {
      return (
        <PasteBinHostScreen
          config={conf}
          pasteBinOfferUrl={pasteBinOfferUrl}
          description={localDescription}
          iceCandidates={iceCandidates}
          onCancel={cancel}
          onConnect={(remote) => {
            connRef.current.setRemoteDescription(remote.description);
            remote.iceCandidates.forEach((candidate) => {
              connRef.current.addIceCandidate(candidate);
            });
          }}
        />
      );
    }
    return (
      <HostScreen
        description={localDescription}
        iceCandidates={iceCandidates}
        onConfirm={(remoteAnswer) => {
          const remote = JSON.parse(atob(remoteAnswer));
          connRef.current.setRemoteDescription(remote.description);
          remote.iceCandidates.forEach((candidate) => {
            connRef.current.addIceCandidate(candidate);
          });
        }}
        onCancel={cancel}
      />
    );
  } else if (view === "guest") {
    if (conf.signaling === "pastebin") {
      return (
        <PasteBinGuestScreen
          onCancel={cancel}
          onConnect={async (pasteId) => {
            // console.log(pasteId);
            setView("pastebin-answer");
            const rawUrl = `https://pastebin.com/raw/${pasteId}`;
            const response = await fetch(conf.corsProxy + rawUrl);
            if (response.status === 404) {
              alert("No paste found with this code.");
              setView("guest");
              return;
            }
            const rawPaste = await response.text();
            const remote = JSON.parse(atob(rawPaste));

            await connectGuest(remote);

            setTimeout(async () => {
              const text = await postPasteBin(
                conf,
                btoa(
                  JSON.stringify({
                    description: connRef.current.localDescription,
                    iceCandidates,
                  })
                )
              );
              setPasteBinOfferUrl(text);
            }, 1000);
          }}
        />
      );
    }
    return (
      <GuestScreen
        onCancel={cancel}
        onConnect={async (offer) => {
          const remote = JSON.parse(atob(offer));
          await connectGuest(remote);
          setView("manual-answer");
        }}
      />
    );
  } else if (view === "manual-answer") {
    return (
      <GuestAnswerScreen
        description={localDescription}
        iceCandidates={iceCandidates}
        onCancel={cancel}
      />
    );
  } else if (view === "pastebin-answer") {
    //TODO
    if (pasteBinOfferUrl == null) {
      return <LoadingPanel>creating answer paste, please wait</LoadingPanel>;
    }
    const match = pasteBinOfferUrl.match(/^https?:\/\/pastebin.com\/(.+)$/);
    if (!match) {
      return <ErrorPanel onCancel={cancel}>{pasteBinOfferUrl}</ErrorPanel>;
    }
    const [, pasteId] = match;
    return (
      <Panel>
        <Title>Join Session</Title>
        <div>Copy this code to the host:</div>
        <CopyButton text={pasteId} />
        <div className="flex items-start">
          <button
            className="pv1 ph2 b--dark-red ba dark-red br1 bg-white pointer f6"
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      </Panel>
    );
  }

  return (
    <MessageScreen
      messages={messages}
      onCancel={cancel}
      onSubmit={(msg) => {
        chanRef.current.send(msg);
        setMessages([...messages, { type: "outgoing", msg }]);
      }}
    />
  );
};

const readLocalKey = (store, key, defaultValue = null) => {
  const data = store.getItem(key);
  try {
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(e);
    return defaultValue;
  }
};

const config = Object.assign(
  {
    iceUrl: "stun:stun.l.google.com:19302",
    iceUser: "",
    iceCredential: "",
    signaling: "manual",
    pasteBinApiKey: "",
    corsProxy: "https://cors-anywhere.herokuapp.com/",
  },
  readLocalKey(sessionStorage, LocalKey.config, {})
);

ReactDOM.render(<App defaultConfig={config} />, window.root);
