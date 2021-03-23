import styled from "styled-components";
import {
  email_text_area_bg,
  main_text_color,
  email_container_background,
  main_bg_color,
  link_hover_color,
} from "../StyleConsts";
import { URGENT, IMPORTANT, CAN_WAIT } from "../../data_objects/Consts";
export const FeedElementStyle = styled.div`
  color: ${main_text_color};
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  grid-template-rows: 1fr 8fr;
  justify-items: flex-start;
  align-items: flex-start;
  width: 700px;
  height: max-content;
  padding: 0;
  margin: 30px 0;
  box-sizing: border-box;
  grid-template-areas:
    "time title close_button"
    ". component component";
  .element_title {
    grid-area: title;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
  }
  .element_time {
    grid-area: time;
  }
  .close_button {
    grid-area: close_button;
    background-color: transparent;
    color: ${main_text_color};
    font-size: 20px;
    margin-left: auto;
  }
  .element_component {
    width: 100%;
    grid-area: component;
    margin-bottom: 10px;
  }
`;

export const FeedWrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  overflow: hidden;
  .simple_bar {
    height: 100%;
  }
`;

export const BrilliantFeedStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const FeedComponentStyle = styled.div`
  width: 100%;
  .EmailThread {
    background-color: ${main_bg_color};
    margin: 10px;
  }

  .component_area {
    background-color: ${email_text_area_bg};
    border-radius: 10px;
    width: 100%;
    padding: 5px;
  }
  .ButtonsRow {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    button {
      border: 2px solid ${main_text_color};
      color: ${main_text_color};
      background-color: transparent;
    }
  }
`;
