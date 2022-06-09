import {useHttp} from '../hooks/http.hook';

const useCriptoService = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://api.blockchain-facade.dev.metal-rabbit.net/explorer/';

    const getTransactions = async () => {
        const res = await request(`${_apiBase}transactions`);
        return res.data.map(_transformData)
    }

    const getBullions = async () => {
        const res = await request(`${_apiBase}bullions`);
        return res.data.map(_transformData)
    }

    const getGsc = async () => {
        const res = await request(`${_apiBase}gsc`);
        return res.data.map(_transformData)
    }
    
    const getTransactionById = async (id) => {
        const res = await request(`${_apiBase}transaction/${id}`);
        return _transformData(res);
    }

    const getGscById = async (id) => {
        const res = await request(`${_apiBase}gsc/${id}`);
        return res.transactions.data.map(_transformData);
    }

    const getBullionsById = async (id) => {
        const res = await request(`${_apiBase}bullion/${id}`);
        return _transformData(res.token);
    }

    const getGscByIdforSearch = async (id) => {
        const res = await request(`${_apiBase}gsc/${id}`);
        return _transformData(res.token);
    }

    const _transformData = (data) => {
        return {
            transactionsID: data.id,
            block: data.block,
            from: data.from,
            to: data.to,
            amount: data.amount,
            date: data.date,
            gsc: data.gsc,
            serialNumber: data.serialNumber,
            weight: data.weight,
            initialStorage: data.initialStorage,
            id: data.transactionId,
            owner: data.owner
        }
    }

    return {setProcess,
            getTransactions,
            getTransactionById,
            getBullions,
            getGscById,
            getGscByIdforSearch,
            getBullionsById,
            getGsc,
            process, 
            clearError}
}

export default useCriptoService;