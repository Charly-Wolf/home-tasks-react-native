import { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import TaskInput from './components/modals/TaskInput'
import TasksList from './components/TasksList'
import DoneTasksList from './components/DoneTasksList'
import EditTask from './components/modals/EditTask'
import DeleteTask from './components/modals/DeleteTask'

// API_URL = process.env.API_URL
API_URL = 'https://clumsy-elane-karl-697-6bfe43c7.koyeb.app'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [doneTasks, setDoneTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [addTaskModalIsVisible, setAddTaskModalIsVisible] = useState(false)
  const [editTaskModalIsVisible, setEditTaskModalIsVisible] = useState(false)
  const [deleteTaskModalIsVisible, setDeleteTaskModalIsVisible] =
    useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [taskToDeleteId, setTaskToDeleteId] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL + '/tasks')
      const data = await response.json()

      const activeTasks = data
        .filter(task => !task.done)
        .map(task => ({ id: task._id, text: task.text }))

      const completedTasks = data
        .filter(task => task.done)
        .map(task => ({ id: task._id, text: task.text }))
      setTasks(sortTasksByText(activeTasks))
      setDoneTasks(sortTasksByText(completedTasks))
    } catch (error) {
      console.log('ERROR:', error)
      Alert.alert('Error', 'No se pudieron cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  async function modifyTask(id, done = null, text = null) {
    let body

    if (done != null) body = { done }
    if (text != null) body = { text }

    try {
      const response = await fetch(API_URL + '/tasks/' + id, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Error al modificar la tarea')
      }

      if (done !== null) {
        if (done) {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
          const movedTask = tasks.find(task => task.id === id)
          if (movedTask) {
            setDoneTasks(prevDoneTasks =>
              sortTasksByText([...prevDoneTasks, { ...movedTask, done }])
            )
          }
        } else {
          setDoneTasks(prevDoneTasks =>
            sortTasksByText(prevDoneTasks.filter(task => task.id !== id))
          )
          const movedTask = doneTasks.find(task => task.id === id)
          if (movedTask) {
            setTasks(prevTasks =>
              sortTasksByText([...prevTasks, { ...movedTask, done: false }])
            )
          }
        }
      }

      if (text) {
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task =>
            task.id === id ? { ...task, ...body } : task
          )
          return updatedTasks
        })

        setEditTaskModalIsVisible(false)
        setTaskToEdit(null)
      }
    } catch (error) {
      console.log('ERROR:', error)
      Alert.alert('Error', 'No se pudo modificar la tarea')
    }
  }

  async function addTask(enteredTaskText) {
    if (enteredTaskText.trim().length === 0) {
      Alert.alert('Error', 'Por favor ingresa una tarea válida')
      return
    }

    try {
      const response = await fetch(API_URL + '/tasks', {
        method: 'POST',
        body: JSON.stringify({ text: enteredTaskText }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Error al agregar la tarea')
      }
      const data = await response.json()
      setTasks(currentTasks =>
        sortTasksByText([
          ...currentTasks,
          { id: data._id, text: enteredTaskText },
        ])
      )
    } catch (error) {
      console.log('ERROR:', error)
      Alert.alert('Error', 'No se pudo agregar la tarea')
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(API_URL + '/tasks/' + id, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Error al eliminar la tarea')
      }
      setTasks(currentTasks => currentTasks.filter(task => task.id !== id))
    } catch (error) {
      console.log('ERROR:', error)
      Alert.alert('Error', 'No se pudo eliminar la tarea')
    }
  }

  function startAddTaskHandler() {
    setAddTaskModalIsVisible(true)
  }

  function endAddTaskHandler() {
    setAddTaskModalIsVisible(false)
  }

  function startEditTaskHandler(id) {
    const task =
      tasks.find(t => t.id === id) || doneTasks.find(t => t.id === id)

    if (!task) return

    setTaskToEdit(task)
    setEditTaskModalIsVisible(true)
  }

  function startDeleteTaskHandler(id) {
    const task =
      tasks.find(t => t.id === id) || doneTasks.find(t => t.id === id)
    if (!task) return
    setTaskToDeleteId(task.id)
    setDeleteTaskModalIsVisible(true)
  }

  function endDeleteTaskHandler() {
    setDeleteTaskModalIsVisible(false)
    setTaskToDeleteId(null)
  }

  function endEditTaskHandler() {
    setEditTaskModalIsVisible(false)
    setTaskToEdit(null)
  }

  function addTaskHandler(enteredTaskText) {
    addTask(enteredTaskText)
    endAddTaskHandler()
  }

  function markTaskAsDoneHandler(id) {
    const taskToDelete = tasks.find(g => g.id === id)

    if (!taskToDelete) return
    modifyTask(taskToDelete.id, true)
  }

  function markTaskAsNotDoneHandler(id) {
    const taskToDelete = doneTasks.find(g => g.id === id)

    if (!taskToDelete) return
    modifyTask(taskToDelete.id, false)
  }

  function deleteTaskHandler(id) {
    const taskToDelete = tasks.find(g => g.id === id)

    console.log('Id', id)
    console.log('Delete task:', taskToDelete.text)

    if (!taskToDelete) return

    deleteTask(id)
    endDeleteTaskHandler()
  }

  function deleteDoneTaskHandler(id) {
    const taskToDelete = doneTasks.find(g => g.id === id)
    console.log('Delete task:', taskToDelete.text)
  }

  function sortTasksByText(list) {
    return list.sort((a, b) => a.text.localeCompare(b.text))
  }

  return (
    <>
      <StatusBar style='dark' />
      <View style={styles.appContainer}>
        <Text style={styles.appTitle}>🛠️ Tareas de Casa 🏠</Text>
        {loading ? (
          <Text style={styles.loadingText}>Cargando tareas ...</Text>
        ) : (
          <>
            <TaskInput
              onAddTask={addTaskHandler}
              visible={addTaskModalIsVisible}
              onCancel={endAddTaskHandler}
            />
            <EditTask
              visible={editTaskModalIsVisible}
              task={taskToEdit}
              onCancel={endEditTaskHandler}
              onSaveTask={modifyTask}
            />
            <DeleteTask
              id={taskToDeleteId}
              visible={deleteTaskModalIsVisible}
              onCancel={endDeleteTaskHandler}
              onDeleteTask={deleteTaskHandler}
            />
            <FlatList
              ListHeaderComponent={
                <TasksList
                  tasks={tasks}
                  onEditItem={startEditTaskHandler}
                  onMoveItem={markTaskAsDoneHandler}
                  onOpenDeleteModal={startDeleteTaskHandler}
                />
              }
              ListFooterComponent={
                <DoneTasksList
                  doneTasks={doneTasks}
                  onMoveItem={markTaskAsNotDoneHandler}
                  onOpenDeleteModal={startDeleteTaskHandler}
                />
              }
              data={[]}
              renderItem={null}
              keyExtractor={() => Math.random().toString()} // To avoid warnings
            />
          </>
        )}
      </View>
      <Pressable style={styles.addButton} onPress={startAddTaskHandler}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </>
  )
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  appContainer: {
    flex: 0.9,
    paddingTop: 75,
    paddingHorizontal: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 20,
  },
})
