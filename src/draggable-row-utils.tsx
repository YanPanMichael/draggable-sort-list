import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };
    const { className } = restProps;
    // eslint-disable-next-line max-len
    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    props.moveRow(dragIndex, hoverIndex);

    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
  },
};

const DraggableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(DragSource('row', rowSource, connect => ({
  connectDragSource: connect.dragSource(),
}))(BodyRow));

export default DraggableBodyRow;
