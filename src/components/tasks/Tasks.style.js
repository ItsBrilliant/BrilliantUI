import styled from "styled-components";
import { email_text_area_bg, main_text_color, email_container_background, main_bg_color, link_hover_color } from '../StyleConsts'
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts'

const TaskGrid = styled.div`
  color: ${main_text_color};
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr 2fr 1fr 3fr;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;
  width: calc(100% - 65px);
  padding: 0 0 5px 0;
  grid-template-areas: "first_column priority owner status watchers deadline tags";
  .priority{
    grid-area: priority;
  }
  .owner{
    grid-area: owner;
  }
  .status{
    grid-area: status;
  }
  .watchers{
    grid-area: watchers;
  }
  .deadline{
    grid-area: deadline;
  }
  .tags{
    grid-area: tags;
  }
  
`;

export const TaskRowStyle = styled(TaskGrid)`
  background: ${email_text_area_bg};
  color: ${main_text_color};
  margin: 5px;
  height: 50px;
  border-radius: 20px;
  .task_text {
    grid-area: first_column;
    padding-left: 10px;
  }
  .tag{
    border:1px solid yellow;
    margin: 3px;
    background-color: white;
    color: red;
    padding: 2px;
  }
  .Dropdown-menu, .Dropdown-control{
    min-width: max-content;
    padding: 5px;
  }
  .Dropdown-control{
    padding-right: 35px;
    background-color: transparent;
  }
`;

export const GroupedTasksStyle = styled.div.attrs(props => {
  let my_color = "pink";
  console.log(props.priority);
  if (props.priority === URGENT) {
    my_color = "red";
  } else if (props.priority === IMPORTANT) {
    my_color = "orange";
  } else if (props.priority === CAN_WAIT) {
    my_color = "green";
  }
  return {
    my_color: my_color
  }
})`
   color: ${props => props.my_color};
`;


export const TaskHeaderStyle = styled(TaskGrid)`
  background-color: ${email_container_background};
  .filter_buttons{
    grid-area: first_column;
    margin-right: auto;
    margin-left: 5px;
    button {
      background-color: ${main_bg_color};
      margin: 5px;
      padding: 5px;
      font-weight: bold;
      color: ${main_text_color};
    }
    button.selected {
      background-color: ${link_hover_color};
      color: ${main_bg_color};
    }
  }
  
`;