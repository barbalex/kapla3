import React, { PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import { Glyphicon } from 'react-bootstrap'
import { shell } from 'electron'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import regularStyles from './areaLinks.css'
import pdfStyles from './areaLinksPdf.css'

const StyledDropzone = styled(Dropzone)`
  width: 100%;
  height: 100%;
  border-color: transparent;
`
const DropzoneInnerDiv = styled.div`
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-color: #666;
  border-style: dashed;
  border-radius: 5px;
  padding: 5px;
`
const Container = styled.div`
  grid-area: areaLinks;
  background-color: ${props =>
    props['data-isPdf'] ? 'rgb(227, 232, 255)' : '#e3fff0'};
  display: grid;
  grid-template-columns: ${props =>
    props['data-isPdf'] ? '100%' : 'calc(100% - 308px) 300px'};
  grid-template-areas: ${props =>
    props['data-isPdf']
      ? `'title' 'links'`
      : `'title dropzone' 'links dropzone'`};
  grid-column-gap: 8px;
  grid-row-gap: ${props => (props['data-isPdf'] ? '1px' : '8px')};
  padding: 8px;
  /*pdf*/
  border: ${props => (props['data-isPdf'] ? '1px solid #ccc' : 'none')};
  border-bottom: none;
  font-size: ${props => (props['data-isPdf'] ? '10px' : 'inherit')};
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onDrop: props => files => {
      const { store } = props
      const { linkNewCreate } = store
      const { activeId } = store.geschaefte
      linkNewCreate(activeId, files[0].path)
    },
  }),
  observer
)

const AreaLinks = ({ store, onDrop }) => {
  const { linkRemove } = store
  const { activeId, links } = store.geschaefte
  const myLinks = links.filter(l => l.idGeschaeft === activeId)
  const path = store.history.location.pathname
  const isPdf = path === '/geschaeftPdf'
  const styles = isPdf ? pdfStyles : regularStyles

  return (
    <Container data-isPdf={isPdf}>
      <div className={styles.title}>Links</div>
      <div className={styles.links}>
        {myLinks.map(link => (
          <div key={`${link.idGeschaeft}${link.url}`} className={styles.fields}>
            <div className={styles.url}>
              <a
                href={link.url}
                onClick={event => {
                  event.preventDefault()
                  shell.openItem(link.url)
                }}
              >
                {link.url}
              </a>
            </div>
            <div className={styles.deleteGlyphiconDiv}>
              <Glyphicon
                glyph="remove-circle"
                onClick={() => linkRemove(activeId, link.url)}
                className={styles.removeGlyphicon}
                title="Link entfernen"
              />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.dropzoneContainer}>
        <StyledDropzone onDrop={onDrop}>
          {({ isDragActive, isDragReject }) => {
            if (isDragActive) {
              return (
                <DropzoneInnerDiv>
                  <div>jetzt fallen lassen...</div>
                </DropzoneInnerDiv>
              )
            }
            if (isDragReject) {
              return (
                <DropzoneInnerDiv>
                  <div>Hm. Da ging etwas schief :-(</div>
                </DropzoneInnerDiv>
              )
            }
            return (
              <DropzoneInnerDiv>
                <div>Datei hierhin ziehen...</div>
                <div>...oder klicken, um sie zu wählen.</div>
              </DropzoneInnerDiv>
            )
          }}
        </StyledDropzone>
      </div>
    </Container>
  )
}

AreaLinks.displayName = 'AreaLinks'

AreaLinks.propTypes = {
  store: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
}

export default enhance(AreaLinks)
