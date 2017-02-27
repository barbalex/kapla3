import React, { PropTypes } from 'react'
import {
  NavDropdown,
  MenuItem,
} from 'react-bootstrap'
import styled from 'styled-components'
import { shell } from 'electron'

const DbPathDiv = styled.div`
  font-style: italic;
`

const onGetProjektbeschreibung = () => {
  shell.openItem('https://github.com/barbalex/kapla3/raw/master/app/etc/Projektbeschreibung.pdf')
}
const onClickIssues = () => {
  shell.openItem('https://github.com/barbalex/kapla3/issues')
}

const OptionsNav = ({
  config,
  dbGet,
  configUiReset,
}) =>
  <NavDropdown
    title="&#8942;"
    id="last-nav-dropdown"
    noCaret
  >
    <MenuItem
      onClick={dbGet}
    >
      Datenbank wählen
      {
        config.dbPath &&
        <DbPathDiv>
          Aktuell: {config.dbPath}
        </DbPathDiv>
      }
    </MenuItem>
    <MenuItem divider />
    <MenuItem
      onClick={configUiReset}
    >
      Einstellungen zurücksetzen
    </MenuItem>
    <MenuItem divider />
    <MenuItem
      onClick={onGetProjektbeschreibung}
    >
      Projektbeschreibung herunterladen
    </MenuItem>
    <MenuItem
      onClick={onClickIssues}
    >
      Fehler und Wünsche melden
    </MenuItem>
  </NavDropdown>

OptionsNav.displayName = 'OptionsNav'

OptionsNav.propTypes = {
  config: PropTypes.object.isRequired,
  dbGet: PropTypes.func.isRequired,
  configUiReset: PropTypes.func.isRequired,
}

export default OptionsNav
