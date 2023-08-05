import styles from '../../styles/Feed.module.css';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

const Feed = ({ pageNumber }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchNewsData(pageNumber)
      .then((data) => {
        setIsLoading(false);
        setError(null);
        setArticles(data.articles);
      })
      .catch((error) => {
        setIsLoading(false);
        setError('Failed to fetch data from the News API.');
        console.error(error);
      });
  }, [pageNumber]);

  const handleArticleClick = (url) => {
    router.push(url);
  };

  const fetchNewsData = async (pageNumber) => {
    const apiResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&page=${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_NEWS_KEY}`,
        },
      }
    );

    if (!apiResponse.ok) {
      throw new Error('Failed to fetch data from the News API.');
    }

    const json = await apiResponse.json();
    return json;
  };

  const handleNextPageClick = () => {
    if (pageNumber < 5) {
      router.push(`/feed/${pageNumber + 1}`);
    }
  };

  const handlePreviousPageClick = () => {
    if (pageNumber > 1) {
      router.push(`/feed/${pageNumber - 1}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className={styles.main}>
        {articles.map((article, index) => (
          <div key={index} className={styles.post}>
            <h1 onClick={() => handleArticleClick(article.url)}>{article.title}</h1>
            <p>{article.description}</p>
            {!!article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
          </div>
        ))}
      </div>
      <div className={styles.paginator}>
        <div
          className={pageNumber === 1 ? styles.disabled : styles.active}
          onClick={handlePreviousPageClick}
        >
          Previous Page
        </div>
        <div>#{pageNumber}</div>
        <div
          className={pageNumber === 5 ? styles.disabled : styles.active}
          onClick={handleNextPageClick}
        >
          Next Page
        </div>
      </div>
    </>
  );
};

export default Feed;
