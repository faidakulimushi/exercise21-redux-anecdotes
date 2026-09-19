import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote, createAnecdote } from './reducers/anecdoteReducer'
import { setNotification, clearNotification } from './reducers/notificationReducer' 
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    
    // Set notification text when voted
    dispatch(setNotification(`You voted '${anecdote.content}'`))
    
    // Clear notification text after 5 seconds
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    dispatch(createAnecdote(content))
    
    // Set notification text when created
    dispatch(setNotification(`You created a new anecdote: '${content}'`))
    
    // Clear notification text after 5 seconds
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id} style={{ marginBottom: '10px' }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} {anecdote.votes === 1 ? 'vote' : 'votes'}
            {/* Pass the entire anecdote object to the function */}
            <button onClick={() => vote(anecdote)} style={{ marginLeft: '5px' }}>
              vote
            </button>
          </div>
        </div>
      ))}
      
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App