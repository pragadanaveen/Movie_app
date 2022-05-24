/*
used to show the warning,error
*/

import "./Notification.css"

const Notification = ({text}) => {
    return(
        <div className="notification">
            <div className="text">
                {text}
            </div>
        </div>
    )
}

export default Notification;