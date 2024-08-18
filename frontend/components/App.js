import React, { useDebugValue, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

const initialArticleId = null;
const initialFormValues2 = { title: '', text: '', topic: '' }

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [secondValues,setSecondValues]=useState(initialFormValues2)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/") }
  const redirectToArticles = () => { navigate("/articles") }

  const logout = () => {
    // ✨ implement
    window.localStorage.clear();
    setMessage("Goodbye!")
    redirectToLogin();
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true)
    const credentials = {userName : username.trim(), password : password.trim()}
    axios.post("http://localhost:9000/api/login",credentials).then(res=> {
      window.localStorage.setItem("token",JSON.stringify(res.data.token))
      setMessage(res.data.message);
      redirectToArticles();
      setSpinnerOn(false);
    })
    .catch(err=> {
      setSpinnerOn(false); 
      console.error(err.message)})
  }

  const getArticles = () => {
    setMessage(""); 
    setSpinnerOn(true);
    axiosWithAuth().get("http://localhost:9000/api/articles").then(res=> {
      setArticles(res.data.articles)
      setMessage(res.data.message)
    }).catch(err=> {
      redirectToLogin();
      console.error(err.message);
    })
    .finally(()=> setSpinnerOn(false));
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }
  const putArticle = (idToChange,modified) => {
    axiosWithAuth().put(`http://localhost:9000/api/articles/${idToChange}`,modified)
    .then((res)=> {
      defaultGet().then(res=> {
      setArticles(res.data.articles)
      setSecondValues(initialFormValues2)
    })
      setMessage(res.data.message)
    }).catch(err=> console.error(err.message))
    .finally(()=> canceleable())
  }

  const defaultGet = () => {
    return axiosWithAuth().get("http://localhost:9000/api/articles")
  }

  const postArticle = (article) => {
    // ✨ implement
    axiosWithAuth().post(" http://localhost:9000/api/articles",article)
    .then((res)=> {
      defaultGet().then(res=> {
      setArticles(res.data.articles)
      setSecondValues(initialFormValues2)
    })
      setMessage(res.data.message)
    })
    .catch(err=> console.error(err.message));
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = (article) => {
    setCurrentArticleId(article); 
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(` http://localhost:9000/api/articles/${article_id}`)
    .then((res)=> {
      axiosWithAuth().get("http://localhost:9000/api/articles").then(res=> {
      setArticles(res.data.articles)})
      setMessage(res.data.message)
      setSecondValues(initialFormValues2)
    }).catch(err=> console.error(err.message));
    // ✨ implement
  }
  const canceleable = () => {
    setCurrentArticleId(initialArticleId);
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn = {spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login = {login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm currentArticle={currentArticleId} updateArticle={updateArticle} postArticle={postArticle} putArticle = {putArticle}
               canceleable = {canceleable} setCurrentArticleId = {setCurrentArticleId} secondValues = {secondValues} setSecondValues = {setSecondValues}/>

              <Articles redirectToLogin = {redirectToLogin} getArticles={getArticles} articles={articles}
              updateArticle = {updateArticle} deleteArticle ={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}


