export const ACCEPT = 'accept';
export const FAIL = 'fail';
export const FINAL = 'final';
export const WAIT = 'wait';

export function getColorByStatus(status) {
  switch (status) {
    case ACCEPT:
      return 'aloes';
    case FAIL:
      return 'orange';
    case FINAL:
      return 'cyan';
    case WAIT:
      return 'gray';
    default:
      return '';
  }
}

export function getMessageByStatus(status) {
  switch (status) {
    case ACCEPT:
      return '합격';
    case FAIL:
      return '불합격';
    case FINAL:
      return '최종';
    case WAIT:
      return '대기';
    default:
      return '';
  }
}

export function hasStatus(status) {
  return [ACCEPT, FAIL, FINAL, WAIT].includes(status);
}
