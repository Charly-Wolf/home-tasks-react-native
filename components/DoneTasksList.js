import { FlatList } from 'react-native'
import TaskItem from './TaskItem'

export default DoneTasksList = props => {
  return (
    <>
      <ListTitle title='Tareas terminadas' listSize={props.doneTasks.length} />
      <FlatList
        data={props.doneTasks}
        renderItem={itemData => (
          <TaskItem
            text={itemData.item.text}
            id={itemData.item.id}
            onDeleteItem={props.onDeleteItem}
            done={true}
          />
        )}
      />
    </>
  )
}
