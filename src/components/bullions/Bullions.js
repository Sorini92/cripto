import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from "react-helmet";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from "../tabs/Tabs";

import useCriptoService from '../../services/CriptoService';
import setContent from '../../utils/setContent';

import './bullions.scss';
import copyImg from '../../icons/copy.svg';
import copyImgDone from '../../icons/copyDone.svg';

export default function Bullions() {

    const [id, setId] = useState('');
    const [bullionsList, setBullionsList] = useState([]);
    const [bullion, setBullion] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [buffer, setBuffer] = useState('');
    const [handle, setHandle] = useState(false);

    const {getBullions, getBullionsById, process, setProcess} = useCriptoService();

    useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    }, [])

    const onRequest = (initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getBullions()
            .then(onBullionsListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onBullionsListLoaded = (newBullionsList) => {
        setBullionsList(bullionsList => [...bullionsList, ...newBullionsList]);
        setNewItemLoading(false);
    } 

    const onRequestById = () => {
        getBullionsById(id)
            .then((res) => setBullion([res]))
            .then(() => setProcess('confirmed'))
            .then(() => setHandle(true));
    }

	function copyFunction (text) {
        setBuffer(text)
        navigator.clipboard.writeText(text)
        .then(() => {
            console.log(text);
        })
        setTimeout(() => {
            setBuffer('');
        }, 3000);
    }

    function changeValue (e) {
        if (e.target.value.length <= 10) {
            setId(e.target.value)
        }
        if (e.target.value.length === 0) {
            setBullion('')
        }
    }

    function pressedEnter (e) {
        if(e.key === "Enter" && id.length !== 10) {
            e.preventDefault();
        }
    }

	function renderItem (arr) {
        const list = arr.map (item => {
            return (
                <TableRow
					key={item.transactionsID}
					sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
					>
						<TableCell align="left">{item.transactionsID}</TableCell>
						<TableCell align="left">{item.date}</TableCell>
						<TableCell align="left">
							<img alt='copy' onClick={() => copyFunction(item.serialNumber)} src={item.serialNumber === buffer ? copyImgDone : copyImg} className='bullions__img'></img>
							{item.serialNumber}
						</TableCell>
						<TableCell align="left">{item.weight}</TableCell>
						<TableCell align="left">{item.initialStorage}</TableCell>
				</TableRow>
            )
        })
        return (
            <>
                {list}
            </>
        )
    }

    const elements = useMemo(() => {
        if (bullion.length === 0) {
            return setContent(process, () => renderItem(bullionsList), newItemLoading);
        } else {
            return setContent(process, () => renderItem(bullion), newItemLoading);
        }
        // eslint-disable-next-line
    }, [process, buffer, bullion])

  	return (
		<>
            <Helmet>
                <meta name="description" content="Bullions"/>
                <title>Bullions</title>
            </Helmet>
             <div className="header">
                <div className="header__text">
                    <strong>CRIPTO INFO</strong>
                </div>
                <div className='header__wrapper'>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        onRequestById()
                    }}>
                        <input 
                            onKeyDown={pressedEnter}
                            type='text' 
                            onChange={changeValue} 
                            value={id} 
                            placeholder="Search by bullion id" 
                            className="header__input"
                        />
                        {id.length === 10 ? <button type='submit' className='header__btn'>Search</button> : null}
                    </form>
                </div>
            </div>
            <hr className='header__line'></hr>

			<Tabs />
			<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="left">ID</TableCell>
						<TableCell align="left">Creation Data</TableCell>
						<TableCell align="left">Serial number</TableCell>
						<TableCell align="left">Weight (gr)</TableCell>
						<TableCell align="left">Vault</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{elements}
				</TableBody>
			</Table>
			</TableContainer>
            {bullionsList.length === 0 && handle ? <div className='ups'>Ups, nothing found</div> : null}
            {bullion.length !== 1 ? <button className='tablelink' disabled={newItemLoading} onClick={() => onRequest()}>LOAD MORE BULLIONS</button> : null}
		</>
  	);
}