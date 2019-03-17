import React from 'react'
import Markdown from 'react-markdown'

class MarkdownComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      previewMode: false
    }
  }
  handleInput (event) {
    this.state.value = event.target.value
  }

  render () {
    const textBoxStyle = {
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
      resize: 'none',
      wrap: 'hard'
    }
    const textBox = this.state.previewMode ? <div style={textBoxStyle} > <Markdown source={this.state.value} /></div>
      : <textarea style={textBoxStyle} value={this.state.value} onChange={(e) => {
        this.setState({
          value: e.target.value
        })
        this.props.onChange && this.props.onChange(e.target.value)
      }}
      />
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
    return (
      <div className='heading' style={{ width: '100%', height: '100%', border: '1px solid #DDD', position: 'relative' }}>
        <div >
          <span style={{ ...toggleStyle, borderBottom: writeBorderBottom }}
            onClick={() => {
              this.setState({
                previewMode: false,
                value: this.state.value
              })
            }}>
                    Write
          </span>
          <span style={{ ...toggleStyle, borderBottom: previewBorderBottom }}
            onClick={() => {
              this.setState({
                previewMode: true
              })
            }}>
                      Preview
          </span>
        </div>
        <div style={{ width: '100%', position: 'absolute', top: '50px', bottom: '0px' }}>
          {textBox}
        </div>
      </div>
    )
  }
}
export default MarkdownComponent
