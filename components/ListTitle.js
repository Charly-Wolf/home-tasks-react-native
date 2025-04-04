import { StyleSheet, Text, View } from 'react-native'

export default ListTitle = props => {
  return (
    <Text
      style={[
        styles.listTitle,
        { color: props.title === 'Tareas terminadas' ? 'gray' : 'black' },
      ]}
    >
      {props.title} {props.listSize}
    </Text>
  )
}
const styles = StyleSheet.create({
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 8,
    marginVertical: 16,
  },
})
