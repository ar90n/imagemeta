import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';

const mapStateToProps = ( state ) => {
    const { loading, content } = state;
    return {
        loading : content.loading,
        content : content.content
    };
}

const ContentContainer = connect(
    mapStateToProps
)(Content);

export default ContentContainer;
