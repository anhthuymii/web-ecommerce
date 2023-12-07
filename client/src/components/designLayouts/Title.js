import React from "react";
import { Helmet } from "react-helmet";

const title = ({ title, children, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
      </Helmet>
    </div>
  );
};

export default title;
