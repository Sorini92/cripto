import { NavLink } from "react-router-dom";

import './tabs.scss'

const Tabs = () => {

    let activeStyle = {
        textDecoration: "underline",
        color: 'blue'
    };

    return (
        <div className="tabs">
            <NavLink 
                to="/transactions" 
                style={({ isActive }) => isActive ? activeStyle : undefined} 
                className="tabs__link"
                >
                    Transactions</NavLink>
            <NavLink 
                to="/bullions" 
                style={({ isActive }) => isActive ? activeStyle : undefined} 
                className="tabs__link"
                >
                    Bullions
            </NavLink>
            <NavLink 
                to="/gsc" 
                style={({ isActive }) => isActive ? activeStyle : undefined} 
                className="tabs__link"
                >
                    GSC
            </NavLink>
        </div>
    )
}

export default Tabs;