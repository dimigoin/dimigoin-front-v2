import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import css from '@emotion/css';
import styled from '@emotion/styled';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

import DimiCard from '../../components/dimiru/DimiCard';
import DimiLongInput from '../../components/dimiru/DimiLongInput';
import DimiButton from '../../components/dimiru/DimiButton';
import DimiLoading from '../../components/dimiru/DimiLoading';

import { ICircle } from '../../interface/circle';
import SweetAlert from '../../utils/swal';

import variables from '../../scss/_variables.scss';
import { graphqlErrorMessage } from '../../utils/error';

const Header = styled.div`
  margin-bottom: 1.5rem;
  color: ${variables.grayDark};
  font-size: 26px;
  font-weight: ${variables.fontWeightBold};
`;

const CircleInfoCard = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const QuestionCardWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
`;

const QuestionCard = css`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

interface ICircleLogo {
  imageKey: string;
}

const CircleLogo = styled.div<ICircleLogo>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-image: url(${({ imageKey }) => `"https://dimigoin.s3.ap-northeast-2.amazonaws.com/${imageKey}"`});
  background-size: cover;
  background-position: center center;
  margin-right: 40px;
`;

const CircleInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const CircleFeatureWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const CircleTitle = styled.span`
  color: ${variables.black};
  font-size: 24px;
  font-weight: ${variables.fontWeightBold};
  margin-bottom: 1rem;
`;

const CircleFeatureTitle = styled.span`
  color: ${variables.grayDark};
  font-size: 20px;
  font-weight: ${variables.fontWeightRegular};
  margin-right: 0.3rem;

  &:last-child {
    margin-right: 0;
  }
`;

const CircleFeatureInfo = styled.span`
  color: ${variables.gray};
  font-size: 20px;
  font-weight: ${variables.fontWeightRegular};
  margin-right: 1rem;
`;

const FormTitle = styled.h1`
  color: ${variables.black};
  font-size: 20px;
  font-weight: ${variables.fontWeightBold};
  margin-bottom: 1rem;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = css`
  font-size: 20px;
`;

const Loading = css`
  margin: auto;
`;

interface IHistory {
  circleId: string;
}

const LOAD_QUESTIONS = gql`
  query {
    applicationForm
  }
`;

const LOAD_CIRCLE_INFO = gql`
  query($id: ID!) {
    circle(_id: $id) {
      _id
      name
      category
      imageKey
      chair {
        _id
        name
        serial
      }
    }
  }
`;

const CREATE_APPLICATION = gql`
  mutation($circleId: ID!, $form: JSON!) {
    createApplication(input: { circle: $circleId, form: $form }) {
      _id
    }
  }
`;

interface IQuestion {
  _id: string;
  question: string;
  maxLength: number;
}

const CircleApplication = () => {
  const history = useHistory<IHistory>();

  const [info, setInfo] = useState<ICircle>();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [active, setActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: questionData } = useQuery(LOAD_QUESTIONS);
  const { data: circleData } = useQuery(LOAD_CIRCLE_INFO, {
    variables: { id: history.location.state.circleId },
  });
  const [createApplication] = useMutation(CREATE_APPLICATION, {
    onCompleted: async () => {
      await SweetAlert.success('지원서 제출이 완료되었습니다.');
      await history.goBack();
    },
    onError: async (error) => {
      await setActive(true);
      await SweetAlert.error(graphqlErrorMessage(error));
    },
  });

  useEffect(() => {
    if (circleData) {
      setInfo(circleData.circle);
    }
  }, [circleData]);

  useEffect(() => {
    if (questionData) {
      setQuestions(questionData.applicationForm);
    }
  }, [questionData]);

  const LoadingInterval = setInterval(() => {
    if (!(info && questions)) {
      setLoading(true);
      clearInterval(LoadingInterval);
    }
  }, 300);

  const applyFrom = async () => {
    await setActive(false);
    const sure = await SweetAlert.confirm('제출 후에는 수정이 불가하니 다시 한 번 확인해주세요.', '정말 제출하시겠습니까?');
    if (sure.value) {
      await createApplication({
        variables: {
          circleId: history.location.state.circleId,
          form: answers,
        },
      });
    } else {
      await setActive(true);
    }
  };

  return (
    <>
      <Header>지원서 작성</Header>
      <DimiCard css={CircleInfoCard}>
        {info && questions && loading ? (
          <>
            <CircleLogo imageKey={info?.imageKey || ''} />
            <CircleInfoWrap>
              <CircleTitle>{info?.name}</CircleTitle>
              <CircleFeatureWrap>
                <CircleFeatureTitle>분류</CircleFeatureTitle>
                <CircleFeatureInfo>{info?.category}</CircleFeatureInfo>
                <CircleFeatureTitle>동장</CircleFeatureTitle>
                <CircleFeatureInfo>
                  {`${info?.chair.serial
                    .toString()
                    .substr(0, 1)}학년 ${info?.chair.serial
                    .toString()
                    .substr(1, 1)}반 ${info?.chair.name}`}
                </CircleFeatureInfo>
              </CircleFeatureWrap>
            </CircleInfoWrap>
          </>
        ) : (
          <DimiLoading css={Loading} />
        )}
      </DimiCard>
      <QuestionCardWrap>
        {loading
          && questions.map(({ _id, question, maxLength }: IQuestion) => (
            <DimiCard key={_id} css={QuestionCard}>
              <FormTitle>{question}</FormTitle>
              <DimiLongInput
                value={answers._id}
                onChange={(event) => {
                  event.persist();
                  setAnswers((prevState) => ({
                    ...prevState,
                    [_id]: event.target.value,
                  }));
                }}
                height={300}
                maxLength={maxLength}
                placeholder={`최대 글자수는 ${maxLength}자예요.`}
              />
            </DimiCard>
          ))}
      </QuestionCardWrap>
      <ButtonWrap>
        {loading && (
          <DimiButton active={active} onClick={applyFrom} css={Button}>
            제출하기
          </DimiButton>
        )}
      </ButtonWrap>
    </>
  );
};

export default CircleApplication;
