import styled from "styled-components";
import { email_text_area_bg, main_text_color } from '../StyleConsts'

const TaskRowStyle = styled.div`
  background: ${email_text_area_bg};
  color: ${main_text_color};
  padding: 10px;
  margin: 5px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  .tag{
    border:1px solid yellow;
    margin: 2px;
    background-color: white;
    color: red;
    padding: 2px;
  }
`;

export default TaskRowStyle;
