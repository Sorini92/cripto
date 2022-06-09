import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import './token.scss';
import copyImg from '../../icons/copy.svg';
import copyImgDone from '../../icons/copyDone.svg';

import useCriptoService from '../../services/CriptoService';
import BackButton from '../backButton/BackButton';
import setContent from '../../utils/setContent';

export default function Token() {

    const {tokenId} = useParams();

    const {getGscById, process, setProcess} = useCriptoService();
    const [gscList, setGscList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [buffer, setBuffer] = useState('');

    useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    }, [])

    const onRequest = (initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getGscById(tokenId)
            .then(onGscListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onGscListLoaded = (newGscList) => {
        setGscList(gscList => [...gscList, ...newGscList]);
        setNewItemLoading(false);
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

    function renderItem (arr) {
        const list = arr.map (item => {
            return (
                <TableRow
                    key={item.transactionsID}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="left">{item.block}</TableCell>
                        <TableCell align="left">
                            <img onClick={() => copyFunction(item.transactionsID)} alt='copy' src={item.transactionsID === buffer ? copyImgDone : copyImg} className='token__img'></img>
                            {`${item.transactionsID.slice(0, 20)}...`}
                        </TableCell>
                        <TableCell align="left">{`${item.from.slice(0, 20)}...`}</TableCell>
                        <TableCell align="left">{`${item.to.slice(0, 20)}...`}</TableCell>
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
        return setContent(process, () => renderItem(gscList), newItemLoading);
        // eslint-disable-next-line
    }, [process, buffer])

    return (
        <>
            <Helmet>
                <meta name="description" content="Token"/>
                <title>Token</title>
            </Helmet>
            <div className="header">
                <div className="header__text">
                    <strong>CRIPTO INFO</strong>
                </div>
            </div>
            <hr className='header__line'></hr>

            <BackButton/>

            <div className='tokenWrapper'>
                <div className='token__id'>Token</div>
                <div className='token__value'><strong>{tokenId}</strong></div>
            </div>

            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                    <TableCell align="left">Block</TableCell>
                        <TableCell align="left">Transactions ID</TableCell>
                        <TableCell align="left">From</TableCell>
                        <TableCell align="left">To</TableCell>
                        <TableCell align="left">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {elements}
                </TableBody>
            </Table>
            </TableContainer>
            <button 
                className='tablelink'
                disabled={newItemLoading}
                onClick={() => onRequest()}
                >
                LOAD MORE TRANSACTIONS
            </button>
        </>
    );
}