import {atom} from "recoil";
import {AlertColor} from "@mui/material";

// ================= toast message ===============
const toast = atom<boolean>({
    key: "toastOpen",
    default: false
})

const toastMessage = atom<string>({
    key: "toastMessage",
    default: ""
})

const toastSeverity = atom<AlertColor>({
    key: "toastSeverity",
    default: "success"
})

export {toast, toastMessage, toastSeverity}
