import React from 'react'
import PropTypes from 'prop-types'
import SplitPane from 'react-split-pane'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import Geschaeft from '../components/Geschaeft'
import Pages from './Pages'
import GeschaeftPdf from '../components/GeschaeftPdf'
import Geschaefte from '../components/Geschaefte'

const enhance = compose(
  inject('store'),
  withHandlers({
    onChange: props => size =>
      props.store.configSetKey('geschaefteColumnWidth', size),
  }),
  observer
)

const GeschaefteLayout = ({
  store,
  onChange,
}) => {
  const { config } = store.app
  const { activeId } = store.geschaefte
  const path = store.history.location.pathname
  const showGeschaeft = (
    path === '/geschaefte'
    && activeId
  )
  const showPages = path === '/pages'
  const showGeschaeftPdf = path === '/geschaeftPdf' && activeId

  return (
    <SplitPane
      split="vertical"
      minSize={100}
      defaultSize={config.geschaefteColumnWidth}
      onChange={onChange}
    >
      <Geschaefte />
      <div>
        {
          showGeschaeft
          && <Geschaeft />
        }
        {
          showPages
          && <Pages />
        }
        {
          showGeschaeftPdf
          && <GeschaeftPdf />
        }
      </div>
    </SplitPane>
  )
}

GeschaefteLayout.propTypes = {
  store: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default enhance(GeschaefteLayout)
