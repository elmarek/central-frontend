import ProjectNew from '../../../lib/components/project/new.vue';
import testData from '../../data';
import { mockHttp, mockRoute } from '../../http';
import { mockLogin } from '../../session';
import { submitForm, trigger } from '../../event';

describe('ProjectNew', () => {
  beforeEach(mockLogin);

  describe('modal', () => {
    it('does not show the modal initially', () =>
      mockRoute('/')
        .respondWithData(() => testData.extendedProjects.createPast(1).sorted())
        .afterResponses(app => {
          app.first(ProjectNew).getProp('state').should.be.false();
        }));

    describe('after button click', () => {
      it('shows the modal', () =>
        mockRoute('/')
          .respondWithData(() => testData.extendedProjects.createPast(1).sorted())
          .afterResponses(app => trigger.click(app, '#project-list-new-button'))
          .then(app => {
            app.first(ProjectNew).getProp('state').should.be.true();
          }));

      it('focuses the input', () =>
        mockRoute('/', { attachToDocument: true })
          .respondWithData(() => testData.extendedProjects.createPast(1).sorted())
          .afterResponses(app => trigger.click(app, '#project-list-new-button'))
          .then(app => {
            app.first('#project-new input').should.be.focused();
          }));
    });
  });

  it('implements some standard button things', () =>
    mockHttp()
      .mount(ProjectNew, {
        propsData: {
          state: true
        }
      })
      .request(modal => submitForm(modal, 'form', [['input', 'My Project']]))
      .standardButton());

  describe('after the user submits the form successfully', () => {
    let app;
    beforeEach(() => mockRoute('/')
      .respondWithData(() => testData.extendedProjects.createPast(1).sorted())
      .afterResponses(component => {
        app = component;
      })
      .request(() => trigger.click(app, '#project-list-new-button')
        .then(() => submitForm(app, '#project-new form', [
          ['input', testData.extendedProjects.createNew().name]
        ])))
      .respondWithData(() => testData.simpleProjects.last()) // ProjectNew
      .respondWithData(() => testData.simpleProjects.last()) // ProjectHome
      .respondWithData(() => testData.extendedFieldKeys.sorted())
      .respondWithData(() => testData.extendedForms.sorted()));

    it('redirects to the project overview', () => {
      app.vm.$route.path.should.equal('/projects/2');
    });

    it('shows a success alert', () => {
      app.should.alert('success');
    });
  });
});
