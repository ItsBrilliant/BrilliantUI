import styled from "styled-components";
import { email_text_area_bg, main_text_color, email_container_background, main_bg_color, link_hover_color } from '../StyleConsts'
import { URGENT, IMPORTANT, CAN_WAIT } from '../../data_objects/Consts'

const TaskGrid = styled.div`
  color: ${main_text_color};
  display: grid;
  grid-template-columns: 5fr 1fr 1fr 1fr 2fr 1fr 2.5fr;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;
  width: 100%;
  padding: 0 0 5px 0;
  box-sizing: border-box;
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
  font-size: 13px;
  background: ${email_text_area_bg};
  color: ${main_text_color};
  margin: 5px;
  height: 54px;
  border-radius: 20px;
  .task_text {
    grid-area: first_column;
    padding-left: 10px;
    justify-self:start;
  }
  .task_text:hover {
    cursor: pointer;
  }
  .tag{
    margin: 3px;
    background-color: #eeeeee;
    color: red;
    padding: 0.2em 0.5em;
    border-radius:7px;
  }
  .Dropdown-menu, .Dropdown-control{
    min-width: max-content;
    padding: 5px;
  }
  .Dropdown-control{
    padding-right: 35px;
    background-color: transparent;
  }
  &:hover{
    border: 2px solid ${link_hover_color};
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
   p {
     margin-left: 10px;
   }
`;


export const TaskHeaderStyle = styled(TaskGrid)`
  background-color: ${email_container_background};
  height: 40px;
  .filter_buttons{
    grid-area: first_column;
    margin-left: 5px;
    justify-self: start;
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

const add_tag_width = 250;
export const AddTagStyle = styled.div`
  background-color: #535c7b;
  border-radius: 10px;
  width: ${add_tag_width}px;
  position:fixed;
  top: ${props => props.location.y + 20}px;
  left: ${props => props.location.x - add_tag_width - 50}px;
  z-index: 2000;
  padding: 20px;
  .tag-item{
    border-radius:5px;
    padding: 0 4px;
    background-color: lightgreen;
    .button{
      padding: 0px;
      border-radius:0;
      background-color:transparent;
    }

  }
  input.input{
      width: 100%;
      box-sizing:border-box;
      background-color: lightblue;
      border-radius:5px;
      margin-bottom: 10px
  }
`;