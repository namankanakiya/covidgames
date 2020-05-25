import { Badge, BaseStyles, Box, Heading, Image } from "theme-ui";
import Player from "react-player";

export default ({ actions }) => {
  const theme = { color: "#FF1FC7", name: "How to Play" };
  const video = "https://youtu.be/Tgn2W4KIanY?t=12";
  const name = "Instructions";
  const HeadingWrapper = Box;
  const imageBase = "images/";
  return (
    <Box
      as="article"
      sx={{
        bg: "elevated",
        borderRadius: [0, "extra"],
        position: "relative",
      }}
    >
      <Box
        as="header"
        sx={{
          bg: theme.color,
          color: "white",
          py: [3, 4],
          px: [3, 4, 5],
          borderTopLeftRadius: [0, "extra"],
          borderTopRightRadius: [0, "extra"],
          position: "-webkit-sticky",
          position: "sticky",
          top: 0,
          zIndex: 4,
          a: { color: "white" },
        }}
      >
        <Box
          as="aside"
          sx={{
            position: ["relative", "absolute"],
            m: [-3, 0],
            mb: 0,
            top: 0,
            right: 0,
            display: "flex",
            flexDirection: ["row-reverse", "column"],
            justifyContent: ["flex-start", "center"],
            "a, button": {
              p: 3,
              color: "white",
              width: "auto",
              height: "auto",
            },
            "* + a": {
              mt: [null, -3],
            },
          }}
        >
          {actions}
        </Box>
        <HeadingWrapper target="_blank" sx={{ pr: 4 }}>
          <Heading
            as="h1"
            variant="headline"
            sx={{
              fontSize: [4, 5],
              color: "white",
              my: 0,
              display: "inline",
              mr: [3, 4],
            }}
          >
            {name}
          </Heading>
          <Badge
            variant="lg"
            sx={{
              bg: "snow",
              color: theme.color,
              mt: 2,
              verticalAlign: "bottom",
            }}
          >
            {theme.name}
          </Badge>
        </HeadingWrapper>
      </Box>
      <Box
        as="article"
        sx={{
          pt: 4,
          pb: [3, 4, 5],
          px: [3, 4, 5],
        }}
      >
        <Box
          sx={{
            my: [3, 4],
            "> div": {
              borderRadius: "default",
              overflow: "hidden",
              minHeight: [256, 384, 512],
              " + img": { mt: 4 },
            },
          }}
        >
          <h2>Gameplay</h2>
          {video && <Player url={video} width="100%" controls={true} />}
        </Box>
        <Box
          as="section"
          sx={{
            "* a": { color: theme.color },
            "p, li": { fontSize: 2, maxWidth: "copy" },
            "div:first-of-type": {
              borderRadius: "extra",
              overflow: "hidden",
            },
            "h4,h5,h6": { fontSize: 2 },
          }}
        >
          <h2>Setup</h2>
          <ol>
            <li>Join a room, with the shared room name, and your nickname</li>
            <ul>
              <li>
                If you are organizing the session for your friends, choose any
                room name you would like to use
              </li>
            </ul>
            <Image
              src={`${imageBase}joinRoom.png`}
              sx={{ width: "50%", borderRadius: "default" }}
            />
            <li>
              Once everyone has joined the room, decide which board you will be
              playing with. All of the options you have are in the dropdown at
              the bottom of the page.
            </li>
            <Image
              src={`${imageBase}dropdownClosed.png`}
              sx={{ width: "45%", borderRadius: "default" }}
            />
            <Image
              src={`${imageBase}dropdownExpanded.png`}
              sx={{ width: "45%", borderRadius: "default" }}
            />
            <li>Have the gamemaster select the button "Start Game".</li>
            <li>
              One person will be the Chameleon. They will get the text: "You are
              the chameleon". Everyone else will get a letter and number
              indicating the word they will be referring to this round. Everyone
              (including the Chameleon) will have a position which indicates the
              order in which you will play.
            </li>
            <Image
              src={`${imageBase}chameleonPlayer.png`}
              sx={{ width: "45%", borderRadius: "default" }}
            />
            <Image
              src={`${imageBase}nonChameleon.png`}
              sx={{ width: "35%", borderRadius: "default" }}
            />
          </ol>
        </Box>
      </Box>
    </Box>
  );
};
