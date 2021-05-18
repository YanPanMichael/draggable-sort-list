import React, { Component } from 'react';
import classnames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Table } from 'antd';
import VideoItem from './videoItem';
import DraggableRow from './draggable-row';

import './style';

const prefix = 'mo-template-pc';
const { Column } = Table;

class DraggableSortList extends Component {
  static defaultProps = {
    dataSource: [],
    setItemParam: () => {},
    onChange: () => {},
  };

  static VideoItem = (props) => {
    const { item, param } = props;
    return <VideoItem item={item} param={param} key={item.itemId} />;
  };

  render() {
    const cls = classnames({
      [`${prefix}`]: true,
      [className]: className,
    });
    return (
      <div className={cls}>
        <DndProvider backend={HTML5Backend}>
          <Container />
        </DndProvider>
      </div>);
  }
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

  components = {
    body: {
      row: DraggableRow,
    },
  };

  handleMove = (curItemIndex, targetIndex) => {
    const { dataSource, onChange } = this.props;
    const targetItem = dataSource[targetIndex];
    if (curItemIndex > -1) {
      const spliceItem = dataSource.splice(curItemIndex, 1);
      const index = dataSource.findIndex((key) => key.videoId === targetItem.videoId);
      dataSource.splice(curItemIndex < targetIndex ? index + 1 : index, 0, ...spliceItem);
      onChange(dataSource);
      this.forceUpdate();
    }
  };

  renderSortItem = (item) => {
    const { setItemParam } = this.props;
    let param = {};
    if (typeof setItemParam === 'function') {
      const tmp = setItemParam(item);
      if (Object.prototype.toString.call(tmp) === '[object Object]') {
        param = tmp;
      }
    }
    return <DraggableRow {...boxes[item]} id={item} item={item} param={param} key={item.itemId} />;
  };

  onRowFun = (record, index) => {
    return { index, moveRow: this.handleMove };
  };

  render() {
    const { isOver, canDrop, connectDropTarget} = this.props;
    const { dataSource, className } = this.props;
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
      <Table
        dataSource={dataSource}
        components={this.components}
        onRow={this.onRowFun}
        bordered={false}
        rowKey="itemId"
        showHeader={false}
        pagination={false}>
        <Column width={200} key="itemId" render={this.renderSortItem} />
      </Table>
    )
  }
}

export default DraggableSortList;


