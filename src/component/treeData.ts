import React from "react";
import {TreeItem} from "@mui/lab";

class TreeData {

    private _id: string = "";
    private _name: string = "";
    private _parentId: string = "";
    private _childrenIds: Array<string> = [];
    private _isShown: boolean = false;


    constructor(id: string, name: string, parentId?: string, childrenIds?: Array<string>) {
        this.id = id;
        this.name = name;

        if(parentId){
            this.parentId = parentId;
        }
        if(childrenIds) {
            this.addChildren(childrenIds);
        }
    }

    get isShown(): boolean {
        return this._isShown;
    }

    set isShown(value: boolean) {
        this._isShown = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get parentId(): string {
        return this._parentId;
    }

    set parentId(value: string) {
        this._parentId = value;
    }

    get childrenIds(): Array<string> {
        return this._childrenIds;
    }

    set childrenIds(value: Array<string>) {
        this._childrenIds = value;
    }

    public addChildren(children: string | Array<string>) {

        if(Array.isArray(children)) {
            this.childrenIds.push(...children);
        } else {
            this.childrenIds.push(children);
        }
    }
}

export {TreeData}