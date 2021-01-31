import React from "react";
import * as Icon from '@ant-design/icons';

export default function App(props) {

    let { type,style } = props;

    var component = React.createElement(
        Icon[type] == undefined ? Icon["CloseCircleOutlined"] : Icon[type] ,{ style: { fontSize: '20px', color: '#08c' } }
    );

    return (
        <div style={style} >
            {component}
        </div>
    );
}