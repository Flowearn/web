/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-11 14:38:05
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-12 09:09:21
 */
import React, { useLayoutEffect, useRef } from "react";

function Collapse({ id, children, expanded = false }) {
  const ref = useRef(null);
  const instant = useRef(true);
  const transition = "height 250ms ease-out";

  const openCollapse = () => {
    const node = ref.current;
    if (!node) return;

    requestAnimationFrame(() => {
      node.style.height = node.scrollHeight + "px";
    });
  };

  const closeCollapse = () => {
    const node = ref.current;
    if (!node) return;

    requestAnimationFrame(() => {
      node.style.height = node.offsetHeight + "px";
      node.style.overflow = "hidden";
      requestAnimationFrame(() => {
        node.style.height = "0";
      });
    });
  };

  useLayoutEffect(() => {
    if (expanded) {
      openCollapse();
    } else {
      closeCollapse();
    }
  }, [expanded]);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    function handleComplete() {
      if (!node) return;

      node.style.overflow = expanded ? "initial" : "hidden";
      if (expanded) {
        node.style.height = "auto";
      }
    }

    function handleTransitionEnd(event) {
      if (node && event.target === node && event.propertyName === "height") {
        handleComplete();
      }
    }

    if (instant.current) {
      handleComplete();
      instant.current = false;
    }

    node.addEventListener("transitionend", handleTransitionEnd);
    return () => node.removeEventListener("transitionend", handleTransitionEnd);
  }, [expanded]);

  return (
    <div
      className="wallet-adapter-collapse"
      id={id}
      ref={ref}
      role="region"
      style={{
        height: 0,
        transition: instant.current ? undefined : transition,
      }}
    >
      {children}
    </div>
  );
}
export default Collapse;
