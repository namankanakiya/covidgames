import { Component } from "react";
import io from "socket.io-client";
import fetch from "isomorphic-fetch";
import { Box, Container, Heading, Label, Input, Button } from "theme-ui";
import theme from "../lib/theme";

export default class InputForm extends Component {
  state = {
    username: "",
    currentUsers: [],
    submittedUsername: "",
    usernameRejected: false,
  };

  componentDidMount() {
    this.socket = io(this.props.namespace);
    this.socket.on("connectedUsers", this.handleCurrentUsers);
    this.socket.on("acceptedUser", this.handleAcceptedUser);
    this.socket.on("rejectedUser", this.handleRejectedUser);
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

  handleAcceptedUser = (user) => {
    this.setState({ submittedUsername: user });
  };

  handleRejectedUser = () => {
    this.setState({ usernameRejected: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // create user to send to socket
    if (this.state.username && this.state.username.length > 0) {
      this.socket.emit("user", this.state.username);
    }
  };

  handleChange = (event) => {
    this.setState({ username: event.target.value, usernameRejected: false });
  };

  render() {
    return (
      <>
        {!(this.state.submittedUsername.length > 0) && (
          <Box
            as="form"
            sx={{ py: [4, 5], color: "primary" }}
            onSubmit={this.handleSubmit}
          >
            <Container
              sx={{
                position: "relative",
                strong: { color: "accent" },
                "> p": { fontSize: [2, 3], maxWidth: "copyPlus", my: [2, 3] },
              }}
            >
              <Heading
                sx={{
                  variant: "text.subheadline",
                  fontSize: [3, 4],
                  color: "secondary",
                }}
              >
                Enter Game
              </Heading>
              <Label htmlFor="username">Username</Label>
              <Input
                name="username"
                mb={3}
                onChange={this.handleChange}
                value={this.state.username}
                sx={{
                  backgroundColor: this.state.usernameRejected ? "red" : null,
                }}
              />
              {this.state.usernameRejected && (
                <Label sx={{ color: "red", marginTop: "-15px", mb: "15px" }}>
                  That username is taken, please choose another
                </Label>
              )}
              <Button>Submit</Button>
            </Container>
          </Box>
        )}
        <Container sx={{ pb: [4, null, 5] }}>
          {(this.state.currentUsers.length > 0 ||
            this.state.submittedUsername.length > 0) && (
            <Heading
              sx={{
                variant: "text.subheadline",
                fontSize: [3, 4],
                color: "secondary",
              }}
            >
              Current Players
            </Heading>
          )}
          <Box
            as="ul"
            variant="list"
            sx={{
              ret: {
                display: "inline-block",
                fontFamily: "inherit",
                color: theme.colors.primary,
              },
            }}
          >
            {this.state.submittedUsername &&
              this.state.submittedUsername.length > 0 && (
                <ret>
                  <li key={this.state.submittedUsername}>
                    {this.state.submittedUsername}
                  </li>
                </ret>
              )}
            {this.state.currentUsers &&
              this.state.currentUsers.map((user) => {
                return user === this.state.submittedUsername ? null : (
                  <li key={user}>{user}</li>
                );
              })}
          </Box>
        </Container>
      </>
    );
  }
}
