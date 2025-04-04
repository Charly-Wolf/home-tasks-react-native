import { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import TaskInput from './components/TaskInput'
import TasksList from './components/TasksList'
import DoneTasksList from './components/DoneTasksList'

// API_URL = process.env.API_URL
API_URL = 'https://clumsy-elane-karl-697-6bfe43c7.koyeb.app'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [doneTasks, setDoneTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalIsVisible, setModalIsVisible] = useState(false)

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
      setTasks(activeTasks)
      setDoneTasks(completedTasks)
    } catch (error) {
      console.log('ERROR:', error)
      Alert.alert('Error', 'No se pudieron cargar las tareas')
    } finally {
      setLoading(false)
    }
  }

  async function modifyTask(id, done) {
    try {
      const response = await fetch(API_URL + '/tasks/' + id, {
        method: 'PUT',
        body: JSON.stringify({ done }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Error al modificar la tarea')
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
      setDoneTasks(prevDoneTasks =>
        prevDoneTasks.filter(task => task.id !== id)
      )

      if (done) {
        const movedTask = tasks.find(task => task.id === id)
        if (movedTask) setDoneTasks(prev => [...prev, { ...movedTask, done }])
      } else {
        const movedTask = doneTasks.find(task => task.id === id)
        if (movedTask)
          setTasks(prev => [...prev, { ...movedTask, done: false }])
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
      setTasks(currentTasks => [
        ...currentTasks,
        { id: data._id, text: enteredTaskText },
      ])
    } catch (error) {
      console.log('ERROR:', error)
      Alert.alert('Error', 'No se pudo agregar la tarea')
    }
  }

  function startAddTaskHandler() {
    setModalIsVisible(true)
  }

  function endAddTaskHandler() {
    setModalIsVisible(false)
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

  return (
    <>
      <StatusBar style='dark' />
      <View style={styles.appContainer}>
        <Text style={styles.appTitle}>🛠️ Tareas de Casa 🏠</Text>
        <TaskInput
          onAddTask={addTaskHandler}
          visible={modalIsVisible}
          onCancel={endAddTaskHandler}
        />
        <FlatList
          ListHeaderComponent={
            <TasksList tasks={tasks} onDeleteItem={markTaskAsDoneHandler} />
          }
          ListFooterComponent={
            <DoneTasksList
              doneTasks={doneTasks}
              onDeleteItem={markTaskAsNotDoneHandler}
            />
          }
          data={[]}
          renderItem={null}
          keyExtractor={() => Math.random().toString()} // To avoid warnings
        />
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
})
