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

import './transactions.scss';

export default function Transactions() {

    const [id, setId] = useState('');
    const [page, setPage] = useState(0);
    const [transactionsList, setTransactionsList] = useState([]);
    const [transaction, setTransaction] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [handle, setHandle] = useState(false);

    const {getTransactions, getTransactionById, process, setProcess} = useCriptoService();

    useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    }, [])

    const onRequest = (initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getTransactions(page)
            .then(onTransactionsListLoaded)
            .then(() => setPage(page + 1))
            .then(() => setProcess('confirmed'))
            .then(() => setHandle(false));
    }

    const onRequestById = () => {
        getTransactionById(id)
            .then((res) => setTransaction([res]))
            .then(() => setProcess('confirmed'))
            .then(() => setHandle(true));
    }

    const onTransactionsListLoaded = (newTransitionsList) => {
        setTransactionsList(transactionsList => [...transactionsList, ...newTransitionsList]);
        setNewItemLoading(false);
    } 

    function changeValue (e) {
        if (e.target.value.length <= 36) {
            setId(e.target.value)
        }
        if (e.target.value.length === 0) {
            setTransaction('')
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
                    <TableCell align="left">{item.block}</TableCell>
                    <TableCell align="left">
                        <Link className='transactionLink' to={`/tokenList/${item.transactionsID}`}>
                            {`${item.transactionsID.slice(0, 20)}...`}
                        </Link>
                    </TableCell>
                    <TableCell align="left">{`${item.from.slice(0, 20)}...`}</TableCell>
                    <TableCell align="left">{`${item.to.slice(0, 20)}...`}</TableCell>
                    <TableCell align="left">{item.amount}</TableCell>
                    <TableCell align="left">{item.date}</TableCell>
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
        if (transaction.length === 0) {
            return setContent(process, () => renderItem(transactionsList), newItemLoading);
        } else {
            return setContent(process, () => renderItem(transaction), newItemLoading);
        }
        // eslint-disable-next-line
    }, [process, transaction])

    return (
        <>
            <Helmet>
                <meta name="description" content="Transactions"/>
                <title>Transaction</title>
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
                            placeholder="Search by transaction id" 
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
                            <TableCell align="left">Block</TableCell>
                            <TableCell align="left">Transactions ID</TableCell>
                            <TableCell align="left">From</TableCell>
                            <TableCell align="left">To</TableCell>
                            <TableCell align="left">Amount, GSC</TableCell>
                            <TableCell align="left">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {elements}
                    </TableBody>
                </Table>
            </TableContainer>
            {transactionsList.length === 0 && handle ? <div className='ups'>Ups, nothing found</div> : null}
            {transaction.length !== 1 ? <button className='tablelink' disabled={newItemLoading} onClick={() => onRequest()}>LOAD MORE TRANSACTIONS</button> : null}
        </>
    );
}