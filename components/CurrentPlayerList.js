import { PureComponent } from "react";
import { Box } from "theme-ui";
import theme from "../lib/theme";

export default class CurrentPlayerList extends PureComponent {
  render() {
    return (
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
        {this.props.submittedUsername &&
          this.props.submittedUsername.length > 0 && (
            <ret>
              <li key={this.props.submittedUsername}>
                {this.props.submittedUsername}
              </li>
            </ret>
          )}
        {this.props.currentUsers &&
          this.props.submittedRoom &&
          this.props.submittedRoom.length > 0 &&
          this.props.currentUsers.map((user) => {
            return user === this.props.submittedUsername ? null : (
              <li key={user}>{user}</li>
            );
          })}
      </Box>
    );
  }
}
