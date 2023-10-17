import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import LockIcon from '@mui/icons-material/Lock';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
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
    backgroundColor: 'lightblue',
  }
}));

const EvilityTable = ({ evilities, textFilter, filters, searchCriteria,
    width, addEvilityToBuild, building, fixed }) => {
  let filteredEvilities = [ ...evilities ].map(x => {
    return {
      ...x,
      category: x.category || "None"
    };
  });

  if (filters) {
    filteredEvilities = filteredEvilities.filter(x => {
        return (filters.unique || !x.unique) &&
            (filters.generic || x.unique) &&
            (filters.learnable || x.enemyOnly) &&
            (filters.enemy || !x.enemyOnly) &&
            (filters.baseGame || x.dlc) &&
            (filters.dlc || !x.dlc) &&
            filters.categories.includes(x.category);
    });
  }

  if (textFilter && textFilter.length > 0) {
    filteredEvilities = filteredEvilities.filter(x => {
        const nameBool = x.name.toLowerCase().includes(textFilter.toLowerCase());
        const descBool = x.description.toLowerCase().includes(textFilter.toLowerCase());
        const bothBool = nameBool || descBool;

        switch (searchCriteria) {
            case "name": return nameBool;
            case "description": return descBool;
            case "both": return bothBool;
            default: return bothBool;
        }
    });
  }

  const style = {
    fontWeight: 'bold'
  };

  const enemyOnlyStyle = {
    color: 'purple'
  };

  const dlcStyle = {
    fontStyle: 'italic',
  };

  const flex = building ? '1 0 55%' : '1';

  return (
    <div id="main1" style={{ margin: "1em", flex, order: '1', overflow: 'auto' }}>
      <TableContainer component={Paper} sx={{ maxHeight: "75vh", overflowY: "auto", width: '100%' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: '12em' }}>Name</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="center">Cost</StyledTableCell>
              <StyledTableCell align="left">Type</StyledTableCell>
              <StyledTableCell align="left">Source</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvilities.map(evility => {
              let nameStyle = { ...style };
              let rowStyle = {};
              if (evility.enemyOnly) {
                  nameStyle = { ...nameStyle, ...enemyOnlyStyle };
                  rowStyle = { ...rowStyle, ...{ backgroundColor: '#8000802e !important' } };
              } else {
                rowStyle = { ...rowStyle, ...{ '&:last-child td, &:last-child th': { border: 0 } } };
              }

              if (evility.dlc) {
                  nameStyle = { ...nameStyle, ...dlcStyle };
              }

              if (evility.fixed) {
                nameStyle = { ...nameStyle, position: 'relative' };
              }

              let cantAdd = false;
              if (fixed && building && fixed !== "Prinny" &&
                evility.fixed && evility.fixed !== fixed) {
                cantAdd = true;
                rowStyle = { ...rowStyle, textDecoration: 'line-through', opacity: '0.5' };
              }

              if (fixed && building && fixed !== "Prinny" &&
                evility.fixed && evility.fixed === fixed) {
                  rowStyle = { ...rowStyle, backgroundColor: 'lightyellow !important', outline: '2px dotted yellow' };
                }

              const typeStyle = evility.unique ? { fontWeight: "bold", textDecoration: "underline" } : {};

              return <StyledTableRow
                key={evility.id || evility.name}
                title={evility.notes}
                sx={rowStyle}
                onClick={() => !cantAdd && addEvilityToBuild(evility)}
              >
                <StyledTableCell component="th" scope="row" sx={ nameStyle } title={`Exclusive to ${evility.fixed}`}>
                  {evility.name}{evility.fixed && <LockIcon
                    sx={{ width: '15px', cursor: 'pointer', verticalAlign: 'middle', marginTop: '-2px',
                      color: 'blue', marginLeft: '4px' }} />}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ lineHeight: 0 }}><img title={evility.category}
                  src={`images/evility_categories/${evility.category || "None"}.png`} />
                </StyledTableCell>
                <StyledTableCell align="left">{evility.description}</StyledTableCell>
                <StyledTableCell align="center">{evility.cost ? evility.cost : '-'}</StyledTableCell>
                <StyledTableCell align="left" sx={ typeStyle }>{evility.unique ? "Unique" : "Generic"}</StyledTableCell>
                <StyledTableCell align="left">{evility.unlock}</StyledTableCell>
              </StyledTableRow>;
            }

            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

EvilityTable.propTypes = {
  addEvilityToBuild: PropTypes.func.isRequired,
  evilities: PropTypes.array.isRequired,
  textFilter: PropTypes.string,
  filters: PropTypes.object,
  searchCriteria: PropTypes.string,
  width: PropTypes.string,
  building: PropTypes.bool,
  fixed: PropTypes.string
};
export default EvilityTable;
