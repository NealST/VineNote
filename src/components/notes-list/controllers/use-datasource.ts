import { useState, useRef, RefObject } from 'react';
import type { IArticleItem } from "../types";

const useDataSource = function() {
  const [dataSource, setNewDataSource] = useState<IArticleItem[]>([]);
  const dataSourceRef = useRef<IArticleItem[]>([]);

  function setDataSource(newDataSource: IArticleItem[]) {
    dataSourceRef.current = newDataSource;
    setNewDataSource(newDataSource);
  }
  
  return [dataSource, dataSourceRef, setDataSource] as [IArticleItem[], RefObject<IArticleItem[]>, (newDataSource: IArticleItem[]) => void]
};

export default useDataSource;
