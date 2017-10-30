import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, ControlLabel, Radio, InputGroup } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

import ComparatorSelector from './ComparatorSelector'
import createOptions from '../../src/createOptions'

const Container = styled.div`
  grid-area: areaForGeschaeftsart;
  background-color: white;
  box-shadow: inset 1em 1em 2em rgb(255, 237, 199), inset -1em -1em 2em rgb(255, 237, 199);
  outline: 1px solid #efefef;
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: auto;
  grid-template-areas: 'areaParlVorstTitle areaParlVorstTitle' 'fieldParlVorstossTyp fieldParlVorstossTyp' 'fieldStufe fieldZustaendigkeit';
  grid-gap: 15px 8px;
  padding: 8px;
`
const Title = styled.div`
  font-weight: 900;
  font-size: 16px;
  grid-area: areaParlVorstTitle;
`
const FieldParlVorstossTyp = styled.div`grid-area: fieldParlVorstossTyp;`
const FieldStufe = styled.div`grid-area: fieldStufe;`
const FieldZustaendigkeit = styled.div`grid-area: fieldZustaendigkeit;`

const enhance = compose(inject('store'), observer)

const AreaParlVorstoss = ({ store, values, firstTabIndex, change, changeComparator }) => (
  <Container>
    <Title>Parlamentarischer Vorstoss</Title>
    <FieldParlVorstossTyp>
      <ControlLabel>Typ</ControlLabel>
      <InputGroup>
        <ComparatorSelector name="parlVorstossTyp" changeComparator={changeComparator} />
        <FormControl
          componentClass="select"
          value={values.parlVorstossTyp || ''}
          name="parlVorstossTyp"
          onChange={change}
          bsSize="small"
          tabIndex={1 + firstTabIndex}
        >
          {createOptions(store.geschaefte.parlVorstossTypOptions)}
        </FormControl>
      </InputGroup>
    </FieldParlVorstossTyp>
    <FieldStufe>
      <ControlLabel>Stufe</ControlLabel>
      <Radio
        data-value={1}
        checked={values.parlVorstossStufe === '1'}
        onChange={change}
        bsSize="small"
        name="parlVorstossStufe"
        tabIndex={2 + firstTabIndex}
      >
        1: nicht überwiesen
      </Radio>
      <Radio
        data-value={2}
        checked={values.parlVorstossStufe === '2'}
        name="parlVorstossStufe"
        onChange={change}
        bsSize="small"
        tabIndex={3 + firstTabIndex}
      >
        2: überwiesen
      </Radio>
    </FieldStufe>
    <FieldZustaendigkeit>
      <ControlLabel>Zuständigkeit</ControlLabel>
      <Radio
        data-value="hauptzuständig"
        checked={values.parlVorstossZustaendigkeitAwel === 'hauptzuständig'}
        name="parlVorstossZustaendigkeitAwel"
        onChange={change}
        bsSize="small"
        tabIndex={6 + firstTabIndex}
      >
        haupt
      </Radio>
      <Radio
        data-value="mitberichtzuständig"
        checked={values.parlVorstossZustaendigkeitAwel === 'mitberichtzuständig'}
        name="parlVorstossZustaendigkeitAwel"
        onChange={change}
        bsSize="small"
        tabIndex={7 + firstTabIndex}
      >
        mitbericht
      </Radio>
    </FieldZustaendigkeit>
  </Container>
)

AreaParlVorstoss.displayName = 'AreaParlVorstoss'

AreaParlVorstoss.propTypes = {
  store: PropTypes.object.isRequired,
  values: PropTypes.object,
  firstTabIndex: PropTypes.number.isRequired,
  change: PropTypes.func.isRequired,
  changeComparator: PropTypes.func.isRequired,
}

export default enhance(AreaParlVorstoss)
