import { Component } from "react";
import io from "socket.io-client";
import fetch from "isomorphic-fetch";
import { Box, Container, Heading, Label, Input, Button } from "theme-ui";

import CTA from "../components/cta";

export default class InputForm extends Component {
  state = {
    username: "",
    currentUsers: [],
  };

  componentDidMount() {
    this.socket = io("/test");
    this.socket.on("connectedUsers", this.handleCurrentUsers);
    console.log("getting server");
    fetch("/users")
      .then((value) => {
        return value.json();
      })
      .then((data) => {
        this.setState({ currentUsers: data });
      })
      .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    this.socket.off("connectedUsers", this.handleCurrentUsers);
    this.socket.close();
  }

  handleCurrentUsers = (users) => {
    this.setState({ currentUsers: users });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // create user to send to socket
    if (this.state.username && this.state.username.length > 0) {
      this.socket.emit("user", this.state.username);
    }
  };

  handleChange = (event) => {
    this.setState({ username: event.target.value });
  };

  render() {
    return (
      <>
        <Box
          as="form"
          sx={{ bg: "sheet", py: [4, 5] }}
          onSubmit={this.handleSubmit}
        >
          <Container
            sx={{
              position: "relative",
              strong: { color: "accent" },
              "> p": { fontSize: [2, 3], maxWidth: "copyPlus", my: [2, 3] },
            }}
          >
            <Heading sx={{ variant: "text.title", fontSize: [4, 5] }}>
              Enter Game
            </Heading>
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              mb={3}
              onChange={this.handleChange}
              value={this.state.username}
            />
            <Button>Submit</Button>
          </Container>
        </Box>
        <Container
          id="currentUsers"
          as="article"
          sx={{ py: [3, 4], mt: [3, 4], mb: [5, 6] }}
        >
          <Heading sx={{ variant: "text.title", fontSize: [4, 5] }}>
            Current users
          </Heading>
          <ul>
            {this.state.currentUsers &&
              this.state.currentUsers.map((user) => {
                return <li key={user}>{user}</li>;
              })}
          </ul>
          <CTA
            primary={["/judges", "Meet the judges"]}
            secondary={["/projects", "See all projects"]}
            sx={{ mt: [3, 4] }}
          />
        </Container>
      </>
    );
  }
}
