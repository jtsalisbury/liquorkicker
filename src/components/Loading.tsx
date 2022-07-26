import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import './styles/Loading.css';

const Loading = () => {
    return <>
        <CircularProgress variant="indeterminate" className="loading-spinner" />
        <p>Loading...</p>
    </>;
}

export default Loading;