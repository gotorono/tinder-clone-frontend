import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

function LandingPage(props) {
    useEffect(() => {
        if(props.auth.isAuthenticated) {
          props.history.push('/app');
        }
      });

    return (
        <div className="landingPage">
            <div><a href="/login">Log-In</a></div>
            <div><a href="/register">Sign-Up</a></div>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
  })

  

  export default connect(mapStateToProps)(withRouter(LandingPage));
