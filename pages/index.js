import axios from "axios";
import { DateTime } from "luxon";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {
  const [selected, setSelected] = useState("query");
  const [selectedResponse, setSelectedResponse] = useState("body-response");
  const [response, setResponse] = useState({});
  const [method, setMethod] = useState("");
  const [url, setUrl] = useState("");
  const [inputParamFields, setInputParamFields] = useState([
    { key: "", value: "" },
  ]);

  const [inputHeadersFields, setInputHeadersFields] = useState([
    { key: "", value: "" },
  ]);

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
    const res = await axios({
      url: url,
      method: method,
      params: arrToObject(inputParamFields),
      headers: arrToObject(inputHeadersFields),
    });

    console.log(res);
    setResponse(res);
  };

  const arrToObject = (arr) => {
    const res = arr.reduce((data, currentObj) => {
      if (currentObj.key === "" || currentObj.value === "") return data;

      return { ...data, [currentObj.key]: currentObj.value };
    }, {});

    return res;
  };

  const updateEndTime = (response) => {
    console.log(response);
    // response.customData = response.customData || {};
    // response.customData.time =
    //   new DateTime.now() - response.config.customData.startTime;
    return response;
  };

  useEffect(() => {
    // axios.interceptors.request.use((request) => {
    //   request.customData = request.customData || {};
    //   request.customData.startTime = new DateTime.now();
    //   return request;
    // });
    // axios.interceptors.response.use(updateEndTime, (e) => {
    //   // Promise.reject(updateEndTime(e.response));
    //   console.log(e);
    //   return e;
    // });
  }, []);

  return (
    <div>
      <Head>
        <title>Andi Saputro || Postman Clone</title>
        <meta name="description" content="Postman Clone by Andi Saputro" />
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
              ></div>
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
              Time: <span></span>ms
            </div>
            <div className="me-3">
              Size: <span></span>
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
              id="body-response-tab"
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
            role={"tabpanel"}
          >
            body
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
