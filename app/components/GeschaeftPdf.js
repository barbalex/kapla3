import React from 'react'
import moment from 'moment'
import styled, { injectGlobal } from 'styled-components'

import Geschaeft from './geschaeft/Geschaeft'
// import logoImg from '../etc/logo.png'

/*
 * need defined height and overflow
 * to make the pages scrollable in UI
 * is removed in print
 */
const Container = styled.div`
  background-color: #eee;
  font-size: 9pt;
  cursor: default;
  overflow-y: auto;
  height: 100vh;

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    /* with overflow auto an empty page is inserted between each page */
    overflow-y: visible;
    /* make sure body grows as needed */
    height: auto !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const PageContainer = styled.div`
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;
  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* set dimensions */
  height: 29.7cm;
  width: 21cm;
  padding: 1.5cm;

  overflow-y: visible;

  @media print {
    /**
     * something seems to change the measurements
     * if they are not repeated here using important
     */
    height: 29.7cm !important;
    width: 21cm !important;
    margin: 0 !important;
    padding: 1.5cm !important;
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
// eslint-disable-next-line no-unused-expressions
injectGlobal`
  @page .hochformat {
    margin: 1.5cm;
    size: A4 portrait;
  }
`
const Footer = styled.div`
  /* push down as far as possible */
  padding-top: 5px;
  margin-bottom: 0;
`

const GeschaeftPdf = () =>
  <Container className="geschaeftPdf hochformat">
    <PageContainer>
      {/*
        <img
        src={logoImg}
        height="40"
        style={{
          marginBottom: 2
        }}
      />
      */}
      <Geschaeft />
      <Footer>
        {moment().format('DD.MM.YYYY')}
      </Footer>
    </PageContainer>
  </Container>

GeschaeftPdf.displayName = 'GeschaeftPdf'

export default GeschaeftPdf
