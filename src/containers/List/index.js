import React, { useEffect, useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getBeerList } from './actions';
import ListItem from './components/ListItem/ListItem';
import './styles.css';

const ITEMS_IN_VIEW = 5;
const LIST_SIZE = 10;

const List = ({ getBeerList, list = [], loading }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [lastElement, setLastElement] = useState(null);
  const [firstElement, setFirstElement] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  const [topSentinelPreviousY, setTopSentinelPreviousY] = useState(0);
  const [topSentinelPreviousRatio, setTopSentinelPreviousRatio] = useState(0);
  const [bottomSentinelPreviousY, setBottomSentinelPreviousY] = useState(0);
  const [
    bottomSentinelPreviousRatio,
    setBottomSentinelPreviousRatio
  ] = useState(0);

  const topSentinelPreviousYRef = useRef(topSentinelPreviousY);
  const topSentinelPreviousRatioRef = useRef(topSentinelPreviousRatio);
  const bottomSentinelPreviousYRef = useRef(bottomSentinelPreviousY);
  const bottomSentinelPreviousRatioRef = useRef(bottomSentinelPreviousRatio);

  useEffect(() => {
    topSentinelPreviousYRef.current = topSentinelPreviousY;
    topSentinelPreviousRatioRef.current = topSentinelPreviousRatio;
    bottomSentinelPreviousYRef.current = bottomSentinelPreviousY;
    bottomSentinelPreviousRatioRef.current = bottomSentinelPreviousRatio;
  }, [
    topSentinelPreviousY,
    topSentinelPreviousRatio,
    bottomSentinelPreviousY,
    bottomSentinelPreviousRatio
  ]);

  const [hasMore, setHasMore] = useState(false);

  const listRef = useRef(list);

  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const renderList = () => {
    const listForRender = [];
    const endIndex =
      startIndex + 10 > list.length ? list.length : startIndex + 10;

    for (let i = startIndex, j = 0; i < endIndex; i++, j++) {
      const firstRef = i === startIndex ? setFirstElement : null;
      const lastRef = i === startIndex + 10 - 1 ? setLastElement : null;
      listForRender.push(
        <li id={j} key={list[i].id} ref={firstRef || lastRef}>
          {list[i].id}
          <ListItem
            name={list[i].name}
            imageUrl={list[i].image_url}
            description={list[i].description}
          />
        </li>
      );
    }

    return listForRender;
  };

  const getSlidingWindow = isScrollDown => {
    const increment = LIST_SIZE / 2;
    let firstIndex;

    if (isScrollDown) {
      firstIndex = startIndex + increment;
    } else {
      firstIndex = startIndex - increment;
    }

    if (firstIndex < 0) {
      firstIndex = 0;
    }

    return firstIndex;
  };

  const observer = React.useRef(
    new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.target.id === '0') {
            console.log('first', entry);
            const currentY = entry.boundingClientRect.top;
            const currentRatio = entry.intersectionRatio;
            const isIntersecting = entry.isIntersecting;

            console.log(currentY, currentRatio, isIntersecting);

            if (
              currentY > topSentinelPreviousYRef.current &&
              isIntersecting &&
              currentRatio >= topSentinelPreviousRatioRef.current &&
              startIndex !== 0
            ) {
              const firstIndex = getSlidingWindow(false);
              setStartIndex(() => firstIndex);

              setTopSentinelPreviousY(() => currentY);
              setTopSentinelPreviousRatio(() => currentRatio);
            }
          } else if (entry.target.id === `${LIST_SIZE - 1}`) {
            console.log('last', entry);

            const currentY = entry.boundingClientRect.top;
            const currentRatio = entry.intersectionRatio;
            const isIntersecting = entry.isIntersecting;

            console.log(currentY, currentRatio, isIntersecting);

            if (
              currentY < bottomSentinelPreviousYRef.current &&
              currentRatio > bottomSentinelPreviousRatioRef.current &&
              isIntersecting
            ) {
              const firstIndex = getSlidingWindow(true);
              setStartIndex(() => firstIndex);
            }

            setBottomSentinelPreviousY(() => currentY);
            setBottomSentinelPreviousRatio(() => currentRatio);
          }
        });
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  useEffect(() => {
    const currentElement = firstElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [firstElement]);

  useEffect(() => {
    getBeerList(pageNumber);
  }, [getBeerList, pageNumber]);

  return (
    <div className="list__wrapper">
      <ul className="list">
        {!!list.length && renderList()}
        {loading && <li>Loading...</li>}
      </ul>
    </div>
  );
};

const mapStateToProps = ({ list }) => ({
  list: list.beerList,
  loading: list.isLoading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getBeerList }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(List);
