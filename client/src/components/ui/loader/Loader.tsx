import {Oval} from "react-loader-spinner";

export default function Loader() {
    return (
        <Oval
        visible={true}
        height="40"
        width="40"
        color="#145FC0"
        secondaryColor="#5786de"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
    );
}