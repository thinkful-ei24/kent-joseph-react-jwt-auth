import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, clearAuth, showButton} from '../actions/auth';

export class App extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.loggedIn) {
            console.log('ran')
            clearTimeout(this.showRefreshButton)
            clearTimeout(this.logOutTime)
            this.askForRefresh();
            this.logOutAfterInactivity();
        }
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    askForRefresh() {
        this.showRefreshButton = setTimeout(() => {
            this.props.dispatch(showButton())}, 
            10 * 1000
        )
    }

    logOutAfterInactivity() {
        this.logOutTime = setTimeout(() => {
            this.props.dispatch(clearAuth())}, 
            30 * 1000
        );
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            // 60 * 60 * 1000 // One hour
            10 * 60 * 1000 // 10 mins
        );
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    render() {
        return (
            <div className="app">
                <HeaderBar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/register" component={RegistrationPage} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
