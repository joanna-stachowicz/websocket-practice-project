import React from 'react';
import { v1 as uuidv1 } from 'uuid';

const io = require('socket.io-client')
class App extends React.Component {
  componentDidMount() {
    this.socket = io('ws://localhost:8000');

    this.socket.on('addTask', ({ name, id }) => this.addTask(name, id));
    this.socket.on('removeTask', (id) => this.removeTaskFromList(id));
    this.socket.on('updateData', (tasks) => this.updateData(tasks));
  }

  state = {
    tasks: [],
    taskName: '',
  }

  removeTask(id) {
    this.removeTaskFromList(id);
    this.socket.emit('removeTask', id)
  }

  removeTaskFromList(id) {
    this.setState(state => ({
      tasks: state.tasks.filter((task) => {
        return (task.id !== id);
      })
    }));
  }

  changeTask(taskName) {
    this.setState(state => ({
      tasks: state.tasks,
      taskName: taskName,
    }));
  }

  submitForm(event) {
    event.preventDefault();
    const id = uuidv1();
    this.addTask(this.state.taskName, id);
    this.changeTask('');
    this.socket.emit('addTask', { name: this.state.taskName, id: id });
  }

  addTask(task, id) {
    this.setState(state => ({
      taskName: state.taskName,
      tasks: [
        ...state.tasks,
        {
          name: task,
          id: id
        }
      ]
    }))
  }

  updateData(tasks) {
    this.setState(state => ({
      taskName: state.taskName,
      tasks: tasks,
    }));
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(({ name, id }) => (
              <li key={id} className="task">{name}<button className="btn btn--red" onClick={() => this.removeTask(id)}>Remove</button></li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={(event) => this.submitForm(event)}>
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={this.state.taskName} onChange={event => this.changeTask(event.target.value)} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };
};

export default App;