export const menuElements = [
    {
        name: 'Home',
        address: '/',
        admin: false,
        loggedIn: false,
        alwaysVisible: true
    },
    {
        name: 'Play',
        address: '/play',
        admin: false,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'Users',
        address: '/users',
        admin: true,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'Manage',
        address: '/manage',
        admin: true,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'Shop',
        address: '/shop',
        admin: false,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'Packs',
        address: '/packs',
        admin: false,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'My Decks',
        address: '/decks',
        admin: false,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'My Profile',
        address: '/users',
        admin: false,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'Logout',
        address: '/logout',
        admin: false,
        loggedIn: true,
        alwaysVisible: false
    },
    {
        name: 'Sign In',
        address: '/sign-in',
        admin: false,
        loggedIn: false,
        alwaysVisible: false
    }
]