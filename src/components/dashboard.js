import React from 'react';
import {connect} from 'react-redux';
import requiresLogin from './requires-login';
import {fetchProtectedData} from '../actions/protected-data';
import {refreshAuthToken} from '../actions/auth'

export class Dashboard extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchProtectedData());
    }

    render() {
        let button
        if (this.props.button) {
          button = (<button onClick={e => this.props.dispatch(refreshAuthToken())}>Refresh</button>)
        }

        return (
            <div className="dashboard">
                <div className="dashboard-username">
                    Username: {this.props.username}
                </div>
                <div className="dashboard-name">Name: {this.props.name}</div>
                <div className="dashboard-protected-data">
                    Protected data: {this.props.protectedData}
                </div>
                {button}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        username: state.auth.currentUser.username,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        protectedData: state.protectedData.data,
        button: state.auth.button
    };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
