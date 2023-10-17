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
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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

const BuildList = ({ evilities, removeEvilityFromBuild, passFixedClass }) => {
  const [charClass, setCharClass] = useState("Prinny");
  const [tooManyFixedEvilities, setTooManyFixedEvilities] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

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
  for (const e of evilities) {
    const parsed = parseInt(e.cost, 10);
    if (!isNaN(parsed)) {
        costSum += parsed;
    }
  }
  const uniqueCostSum = evilities.filter(x => x.unique).length;
  const maxUniqueCost = 3 + evilities.filter(x => x.fixed && x.fixed === charClass).length;

  const errorCost = <Tooltip title={"Cost exceeded!"} placement="right">
    <ErrorOutlineIcon sx={{ verticalAlign: 'middle', width: '20px', cursor: 'pointer' }} color="error" />
  </Tooltip>;

  const createBuildUrl = () => {
    if (evilities.length === 0) {
      // alert error
      return;
    }

    const buildText = `https://cecilbowen.github.io/disgaea-7-evility-search/?build=${evilities.map(x => x.number).join("_")}`;
    console.log(buildText);
    navigator.clipboard.writeText(buildText);

    if (window.isSecureContext) {
      setSuccessOpen(true);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const helperText = "Click on evilities to add/remove them to/from the current build.";

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
            <Typography align="left" sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px' }}>
              Unique Cost: {uniqueCostSum} / {maxUniqueCost} {uniqueCostSum > maxUniqueCost && errorCost}
            </Typography>
            <Typography align="left" sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '16px' }}>
              Common Cost: {costSum} / {24} {costSum > 24 && errorCost}
            </Typography>
            <Button variant="outlined" sx={{ display: 'flex' }} disabled={evilities.length === 0}
              startIcon={<ShareIcon />} onClick={createBuildUrl} size="small">
              Share Build
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <TableContainer component={Paper} sx={{ maxHeight: "53.7vh", overflowY: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" sx={{ width: '1em' }}></StyledTableCell>
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
                if (evility.dlc) {
                    nameStyle = { ...nameStyle, ...dlcStyle };
                }

                return <StyledTableRow
                  key={evility.id || evility.name}
                  title={evility.notes}
                  hover
                  onClick={() => removeEvilityFromBuild(evility)}
                  sx={
                    evility.unique ? { backgroundColor: '#8000802e !important', cursor: 'pointer' } :
                    { '&:last-child td, &:last-child th': { border: 0, cursor: 'pointer' } }
                  }
                >
                  <StyledTableCell align="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                    <img src={`images/evility_categories/${evility.category}.png`}
                      style={{ objectFit: 'contain' }} />
                  </StyledTableCell>
                  <StyledTableCell align="left" sx={nameStyle}>{evility.name}{evility.fixed && <LockIcon
                      sx={{ width: '15px', cursor: 'pointer', verticalAlign: 'middle', marginTop: '-2px',
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
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          Copied build URL to clipboard.
        </Alert>
      </Snackbar>
    </div>
  );
};

BuildList.propTypes = {
    evilities: PropTypes.array.isRequired,
    removeEvilityFromBuild: PropTypes.func.isRequired,
    passFixedClass: PropTypes.func.isRequired,
};
export default BuildList;
