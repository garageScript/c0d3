import React from 'react'
import MarkdownComponent from '../shared/Markdown.js'
const EditableInput = ({
  id,
  lid,
  fields,
  values,
  onSave,
  onDelete,
  client
}) => {
  let refs = {}

  // generates fields to display depending on whether or not tag is an input/textarea
  const fieldsToDisplay = fields.map((field, i) => {
    if (field.type === 'text') {
      return (
        <div key={i}>
          <label htmlFor={i}>{field.label}</label>
          <input
            type='text'
            id={i}
            className='form-control'
            defaultValue={values[field.label] || ''}
            ref={node => {
              refs[field.label] = node
            }}
          />
        </div>
      )
    }
    if (field.label === 'description') {
      return (
        <div>
          <label htmlFor={i}>{field.label}</label>
          <div style={{ width: '100%', height: '300px' }}>
            <MarkdownComponent setRef={node => {
              refs[field.label] = node
            }}
            value={values[field.label] || ''}
            />
          </div>
        </div>
      )
    }
    return (
      <div key={i}>
        <label htmlFor={i}>{field.label}</label>
        <textarea
          type='text'
          id={i}
          className='form-control'
          defaultValue={values[field.label] || ''}
          ref={node => {
            refs[field.label] = node
          }}
        />
      </div>
    )
  })

  // checks to see if delete button should be displayed
  // it shouldn't display if use is adding a lesson or a challenge
  const displayDeleteButton = !onDelete ? (
    ''
  ) : (
    <button
      className='btn btn-sm red lighten-1 gs-button text-capitalize'
      onClick={() => {
        onDelete({
          variables: {
            input: { id }
          }
        })
      }}
    >
      Delete
    </button>
  )

  return (
    <div>
      {fieldsToDisplay}
      <div className='gs-input-btn gs-button'>
        <button
          className='btn btn-sm green lighten-1 gs-button text-capitalize'
          onClick={() => {
            const refsValues = Object.entries(refs).reduce(
              (acc, [key, element]) => {
                acc[key] = key === 'order' ? +element.value : element.value
                return acc
              },
              {}
            )
            // id is required when deleting a challenge or lesson
            if (onDelete) refsValues['id'] = id
            // lid is only required for challenges
            if (lid) refsValues['lessonId'] = lid
            onSave({
              variables: {
                input: refsValues
              }
            })
          }}
        >
          Save
        </button>
        <button
          className='btn btn-sm orange lighten-1 gs-button text-capitalize'
          onClick={() => {
            // if onDelete DNE, it means we are adding a new challenge or lesson
            // cause we don't need to delete the challenge or lesson we are adding.
            // if that's the case, when we click cancel addNew will turn false
            // and take the user back to the previous page.
            if (!onDelete) {
              client.writeData({
                data: {
                  addNew: false
                }
              })
            } else {
              // if onDelete does exist, means we are merely updating a challnege or
              // lesson. so if we click cancel, it will revert all the changes that
              // were made on the fields.
              Object.keys(refs).forEach(key => {
                refs[key].value = values[key] || ''
              })
            }
          }}
        >
          Cancel
        </button>
        {displayDeleteButton}
      </div>
    </div>
  )
}

export default EditableInput
