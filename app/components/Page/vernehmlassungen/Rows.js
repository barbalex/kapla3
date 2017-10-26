import React, { PropTypes } from 'react'
import styled from 'styled-components'

import styles from './vernehmlassungen.css'
import shorten from '../../../src/shortenGegenstandField'

const StyledId = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 65px;
  max-width: 65px;
`
const StyledGegenstand = styled.div`
  flex: 1;
  padding: 2px;
  width: calc(100% - 290px);
`
const StyledStatus = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 140px;
  max-width: 140px;
`
const StyledKontakt = styled.div`
  flex: 1;
  padding: 2px;
  min-width: 100px;
  max-width: 100px;
`
const BoldField = styled.div`font-weight: 700;`
const VerticallyStackedFields = styled.div`padding-top: 5px;`

const isOdd = num => num % 2

const PageVernehmlassungenRows = ({ geschaeft, rowIndex }) => {
  const fristMitarbeiter = geschaeft.fristMitarbeiter ? `Frist: ${geschaeft.fristMitarbeiter}` : ''
  /**
   * need to enforce max string length
   * if a field contains more text than fits on a page
   * the page is (re-)created infinitely...
   */
  const totalString = `
    ${geschaeft.gegenstand || ''}
    ${geschaeft.ausloeser || ''}
    ${geschaeft.details || ''}
    ${geschaeft.vermerk || ''}
    ${geschaeft.naechsterSchritt || ''}
  `
  const maxStringLength = totalString.length > 2000 ? 700 : 2000
  const gegenstand = shorten(geschaeft.gegenstand, '', maxStringLength)
  const ausloeser = shorten(geschaeft.ausloeser, 'Auslöser', maxStringLength)
  const naechsterSchritt = shorten(geschaeft.naechsterSchritt, 'Nächster Schritt', maxStringLength)
  const details = shorten(geschaeft.details, 'Details', maxStringLength)
  const vermerk = shorten(geschaeft.vermerk, 'Vermerk', maxStringLength)

  let faelligkeitText = geschaeft.faelligkeitText
  if (faelligkeitText && faelligkeitText.length > maxStringLength) {
    faelligkeitText = faelligkeitText.substring(0, maxStringLength)
    faelligkeitText += '... (Text gekürzt)'
  }
  const rowClassName = !isOdd(rowIndex) ? styles.tableBodyRowShaded : styles.tableBodyRow
  const geko = geschaeft.geko || []
  const gekoValue = geko.map(g => g.gekoNr).map(val => <div key={val}>{val}</div>)
  const verantwortlichName = `${geschaeft.verantwortlichName}${geschaeft.verantwortlich ? ` (${geschaeft.verantwortlich})` : ''}`

  return (
    <div key={geschaeft.idGeschaeft} className={rowClassName}>
      <StyledId>
        <BoldField>{geschaeft.idGeschaeft}</BoldField>
        {gekoValue.length > 0 && <div className={styles.verticallyStackedFields}>{gekoValue}</div>}
      </StyledId>
      <StyledGegenstand>
        <BoldField>{gegenstand}</BoldField>
        {ausloeser && <VerticallyStackedFields>{ausloeser}</VerticallyStackedFields>}
        {details && <VerticallyStackedFields>{details}</VerticallyStackedFields>}
        {vermerk && <VerticallyStackedFields>{vermerk}</VerticallyStackedFields>}
        {naechsterSchritt && <VerticallyStackedFields>{naechsterSchritt}</VerticallyStackedFields>}
      </StyledGegenstand>
      <StyledStatus>
        <BoldField>{geschaeft.status}</BoldField>
        {fristMitarbeiter && <VerticallyStackedFields>{fristMitarbeiter}</VerticallyStackedFields>}
        {faelligkeitText && <VerticallyStackedFields>{faelligkeitText}</VerticallyStackedFields>}
      </StyledStatus>
      <StyledKontakt>
        <BoldField>{verantwortlichName}</BoldField>
        {geschaeft.abteilung && <VerticallyStackedFields>{geschaeft.abteilung}</VerticallyStackedFields>}
      </StyledKontakt>
    </div>
  )
}

PageVernehmlassungenRows.displayName = 'PageVernehmlassungenRows'

PageVernehmlassungenRows.propTypes = {
  geschaeft: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
}

export default PageVernehmlassungenRows
