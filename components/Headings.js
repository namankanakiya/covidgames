import { PureComponent } from "react";
import { Heading } from "theme-ui";

export default class Headings extends PureComponent {
  render() {
    return (
      <>
        <Heading
          sx={{
            variant: "text.subheadline",
            fontSize: [3, 4],
            color: "secondary",
          }}
        >
          Room: {this.props.submittedRoom}
        </Heading>
        <Heading
          sx={{
            variant: "text.subheadline",
            fontSize: [2, 3],
            color: "secondary",
          }}
        >
          Current Players
        </Heading>
      </>
    );
  }
}
