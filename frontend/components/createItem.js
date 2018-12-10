import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title:String!, 
        $description: String!, 
        $price:Int!,
        $image:String, 
        $largeImage:String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ){
            id
        }
    }
`;

export default class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0,
        image: '',
    }
    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = (type === 'number') ? parseFloat(value) : value;
        this.setState({ [name]: val })
    }
    uploadFile = async e => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits')

        const res = await fetch('http://api.cloudinary.com/v1_1/dvlpryoo/image/upload', {
            method: 'POST',
            body: data
        })
        const file = await res.json();
        console.log(file);
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        })
    }
    render() {
        return (
            <Mutation
                // refetchQueries={} makes you refetch certain queries. 
                mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error, called, data }) => (

                    <Form onSubmit={async (e) => {
                        e.preventDefault();
                        // call the mutation
                        const res = await createItem();

                        // change them to the single item page
                        console.log(res);
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id }
                        })

                    }}>
                        <ErrorMessage error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="image">
                                Image
                            <input type="file" id="image" name="Image"
                                    placeholder="Upload an Image" required
                                    onChange={this.uploadFile}
                                />
                                {this.state.image && <img src={this.state.image} width={200} alt="Upload Preview" />}
                            </label>
                            <label htmlFor="title">
                                Title
                            <input type="text" id="title" name="title"
                                    placeholder="Title" required value={this.state.title}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label htmlFor="price">
                                Price
                            <input type="number" id="price" name="price"
                                    placeholder="Price" required value={this.state.price}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label htmlFor="description">
                                Description
                            <textarea id="description" name="description"
                                    placeholder="Enter a description" required value={this.state.description}
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
    }
}
