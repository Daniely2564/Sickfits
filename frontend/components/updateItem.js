import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!){
        item(where:{id: $id }){
            id
            title
            description
            price
        }
    }
`

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id:ID!,
        $title:String, 
        $description: String, 
        $price:Int,
    ) {
        updateItem(
            id:$id
            title: $title
            description: $description
            price: $price
        ){
            id
            title
            description
            price
        }
    }
`;



export default class UpdateItem extends Component {
    state = {
    }
    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = (type === 'number') ? parseFloat(value) : value;
        this.setState({ [name]: val })
    }
    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
        console.log('updated')
    }
    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{
                id: this.props.id,
            }}>
                {(query) => {
                    if (query.loading) return <p>Loading...</p>
                    if (!query.data.item) return <p>Item was not found...</p>
                    return (

                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, { loading, error, called, data }) => (

                                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                                    <ErrorMessage error={error} />
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                        <input type="text" id="title" name="title"
                                                placeholder="Title"
                                                required
                                                defaultValue={query.data.item.title}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input type="number"
                                                id="price"
                                                name="price"
                                                placeholder="Price"
                                                required
                                                defaultValue={query.data.item.price}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="description">
                                            Description
                                            <textarea id="description" name="description"
                                                placeholder="Enter a description"
                                                required
                                                defaultValue={query.data.item.description}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <button>Submit</button>
                                    </fieldset>
                                </Form>
                            )
                            }
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}
