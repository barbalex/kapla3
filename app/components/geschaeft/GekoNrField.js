import React, { Component, PropTypes } from 'react'
import { FormControl } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'

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

class GekoNrField extends Component {
  static propTypes = {
    idGeschaeft: PropTypes.number.isRequired,
    gekoNr: PropTypes.string.isRequired,
    tabsToAdd: PropTypes.number.isRequired,
    gekoRemove: PropTypes.func.isRequired,
    gekoNewCreate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { gekoNr } = this.props
    this.state = {
      gekoNr,
      oldGekoNr: gekoNr,
    }
  }

  onChange = (e) => {
    this.setState({ gekoNr: e.target.value })
  }

  onBlur = () => {
    const {
      idGeschaeft,
      gekoRemove,
      gekoNewCreate,
    } = this.props
    const {
      gekoNr,
      oldGekoNr,
    } = this.state
    // need old value
    if (gekoNr && oldGekoNr && gekoNr !== oldGekoNr) {
      gekoRemove(idGeschaeft, oldGekoNr)
      gekoNewCreate(idGeschaeft, gekoNr)
    } else if (gekoNr && !oldGekoNr) {
      gekoNewCreate(idGeschaeft, gekoNr)
      this.setState({ gekoNr: '' })
    } else if (!gekoNr && oldGekoNr) {
      gekoRemove(idGeschaeft, oldGekoNr)
    }
  }

  render = () => {
    const {
      tabsToAdd,
    } = this.props
    const {
      gekoNr,
    } = this.state

    return (
      <FormControl
        type="text"
        value={gekoNr}
        onChange={this.onChange}
        onBlur={this.onBlur}
        bsSize="small"
        tabIndex={1 + tabsToAdd}
      />
    )
  }
}

export default enhance(GekoNrField)
