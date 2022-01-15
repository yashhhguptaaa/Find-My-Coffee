import {useState} from "react";

const useTrackLocation = () => {
    const [locationErrorMsg, setLocationErrorMsg] = useState("")
    const [latlong, setLatlong] = useState("")

    const success = (position) => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLatlong(`${latitude},${longitude}`)
        setLocationErrorMsg("")
    }

    const error = () => {
        setLocationErrorMsg('Unable to retrieve your location')
    }

    const handleTrackLocation = () => {
        if(!navigator.geolocation) {
            setLocationErrorMsg("Geolocation is not supported by your browser")
          } else {
            // status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }

    return {
        latlong,
        handleTrackLocation,
        locationErrorMsg
    };
}

export default useTrackLocation;