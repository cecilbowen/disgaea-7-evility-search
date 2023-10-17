/* eslint-disable max-len */
import './App.css';
import EvilityTable from './components/EvilityTable';
import EVILITIES from './data/evilities.json';
import DLC_EVILITIES from './data/evilities_dlc.json';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import CategoryEditor from './components/CategoryEditor';
import EVILITY_CATEGORIES from './data/evility_categories.json';
import debounce from 'lodash/debounce';
import BuildList from './components/BuildList';
import Switch from '@mui/material/Switch';
import { getBuildFromString } from './util';

const CATEGORY_EDITOR = false;

const App = () => {
  const [evilities, setEvilities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterUnique, setFilterUnique] = useState(true);
  const [filterGeneric, setFilterGeneric] = useState(true);
  const [filterLearnable, setFilterLearnable] = useState(true);
  const [filterEnemy, setFilterEnemy] = useState(false);
  const [filterBaseGame, setFilterBaseGame] = useState(true);
  const [filterDlc, setFilterDlc] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("both");
  const [activeCats, setActiveCats] = useState(Object.values(EVILITY_CATEGORIES));
  const [builderActive, setBuilderActive] = useState(false);
  const [buildEvilities, setBuildEvilities] = useState([]);
  const [fixedClass, setFixedClass] = useState("Prinny");

  const loadBuild = (build, evs) => {
    evs = evs || evilities;
    const newBuildEvilities = getBuildFromString(build, evs);
    if (newBuildEvilities.length > 0) {
      setBuilderActive(true);
      setBuildEvilities(newBuildEvilities);
    }
  };

  useEffect(() => {
    if (evilities.length === 0) {
      const tempEvilities = [];
      for (const myEv of EVILITIES) {
        tempEvilities.push({ ...myEv, dlc: false });
        // matches in-game order of evilities
        if (myEv.id === 'EVILITY_ID_OPENER_GENERIC_5') {
          tempEvilities.push(...[...DLC_EVILITIES.map(x => {
            return { ...x, dlc: true };
          })]);
        }
      }

      // set unique, but also short, ids
      for (let i = 0; i < tempEvilities.length; i++) {
        const e = tempEvilities[i];
        e.cost = e.unique ? 1 : e.cost;
        e.number = i + 1;
      }

      setEvilities(tempEvilities);

      // now check to see if we have a build to load
      const url = new URL(window.location);
      const build = url.searchParams.get("build");
      if (build) {
        loadBuild(build, tempEvilities);
      }
    }
  }, []);

  if (evilities.length === 0) {
    return null;
  }

  // was used to manually set player evility categories
  if (CATEGORY_EDITOR) {
    const playerOnlyEvilities = evilities.slice(0).filter(x => !x.enemyOnly);

    return (
      <div className="App">
        <CategoryEditor evilities={playerOnlyEvilities} />
      </div>
    );
  }

  const addEvilityToBuild = evility => {
    if (!builderActive) { return; }
    const newBuildEvilities = [...buildEvilities];
    const has = newBuildEvilities.filter(x => x.id === evility.id)[0];
    if (!has) {
      newBuildEvilities.push(evility);
    }
    setBuildEvilities(newBuildEvilities);
  };

  const removeEvilityFromBuild = evility => {
    if (!builderActive) { return; }
    const newBuildEvilities = [...buildEvilities].filter(x => x.id !== evility.id);
    setBuildEvilities(newBuildEvilities);
  };

  const debouncedOnChange = debounce(ev => {
    setSearchText(ev.target.value);
  }, 300);

  const passFixedClass = cls => {
    setFixedClass(cls);
  };

  const renderEvCatCheckbox = ([k, v]) => {
    const isChecked = activeCats.includes(v);

    return <div style={{ display: 'flex', cursor: 'pointer', position: 'relative' }} key={k}>
      <Checkbox defaultChecked sx={{ opacity: 0 }}
        title={v}
        onChange={ev => {
          const checked = ev.target.checked;
          const tempActiveCats = [ ...activeCats ].filter(x => x !== v);
          if (checked) {
            tempActiveCats.push(v);
          }
          setActiveCats(tempActiveCats);
          console.log("cats", tempActiveCats);
        }} />
      <img src={`images/evility_categories/${k}.png`}
        style={{ objectFit: 'contain', position: 'absolute',
        opacity: isChecked ? 1 : 0.5,
        left: '5.5px', top: '5.5px', pointerEvents: 'none' }} />
    </div>;
  };

  return (
    <div className="App">
      <div style={{ display: "flex", flexWrap: 'wrap', margin: '1em 1em 0em 1em' }}>
        <TextField id="outlined-basic" label="Search evilities" variant="outlined"
          size="small"
          sx={{ display: "flex", width: '40em', marginRight: '1em' }}
          onChange={ev => debouncedOnChange(ev)} />

        <RadioGroup
          row
          aria-labelledby="radio-group-search-label"
          name="row-radio-group-search-label"
          defaultValue="both"
          onChange={ev => setSearchCriteria(ev.target.value)}
        >
          <FormControlLabel value="name" control={<Radio />} label="Name" />
          <FormControlLabel value="description" control={<Radio />} label="Description" />
          <FormControlLabel value="both" control={<Radio />} label="Both" />
        </RadioGroup>
      </div>

      <div style={{ display: "flex", flexWrap: 'wrap', margin: "0em 1em" }}>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Unique"
          onChange={ev => setFilterUnique(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Generic"
          onChange={ev => setFilterGeneric(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Player"
          onChange={ev => setFilterLearnable(ev.target.checked)} />
        <FormControlLabel control={<Checkbox />} label="Enemy" sx={{ color: 'purple' }}
          onChange={ev => setFilterEnemy(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Base Game"
          onChange={ev => setFilterBaseGame(ev.target.checked)} />
        <FormControlLabel control={<Checkbox defaultChecked />} label="DLC" sx={{ fontStyle: 'italic' }}
          onChange={ev => setFilterDlc(ev.target.checked)} />
        <FormControlLabel control={<Switch checked={builderActive} />} label="Toggle Builder"
          onChange={ev => setBuilderActive(ev.target.checked)} />
      </div>

      <div style={{ display: "flex", flexWrap: 'wrap', margin: "0em 0.6em" }}>
        {Object.entries(EVILITY_CATEGORIES).map(x => renderEvCatCheckbox(x))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
        <EvilityTable evilities={evilities} addEvilityToBuild={addEvilityToBuild}
          textFilter={searchText}
          searchCriteria={searchCriteria}
          filters={{
            unique: filterUnique,
            generic: filterGeneric,
            learnable: filterLearnable,
            enemy: filterEnemy,
            baseGame: filterBaseGame,
            dlc: filterDlc,
            categories: activeCats
          }}
          width={builderActive ? '55vw' : undefined}
          building={builderActive}
          fixed={fixedClass}
        />
        {builderActive && <BuildList evilities={buildEvilities}
          passFixedClass={passFixedClass}
          loadBuild={loadBuild}
          removeEvilityFromBuild={removeEvilityFromBuild} />}
      </div>

      <div>
        <small>
        <a href="https://github.com/cecilbowen/disgaea-7-evility-search">Source Code</a>&nbsp;
          References:&nbsp;
          <a href="https://gamefaqs.gamespot.com/boards/378248-disgaea-7-vows-of-the-virtueless/80587648">one</a>&nbsp;
          <a href="https://gamefaqs.gamespot.com/boards/378250-disgaea-7-vows-of-the-virtueless/80592079">two</a>&nbsp;
          <a href="https://docs.google.com/spreadsheets/d/14HQrRhglcYtVkY6Uk4-XgqtUVMq6qmBQYtjJ6Ro-_WA/edit#gid=2122935455">three</a>
        </small>
      </div>
    </div>
  );
};

export default App;
