import { Component } from "react";
import { Box, Container, Select } from "theme-ui";
import boards from "../lib/chameleonBoards.json";

export default class ChameleonSelect extends Component {
  state = {
    selectedGame: "",
  };

  handleChange = (event) => {
    this.setState({ selectedGame: event.target.value });
  };

  render() {
    let currentSelectedVal = undefined;
    if (this.state.selectedGame && this.state.selectedGame.length > 0) {
      console.log(boards);
      currentSelectedVal = boards.find((value) => {
        if (this.state.selectedGame === value.name) {
          return true;
        }
      });
    }
    console.log(currentSelectedVal);
    let words;
    let name;
    if (currentSelectedVal) {
      words = currentSelectedVal.words;
      name = currentSelectedVal.name;
    }
    return (
      <Box as="header" variant="headerLeft">
        <Select
          value={this.state.selectedGame}
          onChange={this.handleChange}
          placeholder="Select Value"
        >
          <option>Select a game</option>
          {boards.map(({ name, words }) => (
            <option>{name}</option>
          ))}
        </Select>

        {name && name.length > 0 && words && words.length > 0 && (
          <Container
            sx={{
              "> table": {
                my: [2, 3],
                textAlign: "center",
                tableLayout: "fixed",
                wordBreak: "break-word",
              },
              th: { color: "primary", textAlign: "center" },
              td: { mx: "20px" },
              tr: { verticalAlign: "center" },
            }}
          >
            <h1>{name}</h1>
            <table className="table table-responsive-xl">
              <tr>
                <th></th>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>D</th>
              </tr>
              <tr>
                <th>1</th>
                <td>{words[0]}</td>
                <td>{words[1]}</td>
                <td>{words[2]}</td>
                <td>{words[3]}</td>
              </tr>
              <tr>
                <th>2</th>
                <td>{words[4]}</td>
                <td>{words[5]}</td>
                <td>{words[6]}</td>
                <td>{words[7]}</td>
              </tr>
              <tr>
                <th>3</th>
                <td>{words[8]}</td>
                <td>{words[9]}</td>
                <td>{words[10]}</td>
                <td>{words[11]}</td>
              </tr>
              <tr>
                <th>4</th>
                <td>{words[12]}</td>
                <td>{words[13]}</td>
                <td>{words[14]}</td>
                <td>{words[15]}</td>
              </tr>
            </table>
          </Container>
        )}
      </Box>
    );
  }
}
