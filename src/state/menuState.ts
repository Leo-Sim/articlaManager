import {atom} from "recoil";
import {TreeData} from "../component/treeData";

const treeData = atom<Array<TreeData>>({
    key: "treeData",
    default: []
})
//
// export {menuTree}

const addBox = atom<boolean>({
    key: "addBox",
    default: false
})

export {addBox, treeData}
