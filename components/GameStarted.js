import { PureComponent } from "react";
import { Box, Container, Button } from "theme-ui";

export default class GameNotStarted extends PureComponent {
  render() {
    return (
      <Container>
        <Box>
          {this.props.chameleonAssigned && <h1>You are the chameleon</h1>}
          {this.props.gridAssigned && this.props.gridAssigned.length > 0 && (
            <h1>{this.props.gridAssigned}</h1>
          )}
          {this.props.order > 0 && <h1>Position: {this.props.order}</h1>}
          <Button onClick={this.props.handleResetGame}>Reset Game</Button>
        </Box>
      </Container>
    );
  }
}
