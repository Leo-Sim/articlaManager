
import React from "react";

import {Tabs, Tab} from "@mui/material";
import {selectedNode} from "../../state/commonState";
import {useRecoilValue} from "recoil";



export default () => {

    const selectedId = useRecoilValue(selectedNode)

    return (<div>
        right
    </div>)

}
