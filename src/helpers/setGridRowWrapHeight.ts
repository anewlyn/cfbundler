const setGridRowWrapHeight = (elements: NodeListOf<Element>) => {
  elements.forEach((element) => {
    (element as HTMLElement).style.height = 'auto';
  });
  const infoHeights = Array.from(elements).map((element) => element.clientHeight);
  const maxHeight = Math.max(...infoHeights);
  elements.forEach((element) => {
    (element as HTMLElement).style.height = `${maxHeight}px`;
  });
};

export default setGridRowWrapHeight;
