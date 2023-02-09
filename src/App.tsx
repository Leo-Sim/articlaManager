import React from 'react';

import './App.css';
import {Box} from "@mui/material";

import {BlackTheme} from "./theme/theme";
import LeftMenu from "./component/LeftMenu";

import {RecoilRoot} from "recoil";

function App() {
  //  #TODO apply color theme.

    const curTheme = new BlackTheme();
    const bgColor = curTheme.backgroundColor;
    const textColor = curTheme.textColor;

  return(
      <Box style={{
          minHeight:"100vh",
          backgroundColor: bgColor,
          color: textColor,
          padding: "15px 10px 15px 10px"
      }}>
          <RecoilRoot>
              <Box style={{float: "left", width: "200px"}}>
                  <LeftMenu></LeftMenu>
              </Box>
              <Box style={{float: "right"}}>

              </Box>
          </RecoilRoot>
      </Box>
  )
}

export default App;
