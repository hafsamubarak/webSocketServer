import { createRoot } from "react-dom/client";
import React, { Component } from "react";
import { w3cwebsocket } from "websocket";
import "antd/dist/antd.css";
import { Input, Typography, Card, Avatar } from "antd";
import "./index.css";
const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;
const client = new w3cwebsocket("ws://localhost:8000");
export default class App extends Component {
  state = {
    userName: "",
    isLogged: false,
    messages: [],
  };
  onButtonClicked = (value) => {
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: this.state.userName,
      })
    );
    this.setState({ searchVal: "" });
  };
  componentDidMount() {
    client.onopen = () => {
      console.log("Connected to server");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log(dataFromServer);
      if (dataFromServer.type === "message") {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.msg,
              user: dataFromServer.user,
            },
          ],
        }));
      }
    };
  }
  render() {
    return (
      <div className="main">
        {this.state.isLogged ? (
          <div>
            <div className="title">
              <Text type="secondary" style={{ fontSize: "36px" }}>
                WebSocket Chat
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: "50",
              }}
            >
              {this.state.messages.map((message) => (
                <Card
                  key={message.msg}
                  style={{
                    width: 300,
                    margin: "16px 4px 0 4px",
                    alignSelf:
                      this.state.userName === message.user
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Meta
                    avatar={
                      <Avatar
                        style={{ color: "#f56a00", backgroundColor: "efefef" }}
                        name={message.user.charAt(0).toUpperCase()}
                      />
                    }
                    title={message.user}
                    description={message.msg}
                  />
                </Card>
              ))}
            </div>
            <div className="bottom">
              <Search
                placeholder="input message and send"
                enterButton="Send"
                value={this.state.searchVal}
                size="large"
                onChange={(e) => this.setState({ searchVal: e.target.value })}
                onSearch={(value) => this.onButtonClicked(value)}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: "200px 40px" }}>
            <Search
              placeholder="input username"
              enterButton="Login"
              size="large"
              onSearch={(value) =>
                this.setState({ userName: value, isLogged: true })
              }
            />
          </div>
        )}
      </div>
    );
  }
}
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
