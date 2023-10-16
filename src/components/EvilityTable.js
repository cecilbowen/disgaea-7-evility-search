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
}));

const EvilityTable = ({ evilities, textFilter, filters, searchCriteria }) => {
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

  return (
    <div style={{ margin: "1em" }}>
      <TableContainer component={Paper} sx={{ maxHeight: "75vh", overflowY: "auto" }}>
        <Table sx={{ minWidth: 450 }} size="small" stickyHeader>
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
              if (evility.enemyOnly) {
                  nameStyle = { ...nameStyle, ...enemyOnlyStyle };
              }

              if (evility.dlc) {
                  nameStyle = { ...nameStyle, ...dlcStyle };
              }

              const typeStyle = evility.unique ? { fontWeight: "bold", textDecoration: "underline" } : {};

              return <StyledTableRow
                key={evility.id || evility.name}
                title={evility.notes}
                sx={
                  evility.enemyOnly ? { backgroundColor: '#8000802e !important' } :
                  { '&:last-child td, &:last-child th': { border: 0 } }
                }
              >
                <StyledTableCell component="th" scope="row" sx={ nameStyle }>
                  {evility.name}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ lineHeight: 0 }}><img title={evility.category}
                  src={`images/evility_categories/${evility.category || "None"}.png`} /></StyledTableCell>
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
    evilities: PropTypes.array.isRequired,
    textFilter: PropTypes.string,
    filters: PropTypes.object,
    searchCriteria: PropTypes.string
};
export default EvilityTable;
