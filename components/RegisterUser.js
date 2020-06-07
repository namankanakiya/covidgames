import { PureComponent } from "react";
import { Box, Container, Heading, Label, Input, Button, Flex } from "theme-ui";

export default class RegisterUser extends PureComponent {
  render() {
    return (
      <Box
        as="form"
        sx={{ py: [4, 5], color: "primary" }}
        onSubmit={this.props.handleSubmit}
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
          <Flex sx={{ flexWrap: "wrap" }}>
            <Box
              sx={{
                flex: "1 1 auto",
                paddingRight: "10px",
              }}
            >
              <Label htmlFor="roomname">Room Name</Label>
              <Input
                name="roomname"
                mb={3}
                onChange={this.props.handleChangeRoom}
                value={this.props.room}
                sx={{
                  backgroundColor: this.props.usernameRejected ? "red" : null,
                }}
              />
            </Box>
            <Box
              sx={{
                flex: "1 1 auto",
                paddingRight: "10px",
              }}
            >
              <Label htmlFor="username">Nickname</Label>
              <Input
                name="username"
                mb={3}
                onChange={this.props.handleChange}
                value={this.props.username}
                sx={{
                  backgroundColor: this.props.usernameRejected ? "red" : null,
                }}
              />
            </Box>
          </Flex>
          {this.props.usernameRejected && (
            <Label sx={{ color: "red", marginTop: "-15px", mb: "15px" }}>
              {this.props.username && this.props.username.length > 0
                ? "That nickname is taken, please choose another, or change the room."
                : "Please enter a nickname / roomid"}
            </Label>
          )}
          <Button>Submit</Button>
        </Container>
      </Box>
    );
  }
}
