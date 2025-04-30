import { useState } from 'react';

export const useHover = function() {
  const [hoverItemId, setHoverItemId] = useState('');
  
  function onEnter(id: string) {
    setHoverItemId(id);
  }

  function onLeave() {
    setHoverItemId('');
  }

  return [hoverItemId, onEnter, onLeave] as [string, (enterId: string) => void, () => void];
};

