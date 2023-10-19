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
import EVILITY_CATEGORIES from '../data/evility_categories.json';
import Radio from '@mui/material/Radio';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from './TablePaginationActions';

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
    backgroundColor: 'lightblue !important',
    outline: '2px dashed black',
  }
}));

const CategoryEditor = ({ evilities }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categoryMap, setCategoryMap] = useState();
  const [hoverRow, setHoverRow] = useState("initial");
  const [hoverColumn, setHoverColumn] = useState("initial");

  const filteredEvilities = evilities.filter(x => x);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (!categoryMap) {
        const catMapExists = localStorage.getItem("catMap");
        let tempCatMap;
        if (!catMapExists) {
            tempCatMap = new Map();
            for (const ev of filteredEvilities) {
                tempCatMap.set(ev.id, EVILITY_CATEGORIES.None);
            }
        } else {
          tempCatMap = new Map(JSON.parse(catMapExists));
        }
        setCategoryMap(tempCatMap);
    } else {
      localStorage.setItem('catMap', JSON.stringify([...categoryMap]));
    }
  }, [categoryMap]);

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

  const handleRadioClick = (evilityId, value) => {
    const tempCatMap = new Map(categoryMap);
    tempCatMap.set(evilityId, value);
    setCategoryMap(tempCatMap);
  };

  const renderCategoryHeader = ([k, v]) => {
    return <StyledTableCell align="center" key={k}
      title={v}
      style={{ width: 'fit-content', lineHeight: 0, backgroundColor: hoverColumn === k ? 'lightblue' : 'black' }}>
        <img src={`images/evility_categories/${k}.png`} />
    </StyledTableCell>;
  };

  const renderCategoryRadio = (evility, [k, v]) => {
    const showImages = true; // hoverRow === evility.id;
    const checked = categoryMap.get(evility.id) === v;

    return <StyledTableCell align="center"
      key={`${evility.id}-${k}`}
      onMouseEnter={() => setHoverColumn(k)}
      style={{ width: 'fit-content', position: 'relative' }}>
        <Radio
            value={v}
            checked={checked}
            onClick={() => handleRadioClick(evility.id, v)}
            size="small"
            sx={{ opacity: !showImages || k === EVILITY_CATEGORIES.None && checked ? 1 : 0 }}
        />
        {showImages && <img src={`images/evility_categories/${k}.png`}
          style={{ opacity: checked ? 1 : 0.5, position: 'absolute', pointerEvents: 'none',
            left: 'calc(50% - 15.5px)', top: 'calc(50% - 15.5px)' }} />}
    </StyledTableCell>;
  };

  const categories = Object.entries(EVILITY_CATEGORIES);

  if (!categoryMap) {
    return null;
  }

  return (
    <div style={{ margin: "1em" }}>
      <TableContainer component={Paper} sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Table sx={{ minWidth: 450 }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: '12em' }}>Name</StyledTableCell>
              {categories.map(x => renderCategoryHeader(x))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? filteredEvilities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredEvilities)
              .map(evility => {
              let nameStyle = { ...style };
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
                sx={
                  evility.unique ? { backgroundColor: '#8000802e !important' } :
                  { '&:last-child td, &:last-child th': { border: 0 } }
                }
              >
                <StyledTableCell component="th" scope="row" sx={ nameStyle }>
                  {evility.name}
                </StyledTableCell>
                {categories.map(x => renderCategoryRadio(evility, x))}
              </StyledTableRow>;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper elevation={1} sx={{ backgroundColor: 'antiquewhite', border: '2px solid black', marginTop: '0.5em' }}>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30, { label: 'All', value: -1 }]}
          colSpan={3}
          count={filteredEvilities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    </div>
  );
};

CategoryEditor.propTypes = {
    evilities: PropTypes.array.isRequired
};
export default CategoryEditor;
