import { Pressable, StyleSheet, Text, View } from 'react-native'

export default TaskItem = props => {
  return (
    <View
      style={[
        styles.taskItem,
        { backgroundColor: props.done ? '#a493bd' : '#5e0acc' },
      ]}
    >
      <Pressable
        android_ripple={{ color: '#210644' }}
        onPress={props.onDeleteItem.bind(this, props.id)}
        onLongPress={() => props.onEditItem && props.onEditItem(props.id)}
      >
        <Text
          style={[
            styles.taskText,
            { textDecorationLine: props.done && 'line-through' },
          ]}
        >
          {props.text}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  taskItem: {
    margin: 8,
    borderRadius: 6,
  },
  taskText: {
    color: 'white',
    padding: 8,
  },
})
