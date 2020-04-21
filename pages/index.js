import { Component } from "react";
import Banner from "../components/banner";
import CTA from "../components/cta";
import { Container, Heading } from "theme-ui";
// import Contributors from '../components/contributors'

export default class Index extends Component {
  render() {
    return (
      <>
        <Banner />
        {/* <Contributors titles={titles} /> */}
        <Container
          id="currentUsers"
          as="article"
          sx={{ py: [3, 4], mt: [3, 4], mb: [5, 6] }}
        >
          <Heading sx={{ variant: "text.title", fontSize: [4, 5] }}>
            Games
          </Heading>
          <CTA
            primary={["/projects", "See all games"]}
            secondary={["/chameleon", "Play Chameleon"]}
            sx={{ mt: [3, 4] }}
          />
        </Container>
      </>
    );
  }
}
