import React from 'react';
import { DropTarget } from 'react-dnd';
import DraggableRow from './draggable-row';
import Types from './types'

const styles = {
  width: '500px',
  height: '300px',
  position: 'relative',
  border: '1px solid black',
}

@DropTarget(
  Types.Box,
  {
    drop: (props, monitor, component) => {
      if(!component) {
        return;
      }

      const delta = monitor.getDifferenceFromInitialOffset();
      const item = monitor.getItem();
      const left = Math.round(delta.x + item.left);
      const top = Math.round(delta.y + item.top);

      console.log(left, 'left')
      console.log(top, 'top')

      component.moveBox(item.id, left, top);
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)
class Container extends React.Component {
  moveBox = (id, left, top) => {
    const { boxes }  = this.state;
    this.setState({
      boxes: {
        ...boxes,
        [id]: {
          ...boxes[id],
          left,
          top
        }
      }
    })
  }

  render() {
    const { isOver, canDrop, connectDropTarget} = this.props;
    const { boxes } = this.state;
    const isActive = isOver && canDrop;

    let backgroundColor = '#ccc';
    // 拖拽组件此时正处于 drag target 区域时，当前组件背景色变为 darkgreen
    if (isActive) {
      backgroundColor = '#453467';
    }
    // 当前组件可以放置 drag source 时，背景色变为 pink
    // else if (canDrop) {
    //   backgroundColor = 'darkkhaki';
    // }

    console.log('qqqq', this.state.boxes)
    return connectDropTarget && connectDropTarget(
      <div style={{ ...styles, backgroundColor}}>
        {Object.keys(boxes).map(item => <DraggableRow {...boxes[item]} id={item} />)}
      </div>
    )
  }
}

export default Container;