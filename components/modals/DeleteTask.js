import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native'

export default DeleteTask = props => {
  function deleteTaskHandler() {
    props.onDeleteTask(props.id)
  }

  return (
    <Modal visible={props.visible} animationType='fade' transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Borrar la tarea?</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title='Cancelar'
                onPress={props.onCancel}
                color={'#f31282'}
              />
            </View>
            <View style={styles.button}>
              <Button title='Borrar' onPress={deleteTaskHandler} />
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
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
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
