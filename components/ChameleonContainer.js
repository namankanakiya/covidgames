import { Component } from "react";
import io from "socket.io-client";
import { Container } from "theme-ui";

import ChameleonSelect from "../pages/chameleonBoard";
import RegisterUser from "./RegisterUser";
import Headings from "./Headings";
import CurrentPlayerList from "./CurrentPlayerList";
import GameNotStarted from "./GameNotStarted";
import GameStarted from "./GameStarted";

export default class ChameleonContainer extends Component {
  // React Lifecycle methods
  state = {
    username: "",
    currentUsers: [],
    submittedUsername: "",
    usernameRejected: false,
    allowStartGame: false,
    chameleonAssigned: false,
    gridAssigned: "",
    order: -1,
    gameStartedOthers: false,
    disconnected: "",
    room: "",
    submittedRoom: "",
  };

  componentDidMount() {
    this.socket = io("/chameleon");
    this.socket.on("connectedUsers", this.handleCurrentUsers);
    this.socket.on("acceptedUser", this.handleAcceptedUser);
    this.socket.on("rejectedUser", this.handleRejectedUser);
    this.socket.on("leftGame", this.handleLeftGame);
    this.socket.on("allowStartGame", this.handleAllowStartGame);
    this.socket.on("denyStartGame", this.handleDenyStartGame);
    this.socket.on("assignedGrid", this.handleAssignedGrid);
    this.socket.on("assignedChameleon", this.handleAssignedChameleon);
    this.socket.on("resetGame", this.handleResetGameConfirmed);
    this.socket.on("disconnect", this.handleDisconnect);
  }

  componentWillUnmount() {
    this.socket.off("connectedUsers", this.handleCurrentUsers);
    this.socket.close();
  }

  render() {
    return (
      <>
        {/* No user registered */}
        {!(this.state.submittedUsername.length > 0) && (
          <RegisterUser
            handleSubmit={this.handleSubmit}
            handleChangeRoom={this.handleChangeRoom}
            room={this.state.room}
            usernameRejected={this.state.usernameRejected}
            handleChange={this.handleChange}
            username={this.state.username}
          />
        )}
        <Container sx={{ pb: [4, null, 5] }}>
          {/* Current user submitted */}
          {((this.state.currentUsers &&
            this.state.currentUsers.length > 0 &&
            this.state.submittedRoom &&
            this.state.submittedRoom.length > 0) ||
            (this.state.submittedUsername &&
              this.state.submittedUsername.length > 0)) && (
            <Headings submittedRoom={this.state.submittedRoom} />
          )}
          {/* Current players List */}
          <CurrentPlayerList
            submittedUsername={this.state.submittedUsername}
            currentUsers={this.state.currentUsers}
            submittedRoom={this.state.submittedRoom}
          />
          {/* Game not started */}
          {!this.isGameStarted() &&
            this.state.submittedUsername &&
            this.state.submittedUsername.length > 0 && (
              <GameNotStarted
                allowStartGame={this.state.allowStartGame}
                gameStartedOthers={this.state.gameStartedOthers}
                handleStartGame={this.handleStartGame}
                handleLeaveGame={this.handleLeaveGame}
              />
            )}
          {/* Game Started */}
          {this.isGameStarted() && (
            <GameStarted
              chameleonAssigned={this.state.chameleonAssigned}
              gridAssigned={this.state.gridAssigned}
              order={this.state.order}
              handleResetGame={this.handleResetGame}
            />
          )}
          {/* Chameleon Tables */}
          <ChameleonSelect />
        </Container>
      </>
    );
  }

  // Class functions
  handleDisconnect = () => {
    this.joinGame();
    this.setState({
      currentUsers: [],
      submittedUsername: "",
      usernameRejected: false,
      allowStartGame: false,
      gameStartedOthers: false,
      disconnected: "true",
      submittedRoom: "",
    });
  };

  handleAssignedChameleon = (order) => {
    this.setState({ chameleonAssigned: true, order: order });
  };

  handleAssignedGrid = (grid) => {
    this.setState({ gridAssigned: grid[0], order: grid[1] });
  };

  handleAllowStartGame = () => {
    if (!this.state.allowStartGame) {
      this.setState({ allowStartGame: true });
    }
  };

  handleDenyStartGame = () => {
    if (this.state.allowStartGame) {
      this.setState({ allowStartGame: false });
    }
    this.handleResetGameConfirmed();
  };

  handleLeftGame = (user) => {
    this.setState({ submittedUsername: "", submittedRoom: "" });
  };

  handleCurrentUsers = (users) => {
    this.setState({ currentUsers: users });
  };

  handleAcceptedUser = (user) => {
    this.setState({
      submittedUsername: user[0],
      gameStartedOthers: user[1],
      submittedRoom: this.state.room,
      usernameRejected: false,
    });
  };

  handleRejectedUser = () => {
    this.setState({ usernameRejected: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // create user to send to socket
    if (!this.joinGame()) this.setState({ usernameRejected: true });
  };

  handleChange = (event) => {
    this.setState({
      username: event.target.value && this.sanitizeString(event.target.value),
      usernameRejected: false,
    });
  };

  handleChangeRoom = (event) => {
    this.setState({
      room: event.target.value && this.sanitizeString(event.target.value),
      usernameRejected: false,
    });
  };

  sanitizeString = (str) => {
    str = str.replace(/[^a-z0-9áéíóúñü]/gim, "");
    return str.trim().toLowerCase();
  };

  handleLeaveGame = () => {
    this.socket.emit("leaveGame", this.state.username);
  };

  handleStartGame = () => {
    this.socket.emit("startGame");
  };

  handleResetGame = () => {
    this.socket.emit("resetGame");
  };

  handleResetGameConfirmed = () => {
    this.setState({
      chameleonAssigned: false,
      gridAssigned: "",
      order: -1,
      gameStartedOthers: false,
      disconnected: "",
    });
  };

  isGameStarted = () => {
    return (
      this.state.chameleonAssigned ||
      (this.state.gridAssigned && this.state.gridAssigned.length > 0)
    );
  };

  joinGame = () => {
    if (
      this.state.username &&
      this.state.username.length > 0 &&
      this.state.room &&
      this.state.room.length > 0
    ) {
      this.socket.emit("user", [this.state.username, this.state.room]);
      return true;
    } else {
      return false;
    }
  };
}
