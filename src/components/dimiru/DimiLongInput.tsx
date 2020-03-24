import React from "react";
import styled from "@emotion/styled";
import css from "@emotion/css";

import variables from "../../scss/_variables.scss";

interface DimiLongInputProps {
  value?: string;
  onChange?: () => void;
  placeholder?: string;
  maxLength?: number;
  height?: number;
}

const DimiLongInput: React.FC<DimiLongInputProps> = ({
  value,
  onChange,
  placeholder = "",
  maxLength,
  height
}) => (
  <TextArea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    maxLength={maxLength}
    height={height}
  />
);

type TextAreaProps = {
  height?: number;
};

const TextArea = styled.textarea<TextAreaProps>`
  width: 100%;
  box-sizing: border-box;
  padding: 0.75em 1.5em;
  border: 0;
  outline: 0;
  appearance: none;
  background-color: ${variables.grayLighten};
  border-radius: 30px;
  box-shadow: inset 2px 2px 12px ${variables.shadow},
    inset -5px -5px 8px ${variables.white};
  font-family: "NanumSquareRound", sans-serif;
  font-size: inherit;
  transition: all 0.2s ease-in-out;

  &:focus {
    box-shadow: inset 1px 1px 16px ${variables.shadow},
      inset -2px -2px 3px ${variables.white};
  }

  &::placeholder {
    color: ${variables.gray};
  }

  height: ${props => `
    ${props.height}px;
  `};
`;

export default DimiLongInput;
