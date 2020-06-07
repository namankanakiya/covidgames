import { PureComponent } from "react";
import { Box, Container, Button } from "theme-ui";

export default class GameNotStarted extends PureComponent {
  render() {
    return (
      <Container sx={{ my: "10px" }}>
        <Box as="ul" variant="list" sx={{ display: "flex" }}>
          {this.props.allowStartGame && !this.props.gameStartedOthers && (
            <Button onClick={this.props.handleStartGame}>Start Game</Button>
          )}
          {this.props.gameStartedOthers && (
            <div>
              <p>Others playing, please wait</p>
            </div>
          )}
          <Button
            onClick={this.props.handleLeaveGame}
            sx={{ marginLeft: "10px" }}
          >
            Leave Game
          </Button>
        </Box>
      </Container>
    );
  }
}
