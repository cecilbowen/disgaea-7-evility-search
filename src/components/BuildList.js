import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

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

const BuildList = ({ evilities, removeEvilityFromBuild }) => {
  const [hoverRow, setHoverRow] = useState("initial");
  const [hoverColumn, setHoverColumn] = useState("initial");

  const filteredEvilities = evilities.filter(x => x);

  const style = {
    fontWeight: 'bold'
  };

  const uniqueStyle = {
    color: 'purple',
    textDecoration: "underline"
  };

  const dlcStyle = {
    fontStyle: 'italic',
  };

  let costSum = 0;
  for (const e of filteredEvilities) {
    const parsed = parseInt(e.cost, 10);
    if (!isNaN(parsed)) {
        costSum += parsed;
    }
  }

  const createBuildUrl = () => {
    console.log(`https://cecilbowen.github.io/disgaea-7-evility-search/?build=${evilities.map(x => x.number).join("_")}`);
  };

  return (
    <div style={{ margin: "1em", marginLeft: "0em", width: "-moz-available" }}>
      <TableContainer component={Paper} sx={{ maxHeight: "75vh", overflowY: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell align="left" sx={{ width: '12em' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Name</span>
                    <Button size="small"
                        onClick={createBuildUrl}
                        sx={{ marginLeft: "0.5em", borderRadius: "10px", border: "2px solid" }}>Share</Button>
                </div>
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: '6em' }}>Cost {costSum} / {24}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvilities
              .map(evility => {
              let nameStyle = { ...style, width: '12em' };
              if (evility.enemyOnly) {
                  nameStyle = { ...nameStyle, ...uniqueStyle };
              }

              if (evility.dlc) {
                  nameStyle = { ...nameStyle, ...dlcStyle };
              }

              return <StyledTableRow
                key={evility.id || evility.name}
                title={evility.notes}
                hover
                onMouseEnter={() => setHoverRow(evility.id)}
                onClick={() => removeEvilityFromBuild(evility)}
                sx={
                  evility.unique ? { backgroundColor: '#8000802e !important', cursor: 'pointer' } :
                  { '&:last-child td, &:last-child th': { border: 0, cursor: 'pointer' } }
                }
              >
                <StyledTableCell align="left" sx={nameStyle}>{evility.name}</StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '6em' }}>{evility.cost}</StyledTableCell>
              </StyledTableRow>;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

BuildList.propTypes = {
    evilities: PropTypes.array.isRequired,
    removeEvilityFromBuild: PropTypes.func.isRequired
};
export default BuildList;
