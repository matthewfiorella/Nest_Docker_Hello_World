import React, { Component, createContext, useContext } from 'react';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Auth0ClientOptions } from '@auth0/auth0-spa-js';

interface ContextValueType {
    isAuthenticated?: boolean,
    user?: any,
    isLoading?: boolean,
    handleRedirectCallback?: () => void,
    getIdTokenClaims?: (...p: any) => any,
    loginWithRedirect?: (...p: any) => any,
    getTokenSilently?: (...p: any) => any,
    logout?: (...p: any) => any
}

// create the context
export const Auth0Context: any = createContext<ContextValueType | null>(null);
export const useAuth0: any = () => useContext(Auth0Context);
interface IState {
    auth0Client: any,
    isLoading: boolean,
    isAuthenticated: boolean,
    user?: any,
}

export class Auth0Provider extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: true,
            isAuthenticated: false,
            user: null,
            auth0Client: Auth0Client,
        };
    }

    config: Auth0ClientOptions= {
        domain: "dev-n764kbt0fxmhjepd.us.auth0.com",
        clientId: "xBJKy9uWLyW9RzGDPH5WObRwTA89b8Zr",
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    };
    componentDidMount() {
        this.initializeAuth0();
    }
    // initialize the auth0 library
    initializeAuth0 = async () => {
        const auth0Client = await createAuth0Client(this.config);
        this.setState({ auth0Client });
        // check to see if they have been redirected after login
        if (window.location.search.includes('code=')) {
            return await this.handleRedirectCallback( auth0Client );
        }
        const isAuthenticated = await auth0Client.isAuthenticated();
        const user = isAuthenticated ? await auth0Client.getUser() : null;
        this.setState({ isLoading: false, isAuthenticated, user });
    };

    handleRedirectCallback = async (auth0Client: Auth0Client) => {
        this.setState({ isLoading: true });
        await auth0Client.handleRedirectCallback();
        const user = auth0Client.getUser();
        this.setState({ user, isAuthenticated: true, isLoading: false });
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    render() {
        const { auth0Client, isLoading, isAuthenticated, user } = this.state;
        const { children } = this.props;
        const configObject = {
            isLoading,
            isAuthenticated,
            user,
            loginWithRedirect: (...p: any) => auth0Client.loginWithRedirect(...p),
            getTokenSilently: (...p: any) => auth0Client.getTokenSilently(...p),
            getIdTokenClaims: (...p: any) => auth0Client.getIdTokenClaims(...p),
            logout: (...p: any) => auth0Client.logout(...p)
        };

        return <Auth0Context.Provider value={configObject}>{children}</Auth0Context.Provider>
    }
}