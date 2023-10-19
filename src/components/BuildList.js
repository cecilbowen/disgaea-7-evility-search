import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import LoadIcon from '@mui/icons-material/FolderOpen';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import { generateRandomName } from '../util';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: 'lightblue !important'
  }
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BuildList = ({ evilities, removeEvilityFromBuild, passFixedClass, loadBuild, clearBuild }) => {
  const [charClass, setCharClass] = useState("Prinny");
  const [tooManyFixedEvilities, setTooManyFixedEvilities] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [buildName, setBuildName] = useState(generateRandomName());
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalOpenL, setModalOpenL] = React.useState(false);
  const [stashedBuilds, setStashedBuilds] = useState([]);
  const [buildToLoad, setBuildToLoad] = useState();

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleModalOpenL = () => setModalOpenL(true);
  const handleModalCloseL = () => {
    setModalOpenL(false);
    setBuildToLoad(undefined);
    setStashedBuilds([]);
  };

  useEffect(() => {
    // determines class based on fixed evilities
    const fixedEvilities = Array.from(new Set(evilities.filter(x => x.fixed).map(x => x.fixed)));
    const newClass = fixedEvilities[0];

    if (newClass) {
      setCharClass(newClass);

      if (fixedEvilities.length > 1) {
        setTooManyFixedEvilities(true);
      } else {
        setTooManyFixedEvilities(false);
      }
    } else {
      setCharClass("Prinny");
    }
  }, [evilities]);

  useEffect(() => {
    passFixedClass(charClass);
  }, [charClass]);

  useEffect(() => {
    if (stashedBuilds.length > 0 && !modalOpenL) {
      handleModalOpenL();
    }
  }, [stashedBuilds]);

  // group unique evilities together
  evilities.sort((a, b) => {
    const x = a.unique;
    const y = b.unique;
    if (x === y) { return 0; }
    if (x) { return -1; }
    return 1;
  });
  evilities.sort((a, b) => {
    const x = a.fixed;
    const y = b.fixed;
    if (x === y) { return 0; }
    if (x) { return -1; }
    return 1;
  });

  const style = {
    fontWeight: 'bold'
  };

  const uniqueStyle = {
    color: 'black',
    fontWeight: 'bold',
    textDecoration: "underline"
  };

  const dlcStyle = {
    fontStyle: 'italic',
  };

  let costSum = 0;
  for (const e of evilities.filter(x => !x.unique)) {
    const parsed = parseInt(e.cost, 10);
    if (!isNaN(parsed)) {
        costSum += parsed;
    }
  }
  const uniqueCostSum = evilities.filter(x => x.unique).length;
  let maxUniqueCost = 3 + evilities.filter(x => x.fixed && x.fixed === charClass).length;
  if (evilities.filter(x => x.fixed).length === 0) {
    maxUniqueCost = 4;
  }

  const errorCost = <Tooltip title={"Cost exceeded!"} placement="right">
    <ErrorOutlineIcon sx={{ verticalAlign: 'middle', width: '16px', cursor: 'pointer', marginLeft: '6px' }} color="error" />
  </Tooltip>;

  const getBuildString = () => {
    return evilities.map(x => x.number).join("_");
  };

  const createBuildUrl = () => {
    if (evilities.length === 0) {
      // alert error
      return;
    }

    const buildText = `https://cecilbowen.github.io/disgaea-7-evility-search/?build=${getBuildString()}`;
    console.log(buildText);
    navigator.clipboard.writeText(buildText);

    if (window.isSecureContext) {
      setSuccessOpen(true);
    }
  };

  const saveBuild = () => {
    setBuildName(generateRandomName());
    handleModalOpen();
  };

  const finalizeSave = () => {
    const buildsExist = localStorage.getItem("d7-builds");
    const savedBuilds = JSON.parse(buildsExist || 0) || [];
    savedBuilds.sort((a, b) => b.id - a.id); // sort by id desc
    const id = (savedBuilds[0]?.id || 0) + 1;
    savedBuilds.push({
      id,
      name: buildName,
      build: getBuildString(),
      charClass,
    });

    localStorage.setItem("d7-builds", JSON.stringify(savedBuilds));
    handleModalClose();
  };

  const preloadBuild = () => {
    const buildsExist = localStorage.getItem("d7-builds");
    const savedBuilds = JSON.parse(buildsExist || 0) || [];
    setStashedBuilds(savedBuilds);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const queueDelete = build => {
    if (buildToLoad && buildToLoad.id === build.id) {
      setBuildToLoad(undefined);
    }

    const newStash = [...stashedBuilds].filter(x => x.id !== build.id);
    setStashedBuilds(newStash);
  };

  const queueLoad = build => {
    setBuildToLoad(build);
  };

  const finalizeLoad = () => {
    localStorage.setItem("d7-builds", JSON.stringify(stashedBuilds));

    if (buildToLoad) {
      loadBuild(buildToLoad.build);
    }

    setStashedBuilds([]);
    handleModalCloseL();
  };

  const helperText = "Click on evilities to add/remove them to/from the current build.";

  const renderSaveModal = () => {
    return <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalOpen}
      onClose={handleModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
    <Fade in={modalOpen}>
      <Box sx={modalStyle}>
        <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ marginBottom: '1em' }}>
          Saving Custom Build
        </Typography>
        <Grid container direction="column">
          <TextField label="Build Name" variant="outlined" value={buildName}
            size="small" sx={{ marginBottom: '1em' }}
            onChange={ev => setBuildName(ev.target.value)} />
            <Grid container direction="row">
              <Button variant="outlined" color="success" onClick={finalizeSave} sx={{ marginRight: '1em' }}>
                Save
              </Button>
              <Button variant="outlined" color="info" onClick={handleModalClose}>Cancel</Button>
            </Grid>
        </Grid>
      </Box>
    </Fade>
  </Modal>;
  };

  const renderLoadModal = () => {
    return <Modal
      aria-labelledby="transition-modal-title2"
      aria-describedby="transition-modal-description2"
      open={modalOpenL}
      onClose={handleModalCloseL}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}>
      <Fade in={modalOpenL}>
        <Box sx={modalStyle}>
          <Typography id="transition-modal-title2" variant="h6" component="h2" sx={{ marginBottom: '1em' }}>
            Loading Build: {buildToLoad?.name || ""}
          </Typography>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', maxHeight: '30em', overflowY: 'auto' }}>
            {stashedBuilds.map(value => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem
                  key={value.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => queueDelete(value)} title="Delete Build">
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                  disablePadding
                  sx={{ borderBottom: '1px solid black' }}
                >
                  <ListItemButton role={undefined} onClick={() => queueLoad(value)} dense>
                    <ListItemIcon>
                      <img src={`images/portraits/${value.charClass}.png`} style={{ width: '38px' }} />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Grid container direction="row">
            <Button variant="outlined" color="success" onClick={finalizeLoad} sx={{ marginRight: '1em' }}>
              Apply Changes
            </Button>
            <Button variant="outlined" color="info" onClick={handleModalCloseL}>Cancel</Button>
          </Grid>
        </Box>
      </Fade>
    </Modal>;
  };

  return (
    <div id="main2" style={{ margin: "1em", flex: '1 auto', order: '2' }}>
      <Grid container direction="column">
        <Grid container direction="row" sx={{ marginBottom: '4px' }}>
          <Grid item>
            <img src={`images/portraits/${charClass}.png`} style={{ width: '8em', marginRight: '1em' }} />
          </Grid>
          <Grid item>
            <Typography align="left" sx={{ fontWeight: 'bold', textDecoration: 'underline',
              fontFamily: 'monospace', fontSize: '24px' }}>
              {charClass === "Prinny" ? "Generic Class" : charClass}
            </Typography>
            <Typography align="left" sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px', display: 'flex' }}>
              Unique Cost: {uniqueCostSum} / {maxUniqueCost} {uniqueCostSum > maxUniqueCost && errorCost}
            </Typography>
            <Typography align="left" sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px', display: 'flex' }}>
              Common Cost: {costSum} / {24} {costSum > 24 && errorCost}
            </Typography>
            <Grid container direction="row">
              <Button variant="outlined" sx={{ display: 'flex' }} disabled={evilities.length === 0}
                startIcon={<ShareIcon />} onClick={createBuildUrl} size="small">
                Share
              </Button>
              <Button variant="outlined" sx={{ display: 'flex', marginLeft: '1em' }} disabled={evilities.length === 0}
                color="success"
                startIcon={<SaveIcon />} onClick={saveBuild} size="small">
                Save
              </Button>
              <Button variant="outlined" sx={{ display: 'flex', marginLeft: '1em' }}
                startIcon={<LoadIcon />} onClick={preloadBuild} size="small">
                Load
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <TableContainer component={Paper} sx={{ maxHeight: "53.7vh", overflowY: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" sx={{ width: '1em' }}>
                  <IconButton aria-label="clear"
                    sx={{ position: 'absolute', top: '-2px', left: '12px' }}
                    onClick={clearBuild} title="Clear Build" disabled={evilities.length === 0}>
                    <DeleteSweepIcon color="error" sx={{ display: evilities.length > 0 ? '' : 'none' }} />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ width: '12em' }}>
                  Evility
                </StyledTableCell>
                <StyledTableCell align="left">Type</StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '6em' }}>Cost</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evilities.map(evility => {
                let nameStyle = { ...style, width: '12em', position: 'relative' };
                let rowStyle = { cursor: 'pointer' };
                if (evility.dlc) {
                    nameStyle = { ...nameStyle, ...dlcStyle };
                }
                if (evility.unique) {
                  rowStyle = { ...rowStyle, backgroundColor: '#8000802e !important' };
                }

                return <StyledTableRow
                  key={evility.id || evility.name}
                  title={evility.notes}
                  hover
                  onClick={() => removeEvilityFromBuild(evility)}
                  sx={rowStyle}
                >
                  <StyledTableCell align="center" title={evility.category}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                    <img src={`images/evility_categories/${evility.category}.png`}
                      style={{ objectFit: 'contain' }} />
                  </StyledTableCell>
                  <StyledTableCell align="left" sx={nameStyle}>{evility.name}{evility.fixed && <LockIcon
                      sx={{ width: '15px', verticalAlign: 'middle', marginTop: '-2px',
                        color: 'blue', marginLeft: '4px' }} />}</StyledTableCell>
                  <StyledTableCell align="left" sx={evility.unique && uniqueStyle}>
                    {evility.unique ? "Unique" : "Generic"}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: '6em' }}>{evility.cost}</StyledTableCell>
                </StyledTableRow>;
              })}
            </TableBody>
          </Table>
        </TableContainer>
        </Grid>
        <Grid item>
          <Paper elevation={2} sx={{ padding: '0.9em', fontFamily: 'monospace', fontSize: '14px', marginTop: '4px' }}>
            {helperText}
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          Copied build URL to clipboard.
        </Alert>
      </Snackbar>
      {renderSaveModal()}
      {renderLoadModal()}
    </div>
  );
};

BuildList.propTypes = {
    evilities: PropTypes.array.isRequired,
    removeEvilityFromBuild: PropTypes.func.isRequired,
    passFixedClass: PropTypes.func.isRequired,
    loadBuild: PropTypes.func.isRequired,
    clearBuild: PropTypes.func.isRequired
};
export default BuildList;
