import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  // ✨ where are my props? Destructure them here
  const {updateArticle, postArticle, currentArticle, putArticle, canceleable, setCurrentArticleId,
  secondValues,setSecondValues
  } = props;
    

  useEffect(() => {
    if (currentArticle) {
      setSecondValues(currentArticle);
    }
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
  }, [currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setSecondValues({ ...secondValues, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    if (currentArticle) {
      putArticle(currentArticle.article_id,secondValues)
    } else {
      postArticle(secondValues);
    }
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
  }

  const isDisabled = () => {
    if (secondValues.title && secondValues.text && secondValues.topic) {
      return false;
    } return true;
    // ✨ implement
    // Make sure the inputs have some values
  }

  const cancel = (e) => { 
    e.preventDefault();
    setSecondValues(initialFormValues)
    canceleable();
  }

  return (
   // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit" : "Create"} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={secondValues.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={secondValues.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={secondValues.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={e=>cancel(e)}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
