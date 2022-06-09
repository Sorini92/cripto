import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import useCriptoService from '../../services/CriptoService';
import BackButton from '../backButton/BackButton';

import './tokenList.scss';
import copyImg from '../../icons/copy.svg';
import copyImgDone from '../../icons/copyDone.svg';

const setContent = (process, Component) => {
    switch (process) {
        case 'waiting': 
            return <Spinner/>;
        case 'loading': 
            return <Component/>;
        case 'confirmed': 
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

export default function TokenList() {
	
	const {transactionId} = useParams();

	const {getTransactionById, process, setProcess} = useCriptoService();

	const [transaction, setTransaction] = useState([]);
	const [tokens, setTokens] = useState([]);
	let [handle, setHandle] = useState(false);
	const [cuttedTokens, setCuttedTokens] = useState([]);
	const [offset, setOffset] = useState(10);


	useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    }, [])

    const onRequest = () => {
        getTransactionById(transactionId)
            .then((res) => {
				setTokens(res.gsc);
				setTransaction(res);
				setCuttedTokens(res.gsc.slice(0, 10))
			})
            .then(() => setProcess('confirmed'));
		
    }

	function addNewTokens () {
		setOffset(offset + 10);
		setCuttedTokens([...cuttedTokens, ...tokens.slice(offset, offset + 10)]);
	}

	function copyFunction (text) {
        navigator.clipboard.writeText(text)
        .then(() => {
            console.log(text);
        })
		setHandle(true);
		setTimeout(() => {
			setHandle(false);
        }, 3000)
    }

	function renderItem (arr) {
        const list = arr.map (item => {
            return (
				<TableRow
					key={item}
					sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
					>
					
					<TableCell align="left">
						<Link className='transactionLink' to={`/token/${item}`}>
							{item}
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
        return setContent(process, () => renderItem(cuttedTokens));
        // eslint-disable-next-line
    }, [cuttedTokens])

  	return (
		<>
			<Helmet>
                <meta name="description" content="Gsc List"/>
                <title>Gsc List</title>
            </Helmet>
			<div className="header">
                <div className="header__text">
                    <strong>CRIPTO INFO</strong>
                </div>
            </div>
            <hr className='header__line'></hr>

			<BackButton/>

			<div className='transaction'>
				<div className='transaction__id'>Transaction ID</div>
				<img onClick={() => copyFunction(transactionId)} alt='copy' src={handle ? copyImgDone : copyImg} className='transaction__img'></img>
				<div className='transaction__value'><strong>{transactionId}</strong></div>
			</div>

			<div className='info'>
				<div className='info__wrapper'>
					<div className='info__item'>Block</div>
					<div className='info__value'><strong>{transaction.block}</strong></div>
				</div>
				<div className='info__wrapper'>
					<div className='info__item'>Amount, GSC</div>
					<div className='info__value'><strong>{transaction.amount}</strong></div>
				</div>
				<div className='info__wrapper'>
					<div className='info__item'>Date</div>
					<div className='info__value'><strong>{transaction.date}</strong></div>
				</div>
			</div>

			<div className='transport'>
				<div className='transport__wrapper'>
					<div className='transport__item'>From</div>
					<div className='transport__value'><strong>{transaction.from}</strong></div>
				</div>
				<div className='transport__wrapper'>
					<div className='transport__item'>To</div>
					<div className='transport__value'><strong>{transaction.to}</strong></div>
				</div>
			</div>

			<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="left">Token ID</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{elements}
				</TableBody>
			</Table>
			</TableContainer>
			{cuttedTokens.length < 10 || cuttedTokens.length === tokens.length ? null : <button 
                className='tablelink'
                onClick={() => addNewTokens()}
                >
                LOAD MORE GSC's
            </button>}
		</>
  	);
}