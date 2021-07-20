import React, { useEffect } from "react"
import "./LandingPage.css"

import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

function LandingPage(props) {
  useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push("/app")
    }
  })

  return (
    <div className="landingPage">
      <div>
        <div>
        <a href="/login">
            <button className="styled">Sign-In</button>
          </a>
        </div>
        <div>
          <a href="/register">
            <button className="styled">Sign-Up</button>
          </a>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(withRouter(LandingPage))
