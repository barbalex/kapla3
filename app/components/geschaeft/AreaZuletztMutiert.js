import React, { PropTypes } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'

const Container = styled.div`
  grid-area: areaZuletztMutiert;
  background-color: rgba(239, 239, 239, 1);
  display: grid;
  grid-template-columns: 100%;
  padding: 8px;
  align-items: center;
`
// eslint-disable-next-line no-unused-vars
const Field = styled(({ isPrintPreview, children, ...rest }) => <div {...rest}>{children}</div>)`
  grid-column: 1;
  font-size: ${(props) => (props.isPrintPreview ? '10px' : 'inherit')};
`

const enhance = compose(
  inject('store'),
  withProps((props) => {
    const { store, routing } = props
    const {
      activeId,
      geschaefteGefilterteIds,
      geschaefte,
      filterFields,
      filterFulltext,
    } = store.geschaefte
    const path = routing.locationBeforeTransitions.pathname
    return {
      activeId,
      geschaefteGefilterteIds,
      geschaefte,
      filterFields,
      filterFulltext,
      path,
    }
  }),
  withHandlers({
    onChange: props => size =>
      props.store.configSetKey('geschaefteColumnWidth', size),
  }),
  observer
)

const AreaZuletztMutiert = ({
  geschaeft,
  interneOptions,
  isPrintPreview,
}) => {
  let zuletztMutiertText

  if (!geschaeft.mutationsperson) {
    zuletztMutiertText = 'Bei diesem Geschäft wurde (noch) keine Mutationsperson gespeichert'
  } else {
    const mutPersonOptions = interneOptions.find((o) => {
      if (o.itKonto) {
        // seems that data contains lower case differences
        // and whitespace
        return (
          o.itKonto.toLowerCase().replace(/ /g, '') ===
          geschaeft.mutationsperson.toLowerCase().replace(/ /g, '')
        )
      }
      return false
    })
    const name = (
      mutPersonOptions ?
      ` (${mutPersonOptions.vorname} ${mutPersonOptions.name})` :
      ''
    )
    zuletztMutiertText = `Zuletzt mutiert durch ${geschaeft.mutationsperson}${name} am ${geschaeft.mutationsdatum}`
  }

  return (
    <Container>
      <Field isPrintPreview={isPrintPreview}>
        {zuletztMutiertText}
      </Field>
    </Container>
  )
}

AreaZuletztMutiert.displayName = 'AreaZuletztMutiert'

AreaZuletztMutiert.propTypes = {
  geschaeft: PropTypes.object.isRequired,
  interneOptions: PropTypes.array.isRequired,
  isPrintPreview: PropTypes.bool.isRequired,
}

export default enhance(AreaZuletztMutiert)
