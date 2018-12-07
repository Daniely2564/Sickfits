import React, { Component } from 'react';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import Header from './Header';
import Meta from './Meta';

const theme = {
    RED: `#DB2828`,
    ORANGE: `#F2711C`,
    YELLOW: `#FBBD08`,
    OLIVE: `#B5CC18`,
    GREEN: '#21BA45',
    TEAL: '#00B5AD',
    BLUE: '#2185D0',
    VIOLOET: '#6435C9',
    PURPLE: '#A333C8',
    PINK: '#E03997',
    BROWN: '#A5673F',
    GREY: '#767676',
    BLACK: '#1B1C1D',
    WHITE: '#fff',
    ORANGEYELLOW: '#F8B195',
    ORANGERED: '#F67280',
    DARKPINK: '#C06C84',
    DARKVIOLET: '#6C5B7B',
    YELLOWBLUE: '#355C7D',
    LIGHTBLACK: '#2A363B',
    WHITERED: '#FF8C94',
    WHITEORANGE: '#FFAAA6',
    WHITEYELLOW: '#FFD3B5',
    WHITEGREEN: '#DCEDC2',
    WHITEOLIVE: '#A8E6CE',
    maxWidth: '1000px',
}
theme.red = theme.RED;

const StyledPage = styled.div`
    background: white;
    color: ${props => props.theme.BLACK};
`

const Inner = styled.div`
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
    padding: 2rem;
`

injectGlobal`
    @font-face {
        font-family: 'radnika_next';
        src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
        font-weight: normal;
        font-style:normal;
    }
    html{
        box-sizing: border-box;
        font-size: 10px;
    }
    *, *:before, *:after{
        box-sizing: inherit;
    }
    body{
        padding:0;
        margin:0;
        font-size: 1.5rem;
        line-height: 2;
        font-family:'radnika_next';
    }
    a{
        text-decoration:none;
        color: ${theme.BLACK}
    }
`

class Page extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <StyledPage>
                    <Meta />
                    <Header />
                    <Inner>{this.props.children}</Inner>
                </StyledPage>
            </ThemeProvider>
        )
    }
}

export default Page;

/*
import styled from 'styled-components';

const MyButton = styled.button`
    background:red;
    font-size: ${props => props.huge ? '10px' : '20px'}
    span{
        font-size:110px;
    }
    const UsingStyled = (

    <MyButton huge>
        This is Page Component
        <span>Span in Button</span>
    </MyButton>
)
`;
 */