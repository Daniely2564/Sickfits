import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Item from '../pages/item';
import styled from 'styled-components'
import Head from 'next/head';

const SingleItemStyles = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    display:grid;
    grid-auto-columns:1fr;
    grid-auto-flow: column;
    min-height: 800px;
    img{
        width:100%;
        height:100%;
        object-fit: contain;
    }

    .detail{
        margin: 3rem;
        font-size: 2rem;
    }
`

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUEURY($id:ID!){
        item(where:{ id: $id }){
            id
            title
            description
            price
            largeImage
        }
    }
`;


class SingleItem extends Component {
    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                {({ error, loading, data }) => {
                    if (error) return <p>Error...</p>
                    if (loading) return <p>Loading...</p>
                    if (!data.item) return <p>No Item found for {this.props.id}</p>
                    const { item } = data;
                    return (
                        <SingleItemStyles>
                            <Head>
                                <title>Sickfits | {item.title}</title>
                            </Head>
                            <img src={item.largeImage} alt={item.title} />
                            <div className="detail">
                                <h2>Viewing {item.title}</h2>
                                <p>{item.description}</p>
                            </div>
                        </SingleItemStyles>
                    )
                }}
            </Query>
        )
    }
}

export default SingleItem;