import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue';
import nav from '@/_nav.js';
import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';
import { logout } from '@/auth'; // auth.js에서 logout 함수 가져오기

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const router = useRouter(); // router 인스턴스 가져오기
    const firstRender = ref(true);

    onMounted(() => {
      firstRender.value = false;
    });

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        );
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) => {
                return h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    as: 'div',
                    href: props.href,
                    onClick: () => {
                      if (item.name === 'Logout') {
                        logout(); // 로그아웃 처리
                        router.push('/'); // 메인 페이지로 리디렉션
                      } else {
                        props.navigate();
                      }
                    },
                  },
                  {
                    default: () => [
                      item.icon
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon',
                            name: item.icon,
                          })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                );
              },
            },
          )
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
            },
            {
              default: () => item.name,
            },
          );
    };

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
        },
        {
          default: () => nav.map((item) => renderItem(item)),
        },
      );
  },
});

export { AppSidebarNav };
