/* eslint-disable max-len */
import './App.css';
import EvilityTable from './components/EvilityTable';
import EVILITIES from './data/evilities.json';
import DLC_EVILITIES from './data/evilities_dlc.json';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
  const [searchName, setSearchName] = useState(true);
  const [searchDescription, setSearchDescription] = useState(true);
  const [searchSource, setSearchSource] = useState(true);
  const [activeCats, setActiveCats] = useState(Object.values(EVILITY_CATEGORIES));
  const [builderActive, setBuilderActive] = useState(false);
  const [buildEvilities, setBuildEvilities] = useState([]);
  const [fixedClass, setFixedClass] = useState("Prinny");
  const [showNumbers, setShowNumbers] = useState(false);

  const loadBuild = (build, evs) => {
    evs = evs || evilities;
    const newBuildEvilities = getBuildFromString(build, evs);
    if (newBuildEvilities.length > 0) {
      setBuilderActive(true);
      setBuildEvilities(newBuildEvilities);
    }
  };

  const clearBuild = () => {
    setBuildEvilities([]);
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

  const renderEvAll = () => {
    const allCategoriesActive = activeCats.length === Object.values(EVILITY_CATEGORIES).length;

    return <div style={{
        display: 'flex', cursor: 'pointer',
        position: 'relative'
      }}>
      <Checkbox defaultChecked sx={{ opacity: 0 }}
        title="Toggle All"
        onContextMenu={ev => {
          ev.preventDefault();
          const tempActiveCats = Object.values(EVILITY_CATEGORIES);
          setActiveCats(tempActiveCats);
        }}
        onClick={() => {
          let tempActiveCats = Object.values(EVILITY_CATEGORIES);
          if (allCategoriesActive) {
            tempActiveCats = [];
          }

          setActiveCats(tempActiveCats);
        }} />
      <img src={`images/evility_categories/All.png`}
        style={{ objectFit: 'contain', position: 'absolute',
        opacity: allCategoriesActive ? 1 : 0.5,
        left: '5.5px', top: '5.5px', pointerEvents: 'none' }} />
    </div>;
  };

  const renderEvCatCheckbox = ([k, v]) => {
    const isChecked = activeCats.includes(v);

    return <div style={{ display: 'flex', cursor: 'pointer', position: 'relative' }} key={k}>
      <Checkbox checked={isChecked} sx={{ opacity: 0 }}
        title={v}
        onContextMenu={ev => {
          ev.preventDefault();
          const tempActiveCats = [v];
          setActiveCats(tempActiveCats);
        }}
        onChange={ev => {
          const checked = ev.target.checked;
          const tempActiveCats = [ ...activeCats ].filter(x => x !== v);
          if (checked) {
            tempActiveCats.push(v);
          }
          setActiveCats(tempActiveCats);
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

        <div style={{ display: "flex", flexWrap: 'wrap', margin: "0em 0em" }}>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Name"
            onChange={ev => setSearchName(ev.target.checked)} />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Description"
            onChange={ev => setSearchDescription(ev.target.checked)} />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Source"
            onChange={ev => setSearchSource(ev.target.checked)} />
        </div>
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
        {renderEvAll()}
        {Object.entries(EVILITY_CATEGORIES).map(x => renderEvCatCheckbox(x))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
        <EvilityTable evilities={evilities} addEvilityToBuild={addEvilityToBuild}
          textFilter={searchText}
          searches={{
            name: searchName,
            description: searchDescription,
            source: searchSource
          }}
          filters={{
            unique: filterUnique,
            generic: filterGeneric,
            learnable: filterLearnable,
            enemy: filterEnemy,
            baseGame: filterBaseGame,
            dlc: filterDlc,
            categories: activeCats
          }}
          building={builderActive}
          fixed={fixedClass}
          showNumbers={showNumbers}
        />
        {builderActive && <BuildList evilities={buildEvilities}
          passFixedClass={passFixedClass}
          loadBuild={loadBuild}
          clearBuild={clearBuild}
          removeEvilityFromBuild={removeEvilityFromBuild} />}
      </div>

      <div>
        <small>
          <span onClick={() => setShowNumbers(!showNumbers)} title="Toggle Numbers" style={{ cursor: 'pointer' }}>{showNumbers ? '★' : '☆'}</span> |&nbsp;
          <a href="https://github.com/cecilbowen/disgaea-7-evility-search">Source Code</a> |
          References:&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://gamefaqs.gamespot.com/boards/378248-disgaea-7-vows-of-the-virtueless/80587648">one</a>&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://gamefaqs.gamespot.com/boards/378250-disgaea-7-vows-of-the-virtueless/80592079">two</a>&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/spreadsheets/d/14HQrRhglcYtVkY6Uk4-XgqtUVMq6qmBQYtjJ6Ro-_WA/edit#gid=2122935455">three</a>
        </small>
      </div>
    </div>
  );
};

export default App;
