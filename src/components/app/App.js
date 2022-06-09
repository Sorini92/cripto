import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";

import Transactions from "../transactions/Transactions";
import Bullions from "../bullions/Bullions";
import Gsc from "../gsc/Gsc";
import TokenList from "../tokenList/TokenList";
import Token from "../token/Token";
import Page404 from "../404/404";

function App() {
	return (
		<Router>
			<div className="app">
				<Routes>
					<Route path="/transactions" element={<Transactions />} />
					<Route path="/" element={<Navigate replace to='/transactions' />} />
					<Route path="bullions" element={<Bullions />} />
					<Route path="gsc" element={<Gsc />} />
					<Route path="tokenList/:transactionId" element={<TokenList />} />
					<Route path="token/:tokenId" element={<Token />} />
					<Route path='*' element={<Page404/>}/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
