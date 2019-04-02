import UserList from '../../../lib/components/user/list.vue';
import testData from '../../data';
import { mockHttp, mockRoute } from '../../http';
import { mockLogin, mockRouteThroughLogin } from '../../session';
import { trigger } from '../../event';

describe('UserList', () => {
  describe('routing', () => {
    it('redirects an anonymous user to login', () =>
      mockRoute('/users')
        .restoreSession(false)
        .afterResponse(app => {
          app.vm.$route.path.should.equal('/login');
        }));

    it('redirects the user back after login', () =>
      mockRouteThroughLogin('/users')
        .respondWithData(() => testData.administrators.sorted())
        .afterResponse(app => {
          app.vm.$route.path.should.equal('/users');
        }));

    it('redirects a user without a grant to assignment.list', () => {
      mockLogin({ verbs: ['project.list', 'user.list'] });
      return mockRoute('/account/edit')
        .complete()
        .route('/users')
        .respondWithData(() =>
          testData.extendedProjects.createPast(1).sorted())
        .respondWithData(() => testData.standardUsers.sorted())
        .afterResponses(app => {
          app.vm.$route.path.should.equal('/');
        });
    });

    it('redirects a user without a grant to user.list', () => {
      mockLogin({ verbs: ['project.list', 'assignment.list'] });
      return mockRoute('/account/edit')
        .complete()
        .route('/users')
        .respondWithData(() =>
          testData.extendedProjects.createPast(1).sorted())
        .afterResponse(app => {
          app.vm.$route.path.should.equal('/');
        });
    });

    it('navigates to /users after a click on the navbar link', () => {
      mockLogin();
      return mockRoute('/account/edit')
        .complete()
        .request(app => trigger.click(app, '#navbar-users-link'))
        .respondWithData(() => testData.standardUsers.sorted())
        .afterResponse(app => {
          app.vm.$route.path.should.equal('/users');
        });
    });
  });

  describe('after login as an administrator', () => {
    beforeEach(mockLogin);

    it('shows the table headers while the users are loading', () =>
      mockHttp()
        .mount(UserList)
        .respondWithData(() => testData.standardUsers.sorted())
        .beforeEachResponse(component => {
          component.find('thead tr').length.should.equal(1);
        }));

    it('table contains the correct data', () => {
      const users = testData.administrators.createPast(1).sorted();
      return mockHttp()
        .mount(UserList)
        .respondWithData(() => users)
        .afterResponse(page => {
          const tr = page.find('table tbody tr');
          tr.length.should.equal(2);
          for (let i = 0; i < tr.length; i += 1) {
            const td = tr[i].find('td');
            td.length.should.equal(3);
            td[0].text().should.equal(users[i].email);
            td[1].text().should.equal('Yes');
          }
        });
    });

    it('refreshes after the refresh button is clicked', () =>
      mockRoute('/users')
        .testRefreshButton({ collection: testData.administrators }));
  });
});
