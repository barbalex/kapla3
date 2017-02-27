import React, { PropTypes } from 'react'
import { hashHistory } from 'react-router'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'

import styles from './Geschaefte.css'

const getStatusFristInStyle = (fristMitarbeiterWarnung) => {
  if (fristMitarbeiterWarnung === 'FÄLLIG') return styles.fieldWarnungFaellig
  if (fristMitarbeiterWarnung === 'HEUTE') return styles.fieldWarnungHeute
  return null
}

const enhance = compose(
  inject('store'),
  withProps((props) => {
    const {
      store,
      routing,
      index,
      keyPassed,
    } = props
    const {
      activeId,
      geschaefteGefilterteIds,
      geschaefte,
    } = store.geschaefte
    const path = routing.locationBeforeTransitions.pathname

    return {
      geschaefte,
      geschaefteGefilterteIds,
      activeId,
      path,
      index,
      keyPassed,
    }
  }),
  observer
)

const GeschaefteItem = ({
  geschaefte,
  geschaefteGefilterteIds,
  activeId,
  path,
  geschaeftToggleActivated,
  index,
  keyPassed,
}) => {
  const isActive = (
    activeId &&
    activeId === geschaefteGefilterteIds[index]
  )
  const trClassName = (
    isActive ?
    [styles.tableBodyRow, styles.active].join(' ') :
    styles.tableBodyRow
  )
  const geschaeft = geschaefte.find(g =>
    g.idGeschaeft === geschaefteGefilterteIds[index]
  )
  // make sure geschaeft exists
  if (!geschaeft) return null
  const fristMitarbeiter = (
    geschaeft.fristMitarbeiter ?
    `Frist: ${geschaeft.fristMitarbeiter}` :

    ''
  )

  return (
    <div  // eslint-disable-line jsx-a11y/no-static-element-interactions
      key={keyPassed}
      className={trClassName}
      onClick={() => {
        // if path is not '/geschaefte', make it that
        // because this is also called from '/fieldFilter'
        // no idea why but using 'router' passed by 'withRouter' did not work here
        if (path === '/filterFields') {
          hashHistory.push('/geschaefte')
        }
        geschaeftToggleActivated(geschaeft.idGeschaeft)
      }}
    >
      <div className={styles.bodyColumnIdGeschaeft}>
        <div>
          {geschaeft.idGeschaeft}
        </div>
      </div>
      <div className={styles.bodyColumnGegenstand}>
        <div className={styles.fieldGegenstand}>
          {geschaeft.gegenstand}
        </div>
      </div>
      <div className={styles.bodyColumnStatus}>
        <div>
          {geschaeft.status}
        </div>
        <div>
          {fristMitarbeiter}
        </div>
        <div
          className={getStatusFristInStyle(geschaeft.fristMitarbeiterWarnung)}
        >
          {geschaeft.fristMitarbeiterWarnung}
        </div>
      </div>
      <div className={styles.bodyColumnKontaktIntern}>
        <div>
          {geschaeft.verantwortlichName}
        </div>
        <div>
          {geschaeft.verantwortlich}
        </div>
      </div>
    </div>
  )
}

GeschaefteItem.displayName = 'GeschaefteItem'

GeschaefteItem.propTypes = {
  geschaefte: PropTypes.array.isRequired,
  geschaefteGefilterteIds: PropTypes.array.isRequired,
  geschaeftToggleActivated: PropTypes.func.isRequired,
  activeId: PropTypes.number,
  path: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  keyPassed: PropTypes.string.isRequired,
}

export default enhance(GeschaefteItem)
