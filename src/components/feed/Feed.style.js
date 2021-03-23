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
  grid-template-rows: 1fr 6fr;
  justify-items: flex-start;
  align-items: flex-start;
  width: 600px;
  height: 400px;
  padding: 0;
  margin: 5px;
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
  }
  .element_component {
    grid-area: component;
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
