/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-11 20:28:13
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-14 15:13:07
 */
import { useState, useEffect } from 'react';
const elementWidth = import.meta.env.VITE_ELEMENT_WIDTH;
const useDynamicLayout = (ranKingRef, connected, defaultDivCount = 4, marginRight = 10, divRef) => {
  const [divCount, setDivCount] = useState(defaultDivCount);
  const [padding, setPadding] = useState(0);
  const [divWidth, setDivWidth] = useState(265);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= elementWidth);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= elementWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateLayout = () => {
    if (ranKingRef.current) {
      const containerWidth = ranKingRef.current.offsetWidth;
      let width = isMobile ? divRef?.current?.offsetWidth : 265;
      setDivWidth(width);
      const totalDivWidth = divWidth + marginRight;

      // 计算最大可能容纳的 div 数量
      const maxDivCount = Math.floor(containerWidth / totalDivWidth);

      // 设置当前容纳的 div 数量，至少为 1
      const count = Math.max(1, maxDivCount);

      const totalWidth = count * divWidth + (count - 1) * marginRight;
      const paddingValue = (containerWidth - totalWidth) / 2;

      setDivCount(count);
      setPadding(paddingValue);
    }
  };

  useEffect(() => {
    calculateLayout(); 
    window.addEventListener('resize', calculateLayout); 

    return () => {
      window.removeEventListener('resize', calculateLayout);
    };
  }, [ranKingRef, divWidth, marginRight]);

  useEffect(() => {
    calculateLayout();
  }, [connected, calculateLayout]);

  return { divCount, padding };
};

export default useDynamicLayout;
