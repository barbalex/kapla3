import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

import ModalGeschaeftDelete from '../ModalGeschaeftDelete'
import ModalMessage from '../ModalMessage'
import PagesModal from '../PagesModal'
import BerichteNav from './BerichteNav'
import GeschaeftNeuNav from './GeschaeftNewNav'
import GeschaeftLoeschenNav from './GeschaeftDeleteNav'
import TableRowNeuNav from './TableRowNewNav'
import TableRowDeleteNav from './TableRowDeleteNav'
import ExportGeschaefteNav from './ExportGeschaefteNav'
import PrintToPdfNav from './PrintToPdfNav'
import PrintNav from './PrintNav'
import StammdatenNav from './StammdatenNav'
import FilterNav from './FilterNav'
import OptionsNav from './OptionsNav'

// eslint-disable-next-line no-unused-vars
const GeschaefteNavItem = styled(({ showGeschaefteNavs, children, ...rest }) => <NavItem {...rest}>{children}</NavItem>)`
  border-left: ${props => (props.showGeschaefteNavs ? 'solid grey 1px' : 'dotted #505050 1px')};
  border-right: ${props => (props.showGeschaefteNavs ? 'none' : 'dotted #505050 1px')};
`
const StyledBadge = styled.sup`color: ${props => (props.dataIsFiltered ? '#FF9416' : 'inherit')};`
const StyledNavbar = styled(Navbar)`
  margin-bottom: 0;
  -webkit-user-select: none;
  a:not(.dropdown-header):not([role='menuitem']) {
    font-size: 15px;
    font-weight: 700;
  }
`

const enhance = compose(inject('store'), observer)

class NavbarComponent extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.store.configGet()
  }

  render() {
    const { store } = this.props
    const { showMessageModal } = store.app
    const { showPagesModal } = store.pages
    const { geschaeftePlusFilteredAndSorted: geschaefte, willDelete } = store.geschaefte
    const path = store.history.location.pathname
    const dataIsFiltered = geschaefte.length !== store.geschaefte.geschaefte.length
    const showBerichteNavs = path === '/pages' || path === '/geschaeftPdf'
    const showGeschaefteNavs = path === '/geschaefte' || path === '/filterFields'
    const showGeschaefteAndPrint = showBerichteNavs || showGeschaefteNavs
    const showTableNavs = path === '/table'

    return (
      <div>
        {willDelete && <ModalGeschaeftDelete />}
        {showMessageModal && <ModalMessage />}
        {showPagesModal && <PagesModal />}
        <StyledNavbar inverse fluid>
          <Nav>
            <GeschaefteNavItem href="#" onClick={() => store.history.push('/geschaefte')} showGeschaefteNavs={showGeschaefteNavs}>
              Geschäfte <StyledBadge dataIsFiltered={dataIsFiltered}>{geschaefte.length}</StyledBadge>
            </GeschaefteNavItem>
            {showGeschaefteNavs && <GeschaeftNeuNav />}
            {showGeschaefteNavs && <GeschaeftLoeschenNav showGeschaefteNavs={showGeschaefteNavs} />}
            {showGeschaefteAndPrint && <ExportGeschaefteNav />}
            {showGeschaefteAndPrint && <BerichteNav showBerichteNavs={showBerichteNavs} />}
            {showBerichteNavs && <PrintNav />}
            {showBerichteNavs && <PrintToPdfNav showBerichteNavs={showBerichteNavs} />}
            <StammdatenNav showTableNavs={showTableNavs} />
            {showTableNavs && <TableRowNeuNav />}
            {showTableNavs && <TableRowDeleteNav showTableNavs={showTableNavs} />}
          </Nav>
          <Nav pullRight>
            {!showTableNavs && <FilterNav />}
            <OptionsNav />
          </Nav>
        </StyledNavbar>
      </div>
    )
  }
}

export default enhance(NavbarComponent)
