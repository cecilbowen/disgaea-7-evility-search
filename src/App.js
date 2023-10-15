import './App.css';
import EvilityTable from './components/EvilityTable';
import EVILITIES from './data/evilities.json';
import DLC_EVILITIES from './data/evilities_dlc.json';
import { TextField } from '@mui/material';
import React, { useState } from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Paper from '@mui/material/Paper';

const App = () => {
  const evilities = [ ...EVILITIES.map(x => {
    return { ...x, dlc: false };
  }), ...DLC_EVILITIES.map(x => {
    return { ...x, dlc: true };
  })];
  const [searchText, setSearchText] = useState("");
  const [filterUnique, setFilterUnique] = useState(true);
  const [filterGeneric, setFilterGeneric] = useState(true);
  const [filterLearnable, setFilterLearnable] = useState(true);
  const [filterEnemy, setFilterEnemy] = useState(false);
  const [filterBaseGame, setFilterBaseGame] = useState(true);
  const [filterDlc, setFilterDlc] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("both");

  return (
    <div className="App">
      <div style={{ display: "flex", margin: '1em' }}>
        <TextField id="outlined-basic" label="Search evilities" variant="outlined"
          size="small"
          sx={{ display: "flex", width: '40em' }}
          onChange={ev => setSearchText(ev.target.value)} />

        <RadioGroup
          row
          aria-labelledby="radio-group-search-label"
          name="row-radio-group-search-label"
          defaultValue="both"
          sx={{ marginLeft: '1em' }}
          onChange={ev => setSearchCriteria(ev.target.value)}
        >
          <FormControlLabel value="name" control={<Radio />} label="Name" />
          <FormControlLabel value="description" control={<Radio />} label="Description" />
          <FormControlLabel value="both" control={<Radio />} label="Both" />
        </RadioGroup>
      </div>

      <div style={{ display: "flex", margin: "1em" }}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Unique"
          onChange={ev => setFilterUnique(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Generic"
          onChange={ev => setFilterGeneric(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Learnable"
          onChange={ev => setFilterLearnable(ev.target.checked)} />
        <FormControlLabel control={<Checkbox />} label="Enemy" sx={{ color: 'purple' }}
          onChange={ev => setFilterEnemy(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Base Game"
          onChange={ev => setFilterBaseGame(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="DLC" sx={{ fontStyle: 'italic' }}
          onChange={ev => setFilterDlc(ev.target.checked)} />
      </div>
      <div style={{ margin: "1em" }}>
        <EvilityTable evilities={evilities} textFilter={searchText} filters={{
          unique: filterUnique,
          generic: filterGeneric,
          learnable: filterLearnable,
          enemy: filterEnemy,
          baseGame: filterBaseGame,
          dlc: filterDlc
        }}
        searchCriteria={searchCriteria} />
      </div>
      <div style={{ position: 'absolute', right: '1em', bottom: '0px' }}>
        <small>
        <a href="https://github.com/cecilbowen/disgaea-7-evility-search">Source Code</a>&nbsp;
          References:&nbsp;
          <a href="https://gamefaqs.gamespot.com/boards/378248-disgaea-7-vows-of-the-virtueless/80587648">one</a>&nbsp;
          <a href="https://gamefaqs.gamespot.com/boards/378250-disgaea-7-vows-of-the-virtueless/80592079">two</a>&nbsp;
        </small>
      </div>
    </div>
  );
};

export default App;
