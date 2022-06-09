import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Link } from "react-router-dom";
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

import './gsc.scss';

export default function Gsc() {

    const [id, setId] = useState('');
    const [gscList, setGscList] = useState([]);
    const [gsc, setGsc] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [handle, setHandle] = useState(false);

    const {getGsc, getGscByIdforSearch, process, setProcess} = useCriptoService();

    useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    }, [])

    const onRequest = (initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getGsc()
            .then(onGscListLoaded)
            .then(() => setProcess('confirmed'))
            .then(() => setHandle(true));
    }

    const onRequestById = () => {
        getGscByIdforSearch(id)
            .then((res) => setGsc([res]))
            .then(() => setProcess('confirmed'))
            .then(() => setHandle(true));
    }

    const onGscListLoaded = (newGscList) => {
        setGscList(gscList => [...gscList, ...newGscList]);
        setNewItemLoading(false);
    } 

    function changeValue (e) {
        if (e.target.value.length <= 36) {
            setId(e.target.value)
        }
        if (e.target.value.length === 0) {
            setGsc('')
        }
    }

    function pressedEnter (e) {
        if(e.key === "Enter" && id.length !== 36) {
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
						<TableCell align="left">{item.owner}</TableCell>
						<TableCell align="left">
							<Link className='transactionLink' to={`/tokenList/${item.id}`}>
								{item.id}
							</Link>
						</TableCell>
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
        if (gsc.length === 0) {
            return setContent(process, () => renderItem(gscList), newItemLoading);
        } else {
            return setContent(process, () => renderItem(gsc), newItemLoading);
        }
        // eslint-disable-next-line
    }, [process, gsc])

	return (
		<>
            <Helmet>
                <meta name="description" content="Gsc"/>
                <title>Gsc</title>
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
                            placeholder="Search by gsc id" 
                            className="header__input"
                        />
                        {id.length === 36 ? <button type='submit' className='header__btn'>Search</button> : null}
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
						<TableCell align="left">Creation date</TableCell>
						<TableCell align="left">Owner</TableCell>
						<TableCell align="left">Transactions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{elements}
				</TableBody>
			</Table>
			</TableContainer>
            {gscList.length === 0 && handle ? <div className='ups'>Ups, nothing found</div> : null}
            {gsc.length !== 1 ? <button className='tablelink' disabled={newItemLoading} onClick={() => onRequest()}>LOAD MORE GSC'S</button> : null}
		</>
	);
}