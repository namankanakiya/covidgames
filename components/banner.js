import { Box, Badge, Container, Heading } from "theme-ui";
import { ColorSwitcher } from "./nav";

export default () => (
  <Box
    as="header"
    sx={{
      bg: "primary",
      color: "white",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <ColorSwitcher
      sx={{
        color: "white",
        position: "absolute",
        top: [3, 4],
        right: [3, 4],
        width: "auto",
        height: "auto",
        ":focus,:hover": { color: "accent" },
      }}
    />
    <Container as="article" sx={{ pt: [4, 5], pb: [3, 4] }}>
      <Badge variant="header" sx={{ mt: [3, 0, -3] }}>
        Coranavirus Edition
      </Badge>
      <Heading
        as="h1"
        sx={{
          letterSpacing: "title",
          lineHeight: "title",
          fontFamily: "heading",
          color: "inverted",
          mt: [2, 3],
          mb: 4,
          "> span": {
            display: "block",
            fontSize: [5, 6],
            "@media (max-width: 22em)": {
              fontSize: 4,
            },
            "@media (min-width: 72em)": {
              fontSize: 7,
            },
          },
          kbd: {
            display: "inline-block",
            fontFamily: "inherit",
            WebkitTextStroke: "currentColor",
            WebkitTextStrokeWidth: ["2px", "4px"],
            WebkitTextFillColor: (theme) => theme.colors.primary,
            transition: "all .125s ease-in-out",
            ":hover": {
              color: "accent",
              textShadow: (theme) => `0 0 12px ${theme.colors.accent}`,
              transform: "rotate(-4deg) scale(1.025)",
            },
          },
        }}
      >
        <span>Games I've had</span>
        <span>time to code during</span>
        <span>
          the <kbd> coranvirus </kbd> outbreak
        </span>
      </Heading>
    </Container>
  </Box>
);
