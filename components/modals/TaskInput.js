import { useState } from 'react'
import { Button, Modal, StyleSheet, TextInput, View } from 'react-native'

export default TaskInput = props => {
  const [enteredTaskText, setEnteredTaskText] = useState('')

  function taskInputHandler(enteredText) {
    setEnteredTaskText(enteredText)
  }

  function addTaskHandler() {
    props.onAddTask(enteredTaskText)
    setEnteredTaskText('')
  }

  return (
    <Modal visible={props.visible} animationType='fade' transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Nueva tarea'
            style={styles.textInput}
            onChangeText={taskInputHandler}
            value={enteredTaskText}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title='Cancelar'
                onPress={props.onCancel}
                color={'#f31282'}
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Agregar tarea'
                onPress={addTaskHandler}
                disabled={enteredTaskText.trim().length < 1}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#rgba(0, 0, 0, 0.2)',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '25%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e4d0ff',
    color: '#120438',
    borderRadius: 6,
    width: '100%',
    borderRadius: 4,
    padding: 16,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
  },
  button: {
    width: '150',
    marginHorizontal: 8,
  },
})
