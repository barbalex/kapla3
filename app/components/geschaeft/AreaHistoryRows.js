import React, { PropTypes } from 'react'
import styled from 'styled-components'

import getHistoryOfGeschaeft from '../../src/getHistoryOfGeschaeft'


const FieldsContainer = styled.div`
  grid-area: areaHistoryFieldsContainer;
  display: grid;
  grid-template-columns: 100%;
`
// eslint-disable-next-line no-unused-vars
const HistoryField = styled(({ isPrintPreview, children, ...rest }) => <div {...rest}>{children}</div>)`
  grid-column: 1;
  display: grid;
  grid-template-columns: ${(props) => (props.isPrintPreview ? '35px 45px calc(100% - 80px)' : '55px 75px calc(100% - 130px)')};
  grid-gap: 0;
  border-bottom: thin solid #CECBCB;
  padding-left: ${(props) => (props.isPrintPreview ? 0 : '13px')};
  padding-top: ${(props) => (props.isPrintPreview ? '2px' : '10px')};
  padding-bottom: ${(props) => (props.isPrintPreview ? '2px' : '10px')};
  align-items: center;
  font-size: ${(props) => (props.isPrintPreview ? '10px' : 'inherit')};

  &:first-of-type {
    border-top: thin solid #CECBCB;
  }
  &:hover {
    background-color: rgb(227, 232, 255);
  }
`
const IdGeschaeft = styled.div`
  grid-column: 1;
`
const Datum = styled.div`
  grid-column: 2;
`
const Gegenstand = styled.div`
  grid-column: 3;
`

const AreaHistoryRows = ({
  geschaefte,
  activeId,
  geschaeftToggleActivated,
  path,
}) => {
  const isPrintPreview = path === '/geschaeftPdf'
  const history = getHistoryOfGeschaeft(geschaefte, activeId)
  // sort descending
  // history.reverse()

  return (
    <FieldsContainer>
      {
        history.map((id) => {
          const geschaeft = geschaefte.find(g =>
            g.idGeschaeft === id
          )
          if (!geschaeft) {
            return null
          }
          return (
            <HistoryField
              key={id}
              style={{
                cursor: id === activeId ? 'default' : 'pointer'
              }}
              onClick={() => {
                if (id !== activeId) {
                  return geschaeftToggleActivated(id)
                }
              }}
              isPrintPreview={isPrintPreview}
            >
              <IdGeschaeft>
                {id}
              </IdGeschaeft>
              <Datum>
                {geschaeft.datumEingangAwel}
              </Datum>
              <Gegenstand>
                {geschaeft.gegenstand}
              </Gegenstand>
            </HistoryField>
          )
        })
      }
    </FieldsContainer>
  )
}

AreaHistoryRows.displayName = 'AreaHistoryRows'

AreaHistoryRows.propTypes = {
  geschaefte: PropTypes.array.isRequired,
  activeId: PropTypes.number.isRequired,
  geschaeftToggleActivated: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
}

export default AreaHistoryRows
