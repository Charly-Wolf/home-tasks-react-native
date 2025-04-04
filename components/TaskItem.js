import { Ionicons } from '@expo/vector-icons'
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

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
        onPress={props.onMoveItem.bind(this, props.id)}
        onLongPress={() => props.onEditItem && props.onEditItem(props.id)}
        style={styles.pressable}
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
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          props.onOpenDeleteModal && props.onOpenDeleteModal(props.id)
        }
      >
        <Ionicons name='trash' size={20} color={'white'} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    justifyContent: 'center',
    margin: 8,
    borderRadius: 6,
    paddingLeft: 8,
  },
  taskText: {
    color: 'white',
    padding: 8,
  },
  pressable: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 8,
    backgroundColor: '#f31282',
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
  },
})
