// Redux setup (assuming you have redux and react-redux installed)
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Actions
const ADD_TASK = 'ADD_TASK';
const TOGGLE_TASK = 'TOGGLE_TASK';
const EDIT_TASK = 'EDIT_TASK';

// Reducer
const initialState = {
  tasks: [],
  filter: 'ALL' // Can be 'ALL', 'DONE', or 'NOT_DONE'
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, isDone: !task.isDone } : task
        )
      };
    case EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, description: action.payload.description } : task
        )
      };
    default:
      return state;
  }
};

// Action creators
const addTask = (id, description, isDone) => ({
  type: ADD_TASK,
  payload: { id, description, isDone }
});

const toggleTask = id => ({
  type: TOGGLE_TASK,
  payload: id
});

const editTask = (id, description) => ({
  type: EDIT_TASK,
  payload: { id, description }
});

// Redux store
const store = createStore(reducer);

// Components
const AddTask = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
      <button onClick={handleAdd}>Add Task</button>
    </div>
  );
};

const ListTask = ({ tasks, filter, onToggle, onEdit }) => {
  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(task => filter === 'DONE' ? task.isDone : !task.isDone);

  return (
    <ul>
      {filteredTasks.map(task => (
        <Task key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} />
      ))}
    </ul>
  );
};

const Task = ({ task, onToggle, onEdit }) => {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleEdit = () => {
    const newDescription = prompt('Enter new description:', task.description);
    if (newDescription !== null) {
      onEdit(task.id, newDescription);
    }
  };

  return (
    <li>
      <input type="checkbox" checked={task.isDone} onChange={handleToggle} />
      <span>{task.description}</span>
      <button onClick={handleEdit}>Edit</button>
    </li>
  );
};

// Main App component
const App = () => {
  const tasks = useSelector(state => state.tasks);
  const filter = useSelector(state => state.filter);
  const dispatch = useDispatch();

  const handleAddTask = description => {
    const id = tasks.length + 1;
    dispatch(addTask(id, description, false));
  };

  const handleToggleTask = id => {
    dispatch(toggleTask(id));
  };

  const handleEditTask = (id, description) => {
    dispatch(editTask(id, description));
  };

  return (
    <div>
      <AddTask onAdd={handleAddTask} />
      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'ALL' })}>All</button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'DONE' })}>Done</button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'NOT_DONE' })}>Not Done</button>
      </div>
      <ListTask tasks={tasks} filter={filter} onToggle={handleToggleTask} onEdit={handleEditTask} />
    </div>
  );
};

// Render the app
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
