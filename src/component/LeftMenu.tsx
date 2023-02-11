import React, {useState} from "react";

import {Box, Button, TextField, Menu, MenuItem} from "@mui/material";
import {TreeView, TreeItem, TreeItemProps} from "@mui/lab";
import styled from "@emotion/styled";

import {faPlus, faCaretRight, faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ButtonBox} from "./common/CommonBox";

import {TreeData} from "./treeData";
import {useRecoilState} from "recoil";

import {addBox, treeData} from "../state/menuState";

interface LeftMenuProps {
}


export default (props: LeftMenuProps) => {

    /**
     * Iterate all tree nodes and set children ids if exist
     * */
    const addChildrenToNode = (treeData: Array<TreeData>) => {
        const parentInfo: any = {};
        treeData.forEach(d => {
            const pId = d.parentId;

            if(pId in parentInfo) {
                parentInfo[pId].push(d.id);
            } else {
                parentInfo[pId] = [d.id];
            }
        })

        // add children ids
        treeData.filter(d => d.id in parentInfo)
            .forEach(d => {
                d.addChildren(parentInfo[d.id]);
            });
    }

    const addTreeNode = (allTreeData: Array<TreeData>, parentId?: string) => {
        let result: JSX.Element[] = [];


        allTreeData.forEach(d => {
            const id = d.id;

            // draw nodes without parent
            if(!d.parentId) {
                // remove root nodes.
                const subDatas = allTreeData.filter(sub => sub.parentId);

                if(d.childrenIds.length === 0) {
                    result.push(
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}>
                            <TreeItem nodeId={d.id} label={d.name}/>
                        </div>
                    );
                } else {
                    result.push(
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}>
                            <TreeItem nodeId={d.id} label={d.name}>
                                {addTreeNode(subDatas, id)}
                            </TreeItem>
                        </div>
                    )
                }
            } else if(parentId && (d.parentId === parentId)) {
                const subDatas = allTreeData.filter(sub => d.id !== sub.id);

                if(d.childrenIds.length === 0) {
                    result.push(
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}>
                            <TreeItem nodeId={d.id} label={d.name}/>
                        </div>
                    );
                } else {
                    // if node has children, call recursively
                    result.push(
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}>
                            <TreeItem nodeId={d.id} label={d.name}>
                                { addTreeNode(subDatas, id)}
                            </TreeItem>
                        </div>
                    )
                }
            }
        });

        return result;
    }


    const getHierarchicalTree = (treeData: Array<TreeData>, parentId?: string) => {
        addChildrenToNode(treeData);

        return addTreeNode(treeData);
    }

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();

        setSelectedNode(event.currentTarget.id);

        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };



    const handleClose = () => {
        setContextMenu(null);
    };


    /*
    *
    * sample tree data
    *
    * */

    const root: TreeData = new TreeData("1", "root");
    const root2: TreeData = new TreeData("100", "root2");
    const root4: TreeData = new TreeData("103", "root3");
    const root3: TreeData = new TreeData("101", "root2 child", "100");
    const tree1: TreeData = new TreeData("2", "tree1", "1");

    const tree1Child1: TreeData = new TreeData("10", "child1", "2");
    const tree1Child2: TreeData = new TreeData("11", "child2", "2");
    const tree1Child3: TreeData = new TreeData("12", "child3", "2");

    const tree2Child4: TreeData = new TreeData("13", "subChild", "10");

    const tree2: TreeData = new TreeData("3", "tree22", "1");

    const trees = [root, tree1, tree2, tree2Child4, tree1Child3, tree1Child1, tree1Child2 , root2, root3,root4]

    const root11: TreeData = new TreeData("16759768090991", "root");
    const root2222: TreeData = new TreeData("1675976814600", "root2", "16759768090991");

    const tempTree = [root11, root2222]
    // ====================================================================================================

    const [isAddboxShown, setAddbox] = useRecoilState(addBox);

    // const [tree, setTree] = useRecoilState(treeData);
    const [tree, setTree] = useState<Array<TreeData>>([]);
    const [addText, setAddText] = useState<string>("");
    const [selectedNode, setSelectedNode] = useState("");

    const treeItems = getHierarchicalTree(tree);


    return (
        <Box>
            <Box>
                <ButtonBox onClick={() => {
                    setSelectedNode("");
                    setAddbox(true)
                }}>
                    <FontAwesomeIcon icon={faPlus} />

                </ButtonBox>
            </Box>

            {/* Add view */}
            <Box style={{display: isAddboxShown? "block" : "none", height: "100%"}}>
                <TextField size={"small"} variant={"standard"} onChange={(e) => setAddText(e.target.value)} />
                {addText}

                <Button onClick={() => {

                    setTree(old => getTreeData(old, addText, selectedNode));
                    setAddbox(false);
                }}> OK </Button>
            </Box>

            {/* Tree view*/}
            <Box>
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<FontAwesomeIcon icon={faCaretDown} />}
                    defaultExpandIcon={<FontAwesomeIcon icon={faCaretRight} />}
                >
                    {treeItems}

                </TreeView>
            </Box>

            {/* Context menu for right click*/}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => {
                    setAddbox(true);
                    handleClose();
                }}>Add</MenuItem>

            </Menu>

        </Box>
    )

}

const getTreeData = (target: Array<TreeData>, name: string, parentId: string = "") => {
    const id: string = Date.now() + "";
    const treeNode: TreeData = new TreeData(id, name, parentId);

    const newArray: Array<TreeData> = [...target].map(t => t);
    newArray.push(treeNode);

    return newArray;
}