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
  const [startIndex, setStartIndex] = useState(0);

  const listRef = useRef(list);

  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const renderList = () => {
    const listForRender = [];
    const endIndex =
      startIndex + 10 > list.length ? list.length : startIndex + 10;

    for (let i = startIndex, j = 0; i < endIndex; i++, j++) {
      const lastRef = i === startIndex + 10 - 1 ? setLastElement : null;
      listForRender.push(
        <li id={j} key={list[i].id} ref={lastRef}>
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

  const observer = React.useRef(
    new IntersectionObserver(
      entries => {
        const [first] = entries;
        if (first.isIntersecting) {
          setStartIndex(prevStartIndex => {
            if (listRef.current.length - prevStartIndex - 10 <= 0) {
              setPageNumber(prevPageNumber => prevPageNumber + 1);
            }

            return prevStartIndex + 5;
          });
        }
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
