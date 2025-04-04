import { useEffect, useState } from 'react'
import { Button, Modal, StyleSheet, TextInput, View } from 'react-native'

export default TaskInput = props => {
  const [editedTaskText, setEditedTaskText] = useState('')

  useEffect(() => {
    if (props.task) {
      setEditedTaskText(props.task.text)
    }
  }, [props.task])

  function taskInputHandler(enteredText) {
    setEditedTaskText(enteredText)
  }

  function saveTaskHandler() {
    props.onSaveTask(props.task.id, null, editedTaskText)
  }

  return (
    // <Modal visible={props.visible} animationType='fade' transparent={true}>
    <Modal visible={props.visible} animationType='fade' transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Texto de la tarea'
            style={styles.textInput}
            onChangeText={setEditedTaskText}
            value={editedTaskText}
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
                title='Guardar'
                onPress={saveTaskHandler}
                disabled={editedTaskText.trim().length < 1}
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
