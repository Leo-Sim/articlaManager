import React, {useState} from "react";

import {Box, Divider, Menu, MenuItem, Snackbar, Alert, AlertColor} from "@mui/material";
import {TreeView, TreeItem, TreeItemProps} from "@mui/lab";
import styled from "@emotion/styled";

import {faPlus, faCaretRight, faCaretDown, faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ButtonBox} from "./common/commonBox";
import {TextSmall} from "./common/commonInput";

import {TreeData} from "./treeData";
import {useRecoilState} from "recoil";

import {addBox, treeData} from "../state/menuState";

import {toast, toastSeverity, toastMessage, selectedNode as rSelectedNode} from "../state/commonState";

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
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}
                             onClick={(e) => clickNode(e, d.id)}
                        >
                            <TreeItem nodeId={d.id} label={d.name}/>
                        </div>
                    );
                } else {
                    result.push(
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}
                             onClick={(e) => clickNode(e, d.id)}
                        >
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
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}
                             onClick={(e) => clickNode(e, d.id)}
                        >
                            <TreeItem nodeId={d.id} label={d.name}/>
                        </div>
                    );
                } else {
                    // if node has children, call recursively
                    result.push(
                        <div key={d.id} id={d.id} onContextMenu={handleContextMenu}
                             onClick={(e) => clickNode(e, d.id)}
                        >
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
        event.stopPropagation();

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

    const [toastOpen, setToastOpen] = useRecoilState(toast);
    const [toastMsg, setToastMsg] = useRecoilState(toastMessage);
    const [toastSevere, setToastSevere] = useRecoilState(toastSeverity);

    const showToast = (message: string, severity: AlertColor) => {
        setToastSevere(severity);
        setToastMsg(message);
        setToastOpen(true);
    }

    const closeToast = () => {
        setToastOpen(false)
    }

    const addNodeToTree = () => {
        if(!addText) {
            showToast("Enter name of node", "error");
            return;
        }

        setTree(old => getTreeData(old, addText, selectedNode));
        setAddbox(false);
        showToast( "\"" + addText + "\" is added to tree", "success");
    }

    // Remove node from tree
    const removeNode = () => {

        handleClose();
    }

    // Add node to tree
    const addNode = () => {
        setAddbox(true);
        handleClose();
    }

    const closeAdd = () => {
        setAddbox(false);
    }


    // Event handler when a node is clicked
    const [, setClickedNode] = useRecoilState(rSelectedNode);
    const clickNode = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        setClickedNode(id);
    }


    const handleClose = () => {
        setContextMenu(null);
    };

    const [isAddboxShown, setAddbox] = useRecoilState(addBox);

    const [tree, setTree] = useState<Array<TreeData>>([]);
    const [addText, setAddText] = useState<string>("");
    const [selectedNode, setSelectedNode] = useState("");

    // const [treeItems, setTreeItems] = useState<Array<JSX.Element>>(getHierarchicalTree(tree))
    // setTreeItems(getHierarchicalTree(tree))

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

                <TextSmall label="name"
                           color={"secondary"}
                           size={"small"}
                           variant={"standard"}
                           onChange={(e) => setAddText(e.target.value)} />


                <Box style={{display:"inline-block"}}>
                    <Box>
                        <ButtonBox>
                            <FontAwesomeIcon icon={faCheck} size={"sm"} onClick={addNodeToTree}/>
                        </ButtonBox>
                        <ButtonBox>
                            <FontAwesomeIcon icon={faXmark} size={"sm"} onClick={closeAdd}/>
                        </ButtonBox>
                    </Box>
                </Box>
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
                <MenuItem onClick={() => addNode()}>
                    Add
                </MenuItem>

                <Divider/>

                <MenuItem onClick={() => removeNode()}>
                    Delete
                </MenuItem>
            </Menu>
            <Snackbar
                open={toastOpen}
                autoHideDuration={3000}
                onClose={closeToast}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >
                <Alert severity={toastSevere}
                       onClose={closeToast}>
                    {toastMsg}
                </Alert>
            </Snackbar>
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