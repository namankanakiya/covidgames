import { Box, Container, Link, NavLink } from "theme-ui";
import { useState } from "react";

import ProjectModal from "../components/project-modal";
import InputForm from "../components/inputform";

export default ({}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };
  const linkEffect = {
    fontSize: 1,
    borderRadius: "circle",
    color: "blue",
    transition: "box-shadow .125s ease-in-out",
    ":hover,:focus": {
      color: "blue",
      boxShadow: "0 0 0 2px",
      outline: "none",
    },
  };
  return (
    <>
      <Box as="header" variant="headerLeft">
        <Container>
          <h1>Chameleon</h1>
          <Link
            onClick={(e) => {
              if (!e.metaKey) {
                e.preventDefault();
                setOpen(true);
              }
              // router.push(router.pathname, `/projects/${id}`, { shallow: true })
            }}
          >
            <NavLink sx={{ ...linkEffect, px: 2, py: 1 }}>How to Play</NavLink>
          </Link>
        </Container>
      </Box>
      {open && (
        <ProjectModal open={open} onClose={closeModal} name="someName" />
      )}
      <InputForm namespace="/chameleon" />
    </>
  );
};
