import {TextField, styled} from "@mui/material";
import {BlackTheme} from "../../theme/theme";

// #TODO apply color theme
const curTheme = new BlackTheme();

const TextSmall = styled(TextField)(() => ({

    input: {
        color: curTheme.textColor,
        height: "20px",
        width: "100px"
    }
}));


export {TextSmall}
