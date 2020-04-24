import { Box, Container } from "theme-ui";

import InputForm from "../components/inputform";

export default ({}) => (
  <>
    <Box as="header" variant="headerLeft">
      <Container>
        <h1>Chameleon</h1>
      </Container>
    </Box>
    <InputForm namespace="/chameleon" />
  </>
);
