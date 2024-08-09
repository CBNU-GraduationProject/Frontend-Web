export default [
  {
    component: 'CNavTitle',
    name: 'Main',
  },
  {
    component: 'CNavItem',
    name: '지도 조회',
    to: '/map',
    icon: 'cilLocationPin',
  },
  {
    component: 'CNavTitle',
    name: 'Components',
  },
  {
    component: 'CNavItem',
    name: '데이터 등록',
    to: '/registration',
    icon: 'cilPencil',
  },
  {
    component: 'CNavItem',
    name: '데이터 조회',
    to: '/list',
    icon: 'cilList',
  },
  {
    component: 'CNavItem',
    name: '데이터 삭제',
    to: '/delete',
    icon: 'cilXCircle',
  },
  {
    component: 'CNavTitle',
    name: 'Extras',
  },
  {
    component: 'CNavItem',
    name: 'Logout',
    to: '/',
    icon: 'cilUser',
  },
]
