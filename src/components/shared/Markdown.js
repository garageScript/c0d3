import React from 'react'
import Markdown from 'react-markdown'

class MarkdownComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      previewMode: false,
      value: this.props.value || ''
    }
  }

  render () {
    const textBoxStyle = {
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
      resize: 'none',
      wrap: 'hard'
    }
    const textBox = this.state.previewMode
      ? (
        <div style={{ overflow: 'auto', width: '100%', position: 'absolute', top: '50px', bottom: '0px' }}>
          <div style={textBoxStyle} >
            <Markdown source={this.state.value} />
          </div>
        </div>
      )
      : (
        <div style={{ width: '100%', position: 'absolute', top: '50px', bottom: '0px' }}>
          <textarea style={textBoxStyle}
            value={this.state.value}
            onChange={(e) => {
              this.setState({
                value: e.target.value
              })
              this.props.onChange && this.props.onChange(e.target.value)
            }}
            ref={node => {
              if (!node) return
              this.props.setRef && this.props.setRef(node)
            }}
          />
        </div>
      )
    const toggleStyle = {
      display: 'inline-block',
      padding: '10px',
      cursor: 'pointer'
    }
    let writeBorderBottom = '5px solid #DDD'
    let previewBorderBottom = ''
    if (this.state.previewMode) {
      writeBorderBottom = ''
      previewBorderBottom = '5px solid #DDD'
    }
    const togglePreview = (previewMode) => {
      return () => {
        this.setState({
          previewMode
        })
      }
    }

    return (
      <div className='heading' style={{ width: '100%', height: '100%', border: '1px solid #DDD', position: 'relative' }}>
        <div >
          <span style={{ ...toggleStyle, borderBottom: writeBorderBottom }}
            onClick={togglePreview(false)}>
                    Write
          </span>
          <span style={{ ...toggleStyle, borderBottom: previewBorderBottom }}
            onClick={togglePreview(true)}>
                      Preview
          </span>
          <a href='https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet' target='_blank' rel='noopener noreferrer'>
            <i className='fa fa-info-circle' style={{ color: '#b3b3b3' }} />
          </a>
        </div>
        {textBox}
      </div>
    )
  }
}
export default MarkdownComponent
