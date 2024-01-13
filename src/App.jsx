import React from "react";
import ReactDOM from "react-dom/client.js";

import Header from "./components/Header.jsx";
import AirCallBody from "./components/AirCallBody.jsx";

const App = () => {
  return (
    <div className="appcontainer bg-dark-subtle rounded-3 position-relative col-xl-4 col-lg-5 col-md-7 col-sm-9 col-11 my-5">
      <Header />
      <AirCallBody />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);

export default App;
