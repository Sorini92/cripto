import { useNavigate } from "react-router-dom";

import arrow from '../../icons/arrow.svg';
import './backButton.scss';

export default function BackButton () {

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <>
            <button onClick={goBack} className='link'>
				<img src={arrow} alt='arrow' className='arrow'></img>
				<div>Back</div>
            </button>
        </>
    )
}