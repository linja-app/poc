import { Flex } from '@chakra-ui/react';
import { DndContext, rectIntersection } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react'
import { PullRequest } from '../../pages';
import { PullRequestData } from '../../types/data/pulls';
import KanbanLane from './KanbanLane';

const DEFAULT_COLUMNS = { 
    unassigned: "unassigned",
    assigned: "assigned",
    inReview: "in-review",
    approved: "approved",
    rejected: "rejected",
}

export type DefaultColumns = keyof typeof DEFAULT_COLUMNS;

// [ { title: "Hello"}, .... ]
type Lane = { 
    title: string;
}
type BoardState<T> = { 
    [key in keyof T]: Lane[];
}

const KanbanBoard = ({ pulls }: { pulls: PullRequestData[]}) => {
  const [boardItems, setBoardItems] = useState(() => {
    return Object.values(DEFAULT_COLUMNS).reduce((prev, current) => ({...prev, [current]: []}), {} as BoardState<typeof DEFAULT_COLUMNS>)
  });
  const [isPullsSet, setIsPullsSet] = useState(false);

  useEffect(() => {
    const shouldSetPulls = !isPullsSet && pulls && pulls.length;
    if(shouldSetPulls) {
        const pullTitles = pulls.map(p => ({ title: p.title }));
        setBoardItems({...boardItems, [DEFAULT_COLUMNS.unassigned]: [...boardItems[DEFAULT_COLUMNS.unassigned as DefaultColumns], ...pullTitles]});
        setIsPullsSet(true);
    }
   }, [pulls, isPullsSet])
  
  const initializeOnDragEndConsts = (over, current) => { 
    if(!current) return ({ container: over?.id, index: 0, parent: DEFAULT_COLUMNS.unassigned,title: "" });
    return ({ 
        container: over?.id,
        index: current.index,
        parent: current.parent,
        title: current.title
    })
  }

  const setLaneTitles = (container: DefaultColumns, title: string) => {
    setBoardItems({...boardItems, [container]: [...boardItems[container], { title }] })};

  const setParentTitles = (parent: DefaultColumns, index: number) => 
    setBoardItems(prev => ({...prev, [parent]: [...prev[parent].slice(0,index), ...prev[parent].slice(index+1)]}))

  const onDragEnd = (e) => {
    const constants = initializeOnDragEndConsts(e.over, e.active.data.current);
    const { container, index, parent, title } = constants;
    setLaneTitles(container, title);
    setParentTitles(parent, index);
  }

  return (
    <DndContext
     collisionDetection={rectIntersection}
     onDragEnd={onDragEnd}
    >
        <Flex flexDirection="column">
            <Flex flex="3">
                {Object.keys(boardItems).map(lane => (
                    <KanbanLane key={lane} title={lane as DefaultColumns} items={boardItems[lane as DefaultColumns]}  />
                ))}
            </Flex>
        </Flex>
    </DndContext>
  )
}

export default KanbanBoard