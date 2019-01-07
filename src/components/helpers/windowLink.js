import React from 'react';

const windowLink = props => {
  return (
    <a href={props.href} rel="noopener noreferrer" target="_blank">
      {props.children}
    </a>
  );
};

export default windowLink;
