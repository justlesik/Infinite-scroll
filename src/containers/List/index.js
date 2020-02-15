import React, { useEffect, useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getBeerList } from './actions';
import ListItem from './components/ListItem/ListItem';
import './styles.css';

const ITEMS_IN_VIEW = 5;

const List = ({ getBeerList, list = [], loading }) => {
  const [lastIndex, setLastIndex] = useState([0, 10]);
  const [pageNumber, setPageNumber] = useState(1);
  const [lastElement, setLastElement] = useState(null);
  const [firstElement, setFirstElement] = useState(null);
  const [renderedList, setRenderList] = useState([]);

  const listRef = useRef(list);
  const renderedListRef = useRef(renderedList);

  const getPrevListForRender = (initList, prevList) => {
    const foundedIndex = initList.findIndex(item => {
      const lastElem = prevList[prevList.length - 1];
      return item.id === lastElem.id;
    });

    if (foundedIndex !== 0) {
      setRenderList(initList.slice(foundedIndex, foundedIndex + 10));
    }
  };
  const getNextListForRender = (initList, prevList) => {
    const foundedIndex = initList.findIndex(item => {
      const lastElem = prevList[prevList.length - 1];

      return item.id === lastElem.id;
    });

    if (foundedIndex === initList.length - 1) {
      setPageNumber(prevPageNumber => prevPageNumber + 1);

      setLastIndex([
        foundedIndex - ITEMS_IN_VIEW + 1,
        foundedIndex + ITEMS_IN_VIEW + 1
      ]);
    }

    setRenderList(
      initList.slice(
        foundedIndex - ITEMS_IN_VIEW + 1,
        foundedIndex + ITEMS_IN_VIEW + 1
      )
    );
  };

  const observerLast = React.useRef(
    new IntersectionObserver(
      entries => {
        const [first] = entries;
        console.log('LAST', first);
        if (first.isIntersecting) {
          getNextListForRender(listRef.current, renderedListRef.current);
        }
      },
      { threshold: 1 }
    )
  );

  const observerFirst = React.useRef(
    new IntersectionObserver(
      entries => {
        const [first] = entries;
        console.log('FIRST', first);
        if (first.isIntersecting) {
          getPrevListForRender(listRef.current, renderedListRef.current);
        }
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    listRef.current = list;
    renderedListRef.current = renderedList;
  }, [list, renderedList]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observerLast.current;

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
    const currentObserver = observerFirst.current;

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

  useEffect(() => {
    setRenderList(list.slice(...lastIndex));
  }, [setRenderList, list, lastIndex]);
  return (
    <div className="list__wrapper">
      <ul className="list">
        {renderedList.map((item, index) => {
          if (index === 0) {
            return (
              <li key={item.id} ref={setFirstElement}>
                {item.id}
                <ListItem
                  name={item.name}
                  imageUrl={item.image_url}
                  description={item.description}
                />
              </li>
            );
          }

          if (renderedList.length === index + 1) {
            return (
              <li key={item.id} ref={setLastElement}>
                {item.id}
                <ListItem
                  name={item.name}
                  imageUrl={item.image_url}
                  description={item.description}
                />
              </li>
            );
          }

          return (
            <li key={item.id}>
              {item.id}
              <ListItem
                name={item.name}
                imageUrl={item.image_url}
                description={item.description}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  list: state.list.beerList,
  loading: state.list.isLoading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getBeerList }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(List);
