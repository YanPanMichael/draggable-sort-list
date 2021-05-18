import React from 'react';
import { DragSource } from 'react-dnd';
import Types from './types';

@DragSource(
  Types.Box,
  {
    beginDrag: (props) => {
      const { id, title, left, top } = props
      console.log('begin drag:', id, title, left, top)
      return { id, title, left, top }
    },
    endDrag: (props, monitor) => { }
  },
  (connect, monitor)=> ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)
export default class DraggableRow extends React.Component {
    getStyle = () => {
      const { left, top } = this.props;
      console.log(top, 'top') 
      console.log(left, 'left')

      const transform = `translate(${left}px, ${top}px)`
      return {
        position: 'absolute',
        transform,
      }
    }

    render() {
      const { connectDragSource, children } = this.props;
      return connectDragSource(
        <div style={this.getStyle()}>
          {children}
        </div>
      )
    }
  }
};
