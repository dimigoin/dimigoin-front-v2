import * as React from 'react';
import { useLocation } from 'react-router-dom';

import ServiceWrapper from '../../components/ServiceWrapper';
import DefaultNavbar from '../../components/DefaultNavbar';
import DimiMenu from '../../components/dimiru/DimiMenu';
import DimiMenuItem, { MenuItem } from '../../components/dimiru/DimiMenuItem';

const menuItemList: MenuItem[] = [
  {
    route: '/request/circle',
    name: '동아리 정보 확인',
  },
  {
    route: '/request/circle/application',
    name: '동아리 가입 신청',
  },
];

const RequestWrapper: React.FC = ({ children }) => {
  const { pathname: currentPath } = useLocation();

  return (
    <ServiceWrapper
      navbar={<DefaultNavbar />}
      menu={(
        <DimiMenu>
          {menuItemList.map(({ route, name }) => (
            <DimiMenuItem
              key={route}
              route={route}
              active={currentPath === route}
            >
              {name}
            </DimiMenuItem>
          ))}
        </DimiMenu>
      )}
    >
      {children}
    </ServiceWrapper>
  );
};

export default RequestWrapper;
