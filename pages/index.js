import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { Controlled as Codemirror } from "react-codemirror2-react-17";
import "codemirror/lib/codemirror.css";

export default function Home() {
  const [selected, setSelected] = useState("query");
  const [selectedResponse, setSelectedResponse] = useState("body-response");
  const [response, setResponse] = useState({});
  const [method, setMethod] = useState("");
  const [url, setUrl] = useState("");
  const bodyRef = useRef(null);
  const initialFields = [{ key: "", value: "" }];
  const [inputParamFields, setInputParamFields] = useState(initialFields);
  const [inputHeadersFields, setInputHeadersFields] = useState(initialFields);
  const [jsonVal, setJsonVal] = useState("");
  let modeLoaded = false;

  if (
    typeof window !== "undefined" &&
    typeof window.navigator !== "undefined"
  ) {
    require("codemirror/mode/javascript/javascript");
    modeLoaded = true;
  }

  let options = {
    theme: "default",
    tabSize: 2,
    lineWrapping: true,
    lint: true,
  };

  if (modeLoaded) {
    options.mode = {
      name: "javascript",
      json: true,
      statementIndent: 2,
    };
  }

  const handleTab = (e, val) => {
    e.preventDefault();
    setSelected(val);
  };

  const handleTabResponse = (e, val) => {
    e.preventDefault();
    setSelectedResponse(val);
  };

  const handleAddFields = () => {
    let newFields = { key: "", value: "" };
    setInputParamFields([...inputParamFields, newFields]);
  };

  const handleAddHeadersFields = () => {
    let newFields = { key: "", value: "" };
    setInputHeadersFields([...inputHeadersFields, newFields]);
  };

  const handleInputChange = (idx, ev) => {
    let data = [...inputParamFields];
    data[idx][ev.target.name] = ev.target.value;
    setInputParamFields(data);
  };

  const handleInputHeaderChange = (idx, ev) => {
    let data = [...inputHeadersFields];
    data[idx][ev.target.name] = ev.target.value;
    setInputHeadersFields(data);
  };

  const handleRemoveFields = (index) => {
    let data = [...inputParamFields];
    data.splice(index, 1);
    setInputParamFields(data);
  };

  const handleRemoveaderseHFields = (index) => {
    let data = [...inputHeadersFields];
    data.splice(index, 1);
    setInputHeadersFields(data);
  };

  const handleSendData = async () => {
    if (url.length <= 0) return alert("URL is empty");

    let data;
    try {
      data = JSON.parse(jsonVal || null);
    } catch (e) {
      alert("JSON data is malformed");
      return;
    }

    const res = await axios({
      url: url,
      method: method,
      params: arrToObject(inputParamFields),
      headers: arrToObject(inputHeadersFields),
      data,
    });

    setResponse(res);
  };

  const arrToObject = (arr) => {
    const res = arr.reduce((data, currentObj) => {
      if (currentObj.key === "" || currentObj.value === "") return data;

      return { ...data, [currentObj.key]: currentObj.value };
    }, {});

    return res;
  };

  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        config.metadata = { startTime: new Date() };
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function (response) {
        response.config.metadata.endTime = new Date();
        response.duration =
          response.config.metadata.endTime - response.config.metadata.startTime;
        return response;
      },
      function (error) {
        error.config.metadata.endTime = new Date();
        error.duration =
          error.config.metadata.endTime - error.config.metadata.startTime;
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <div>
      <Head>
        <meta name="description" content="API Tester by Andi" />
        <meta property="og:description" content="API Tester by Andi" />
        <meta name="twitter:description" content="API Tester by Andi" />

        <link rel="icon" href="/api.png" />

        <title>Andi S || API Tester</title>
      </Head>

      <main className="p-4">
        {/* input form */}
        <form>
          <div className="input-group mb-4">
            <select
              className="form-select flex-grow-0 w-auto"
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value={"GET"} defaultValue>
                GET
              </option>
              <option value={"POST"}>POST</option>
              <option value={"PUT"}>PUT</option>
              <option value={"DELETE"}>DELETE</option>
              <option value={"PATCH"}>PATCH</option>
            </select>
            <input
              required
              className="form-control"
              type={"url"}
              placeholder="https://example.com"
              onChange={(e) => setUrl(e.target.value)}
            />
            <div
              type="submit"
              className="btn btn-primary"
              onClick={handleSendData}
            >
              Send
            </div>
          </div>

          <ul className="nav nav-tabs" role={"tablist"}>
            <li className="nav-item" role={"presentation"}>
              <button
                className={selected == "query" ? "nav-link active" : "nav-link"}
                id="query-params-tab"
                onClick={(e) => handleTab(e, "query")}
              >
                Query Params
              </button>
            </li>
            <li className="nav-item" role={"presentation"}>
              <button
                className={
                  selected == "headers" ? "nav-link active" : "nav-link"
                }
                id="request-headers-tab"
                onClick={(e) => handleTab(e, "headers")}
              >
                Headers
              </button>
            </li>
            <li className="nav-item" role={"presentation"}>
              <button
                className={selected == "json" ? "nav-link active" : "nav-link"}
                id="json-tab"
                onClick={(e) => handleTab(e, "json")}
              >
                JSON
              </button>
            </li>
          </ul>

          <div className="tab-content p-3 border-top-0 border">
            <div
              className={
                selected == "query"
                  ? "tab-pane fade show active"
                  : "tab-pane fade"
              }
              id="query-params"
              role={"tabpanel"}
            >
              {inputParamFields.map((input, idx) => {
                return (
                  <div className="input-group my-2" key={idx}>
                    <input
                      type={"text"}
                      className="form-control"
                      name="key"
                      placeholder="Key"
                      value={input.key}
                      onChange={(event) => handleInputChange(idx, event)}
                    />
                    <input
                      type={"text"}
                      className="form-control"
                      name="value"
                      placeholder="Value"
                      value={input.value}
                      onChange={(event) => handleInputChange(idx, event)}
                    />
                    <div
                      className="btn btn-outline-danger"
                      onClick={() => handleRemoveFields(idx)}
                    >
                      Remove
                    </div>
                  </div>
                );
              })}
              <div
                className="mt-2 btn btn-outline-success"
                onClick={handleAddFields}
              >
                Add
              </div>
            </div>

            <div
              className={
                selected == "headers"
                  ? "tab-pane fade show active"
                  : "tab-pane fade"
              }
              id="request-headers"
              role={"tabpanel"}
            >
              {inputHeadersFields.map((input, idx) => {
                return (
                  <div className="input-group my-2" key={idx}>
                    <input
                      type={"text"}
                      className="form-control"
                      name="key"
                      placeholder="Key"
                      value={input.key}
                      onChange={(event) => handleInputHeaderChange(idx, event)}
                    />
                    <input
                      type={"text"}
                      className="form-control"
                      name="value"
                      placeholder="Value"
                      value={input.value}
                      onChange={(event) => handleInputHeaderChange(idx, event)}
                    />
                    <div
                      className="btn btn-outline-danger"
                      onClick={() => handleRemoveaderseHFields(idx)}
                    >
                      Remove
                    </div>
                  </div>
                );
              })}
              <div
                className="mt-2 btn btn-outline-success"
                onClick={handleAddHeadersFields}
              >
                Add
              </div>
            </div>
            <div
              className={
                selected == "json"
                  ? "tab-pane fade show active"
                  : "tab-pane fade"
              }
              id="json"
              role={"tabpanel"}
            >
              <div
                className="overflow-auto"
                style={{ maxHeight: "200px" }}
                id="json-editor"
              >
                <Codemirror
                  options={options}
                  value={jsonVal}
                  onBeforeChange={(editor, data, val) => setJsonVal(val)}
                />
              </div>
            </div>
          </div>
        </form>
        {/* response */}
        <div className="mt-5">
          <h3>Response</h3>
          <div className="d-flex my-2">
            <div className="me-3">
              Status: <span>{response && response.status}</span>
            </div>
            <div className="me-3">
              Time: <span>{response && response.duration}</span>ms
            </div>
            <div className="me-3">
              Size:{" "}
              <span>
                {Object.keys(response).length > 0 &&
                  prettyBytes(
                    JSON.stringify(response.data).length +
                      JSON.stringify(response.headers).length
                  )}
              </span>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs" role={"tablist"}>
          <li className="nav-item" role={"presentation"}>
            <button
              className={
                selectedResponse == "body-response"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={(e) => handleTabResponse(e, "body-response")}
            >
              Body
            </button>
          </li>
          <li className="nav-item" role={"presentation"}>
            <button
              className={
                selectedResponse == "headers-response"
                  ? "nav-link active"
                  : "nav-link"
              }
              id="request-headers-response-tab"
              onClick={(e) => handleTabResponse(e, "headers-response")}
            >
              Headers
            </button>
          </li>
        </ul>

        <div className="tab-content p-3 border-top-0 border">
          <div
            className={
              selectedResponse == "body-response"
                ? "tab-pane fade show active"
                : "tab-pane fade"
            }
            id="body-response-tab"
            ref={bodyRef}
            role={"tabpanel"}
          >
            <Codemirror
              options={options}
              autoCursor={false}
              value={JSON.stringify(response.data, null, 2)}
            />
          </div>

          <div
            className={
              selectedResponse == "headers-response"
                ? "tab-pane fade show active"
                : "tab-pane fade"
            }
            id="request-headers-response-tab"
            role={"tabpanel"}
          >
            <div className="container">
              {response.headers &&
                Object.keys(response.headers).map((key, i) => {
                  return (
                    <div className="row" key={i}>
                      <div className="col text-start">{key}</div>
                      <div className="col text-start"> : </div>
                      <div className="col-7 text-start">
                        {response.headers[key]}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
