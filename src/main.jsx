import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import client from "./apollo/client";
import App from "./App";
import { store } from "./redux/store";
import { appTheme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ConfigProvider theme={appTheme}>
          <App />
        </ConfigProvider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);
