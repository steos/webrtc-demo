import React, { useState } from "react";

const MessageScreen = ({ messages, onSubmit, onCancel }) => {
  const [msg, setMsg] = useState("");
  const send = () => {
    onSubmit(msg);
    setMsg("");
  };
  return (
    <div className="flex flex-column flex-auto">
      <div className="bg-near-white bb b--moon-gray flex">
        <h2 className="ma0 pa3 mr-auto">Chat</h2>
        <button
          className="bn pointer outline-0 bg-inherit"
          onClick={() => {
            if (confirm("Really disconnect?")) {
              onCancel();
            }
          }}
        >
          <i className="material-icons">exit_to_app</i>
        </button>
      </div>

      <div className="flex flex-column h-100 pa3 space-y-1">
        {messages.map(({ msg, type }, index) =>
          type === "incoming" ? (
            <div
              key={index}
              className="bg-light-blue w-40 br3 pa2 word-wrap"
              style={{ borderBottomLeftRadius: 0 }}
            >
              {msg}
            </div>
          ) : (
            <div
              key={index}
              className="bg-light-green w-40 br3 pa2 self-end word-wrap"
              style={{ borderBottomRightRadius: 0 }}
            >
              {msg}
            </div>
          )
        )}
      </div>
      <div className="flex space-x-1 bg-near-white pa3 bt b--moon-gray">
        <input
          placeholder="type your message here"
          className="w-100 ba b--moon-gray br1 pa3"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
        />
        <button className="bg-purple near-white pv2 ph3 br1 bn" onClick={send}>
          send
        </button>
      </div>
    </div>
  );
};

export default MessageScreen;
