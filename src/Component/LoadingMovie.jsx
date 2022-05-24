import "./LoadingMovie.css"

/* 
shows the loading card
*/

const LoadingMovie = ({
    height,
    width,
    className
}) => {
    let style = {}
    style.height = height > 0 ? height : 350
    style.width = width > 0 ? width : 250

    // default for loading-movie
    // height: 350px
    // width: 250px

    // default for poster
    // height: 320px;
    // width: 250px;

    // default for line
    // height: 320px;
    // width: 0px;

    return (
        <div className={`loading-movie ${className}`} style={{
            height: height + "px",
            width: width + "px"
        }} >
            <div className="poster" style={{
                height: style.height - 30 + "px",
                width: style.width + "px",
            }}>
                <div className="line" style={{
                    height: style.height - 30 + "px",
                    width: "0px"
                }}></div>
            </div>
        </div>
    )
}

export default LoadingMovie;