import React, { useState, useEffect, useRef } from "react";

export const Panel = ({ children }) => (
  <div className="ma3 space-y-1 mw6 flex-auto">{children}</div>
);

export const Title = ({ children }) => <h2 className="ma0 mb3">{children}</h2>;

export const Loader = ({ color = "black", size = 13 }) => {
  const style = {
    background: color,
    width: size,
    height: size,
  };
  return (
    <div className="lds-ellipsis">
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
    </div>
  );
};

export const LoadingPanel = ({ children }) => (
  <Panel>
    <div className="flex flex-column items-center space-y-3 flex-auto pa4">
      <div className="f4 silver">{children}</div>
      <Loader color="silver" />
    </div>
  </Panel>
);

export const ErrorPanel = ({ children, onCancel, title = "Error" }) => (
  <Panel>
    <Title>{title}</Title>
    <div className="pa4 ba b--red red flex justify-center items-center">
      {children}
    </div>
    <div className="flex">
      <button
        className="pv3 ph4 bg-white gray ba b--gray br1 bg-white pointer"
        onClick={onCancel}
      >
        OK
      </button>
    </div>
  </Panel>
);

export const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const timeout = useRef(null);
  useEffect(() => {
    return () => {
      if (timeout.current != null) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    };
  }, []);
  return (
    <button
      className={
        "f4 purple pa4 ba bg-white br1 pointer flex w-100 outline-0 " +
        (copied ? "b--green" : "b--purple")
      }
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        timeout.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      }}
    >
      {!copied ? (
        <div className="flex items-center space-x-1 flex-auto">
          <div className="mr-auto">{text}</div>
          <i className="moon-gray material-icons md-36">file_copy</i>
        </div>
      ) : (
        <div className="flex items-center space-x-1 flex-auto">
          <div className="f5 green mr-auto">Copied successfully!</div>
          <i className="green material-icons md-36">done</i>
        </div>
      )}
    </button>
  );
};

export const TextAreaCopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const timeout = useRef(null);
  useEffect(() => {
    return () => {
      if (timeout.current != null) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    };
  }, []);
  return (
    <div className="w-100 bg-white br1 relative">
      <div className="mono f7 gray word-wrap h4 overflow-hidden">{text}</div>
      <div
        className={
          "absolute flex w-100 h-100 ba br1 " +
          (copied ? "b--green" : "b--purple")
        }
        style={{ top: 0, left: 0 }}
      >
        <div
          className="purple pointer flex flex-column flex-auto bg-white o-90 justify-center items-center space-y-0"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            timeout.current = setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        >
          {!copied && (
            <>
              <i className="material-icons md-36">file_copy</i>
              <div className="f5 purple">{label}</div>
            </>
          )}
          {copied && (
            <>
              <i className="green material-icons md-36">done</i>
              <div className="f5 green">Copied successfully!</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
