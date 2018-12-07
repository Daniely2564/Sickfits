import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id:ID!){
        deleteItem(id:$id){
            id
        }
    }
`

class DeleteItem extends Component {
    update = (cache, payload) => {
        //manually update cache, so that it matches the server
        //1. Read the Cache we wnat to read, must use graphql to access cache.
        const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
        console.log(data, payload);
        //2. filter the deleted item out of the page
        data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
        cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
    }
    render() {
        return (
            <Mutation
                mutation={DELETE_ITEM_MUTATION}
                variables={{
                    id: this.props.id
                }}
                update={this.update}
            >
                {(deleteItem, { error }) => {
                    return (
                        <button onClick={() => {
                            if (confirm('Are you sure you want to delete this item?')) {
                                deleteItem();
                            }
                        }}>
                            {this.props.children}
                        </button>
                    )
                }}
            </Mutation>
        )
    }
}
export default DeleteItem;