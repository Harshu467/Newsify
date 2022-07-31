import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [page, setPage] = useState(1);
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    useEffect(() => {
        const updateNews = async () => {
            // props.setProgress(10)
            // const url = "https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=36722e63eb18429da4ac695e6a535b08&page=1&pageSize=5"
            const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
            console.log(url)
            // setLoading(true);
            // let res = await fetch(url);
            // let data = await res.json();
            // console.log(data);
            // setArticles(data.articles);
            // setTotalResults(data.totalresult);
            // setLoading(false);

            setLoading(true);
            let data = await fetch(url);
            props.setProgress(30);
            let parsedData = await data.json()
            props.setProgress(70);
            setArticles(parsedData.articles);
            setTotalResults(parsedData.totalResults);
            setLoading(false);
            props.setProgress(100);
        };
        document.title = `${capitalizeFirstLetter(props.category)} - Newsify`;
        updateNews();
        // eslint-disable-next-line
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1);
        setLoading(true);
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
        setLoading(false)

        // const url = `https://newsapi.org/v2/top-headlines?country=${props.country
        //     }&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1
        //     }&pageSize=${props.pageSize}`;
        // setPage(page + 1);
        // setLoading(true);
        // let res = await fetch(url);
        // let data = await res.json();
        // setArticles(articles.concat(data.articles));
        // setTotalResults(data.totalresult);
        // setLoading(false);
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>Newsify - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}
            <div
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}>
                <div className="container">
                    <div className="row">
                        {articles.map((info) => {
                            return (<div className="col-md-4" key={info.url}>
                                <NewsItem title={info.title ? info.title : ""} description={info.description ? info.description : ""} imageUrl={info.urlToImage} newsUrl={info.url} author={info.author} date={info.publishedAt} source={info.source.name} />
                            </div>);
                        })}
                    </div>
                </div>
            </div>
        </>
    );

};
News.defaultProps = {
    country: 'in',
    pageSize: 10,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string

}

export default News;
