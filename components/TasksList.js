import { FlatList } from 'react-native'
import TaskItem from './TaskItem'
import ListTitle from './ListTitle'

export default TasksList = props => {
  return (
    <>
      <ListTitle title='Tareas pendientes' listSize={props.tasks.length} />
      <FlatList
        data={props.tasks}
        renderItem={itemData => (
          <TaskItem
            text={itemData.item.text}
            id={itemData.item.id}
            onDeleteItem={props.onDeleteItem}
          />
        )}
      />
    </>
  )
}
