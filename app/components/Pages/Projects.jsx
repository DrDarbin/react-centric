import React from 'react';
import pubsub from 'pubsub-js';
import { Grid, Row, Col, Modal, Button } from 'react-bootstrap';

import * as PROJECT_ACTIONS from '../../actions/project';
import {ProjectCard} from './ProjectCard';
import ProjectForm from './ProjectForm';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {bindActionCreators} from 'redux';
import {propSort} from '../../sort';
import {PROJECT_STATUS, PROJECT_SORT} from '../../constants/project';
import {projectQueryFilter, projectStatusFilter} from '../../filters/project';

class Projects extends React.Component {

    componentWillMount() {
        pubsub.publish('setPageTitle', this.constructor.name);
    }

    render() {
        const newProject = {};
        const {projects, editingProject, openProject, isNew, Actions, searchQuery, filteredStatus, sortBy} = this.props;
        const projectsCards = projects
            .filter(projectQueryFilter(searchQuery))
            .filter(projectStatusFilter(filteredStatus))
            .sort(propSort(sortBy))
            .map( project => (
                <Col md={6} lg={4} key={project.id}>
                    <ProjectCard project={project}
                                 removeProject={Actions.removeProject}
                                 openProject={Actions.openProject}
                                 editProject={Actions.editProject} />
                </Col>
            )
        );
        const statusFilterOptions = Object.keys(PROJECT_STATUS).map(key => (
            <option value={PROJECT_STATUS[key]} key={key}>
                {PROJECT_STATUS[key].replace(/^./, l => l.toUpperCase())}
            </option>
        ));

        const sortByOptions = Object.keys(PROJECT_SORT).map(key => (
            <option value={PROJECT_SORT[key]} key={key}>
                {PROJECT_SORT[key].replace(/[A-Z]/, l => ` ${l}`).replace(/^./, l => l.toUpperCase())}
            </option>
        ));

        const addProjectModal = isNew
            ? (
                <Modal  show={editingProject !== null}
                        onHide={() => Actions.closeProject()}
                        className="modal-right modal-auto-size">
                    <Modal.Header closeButton>
                        <Modal.Title>New Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ProjectForm initialValues={newProject}
                                     editProjectProp={Actions.editProjectProp} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => Actions.closeProject()}>Cancel</Button>
                        <Button className="btn btn-primary"
                                onClick={() => Actions.addProject(editingProject)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            )
            : null;
        const editProjectModal = (editingProject && !isNew)
            ? (
                <Modal  show={editingProject !== null}
                        onHide={() => Actions.closeProject()}
                        className="modal-right modal-auto-size">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ProjectForm initialValues={editingProject}
                                     editProjectProp={Actions.editProjectProp} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => Actions.editProject(null)}>Cancel</Button>
                        <Button className="btn btn-primary"
                                onClick={() => Actions.updateProject(editingProject.id, editingProject)}>Save</Button>
                    </Modal.Footer>
                </Modal>
            )
            : null;

        let openProjectModal = null;

        if (openProject) {
            openProjectModal = (
                <Modal  show={openProject !== null}
                        onHide={() => Actions.closeProject()}
                        className="modal-right modal-auto-size">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <ProjectCard project={openProject}
                                     removeProject={Actions.removeProject}
                                     editProject={Actions.editProject} />

                        {openProject.updatedDatetime
                            ? <p className="text-muted">{openProject.updatedDatetime}</p>
                            : null}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="text-left">
                            <p>Send a message to <strong>{openProject.name}</strong></p>
                        </div>
                        <div className="media m0 pv">
                            <div className="media-left"><a href="#"><img src="img/user/01.jpg" alt="User" className="media-object img-circle thumb32"/></a></div>
                            <div className="media-body media-middle">
                                <form action="">
                                    <div className="mda-form-group">
                                        <div className="mda-form-control pt0">
                                            <textarea rows="3" aria-multiline="true" tabIndex="0" aria-invalid="false" placeholder="Write here..." className="form-control"></textarea>
                                            <div className="mda-form-control-line"></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>
            )
        }
        const projectModal = addProjectModal || editProjectModal || openProjectModal;

        return (
            <section>
                {projectModal}
                <Grid fluid>
                    <div className="mb-lg">
                        <form role="form">
                            <div className="mda-form-control">
                                <Field name="searchQuery" component="input" type="text" placeholder="Search Project by Name, Status, Category, Description" className="form-control input-lg" />
                            </div>
                        </form>
                    </div>
                    <Row className="mv">
                        <Col sm={4}>
                            <button type="button" className="btn btn-info"
                                    onClick={() => Actions.createProject(newProject)}>
                                <em className="ion-plus mr-sm"></em>Add Project
                            </button>
                        </Col>
                        <Col sm={8} className="text-right hidden-xs">
                            <form className="form-inline">
                                <div className="form-group mr">
                                    <label className="mr"><small>Status</small></label>
                                    <Field component="select" name="filteredStatus" className="form-control input-sm">
                                        <option value="">All</option>
                                        {statusFilterOptions}
                                    </Field>
                                </div>
                                <div className="form-group">
                                    <label className="mr"><small>Sort by</small></label>
                                    <Field component="select" name="sortBy" className="form-control input-sm">
                                        {sortByOptions}
                                    </Field>
                                </div>
                            </form>
                        </Col>
                    </Row>
                    <Row>
                        {projectsCards}
                    </Row>
                </Grid>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        projects: state.project.projects,
        openProject: state.project.openProject,
        editingProject: state.project.editingProject,
        isNew: state.project.isNew,
        searchQuery: state.project.searchQuery,
        filteredStatus: state.project.filteredStatus,
        sortBy: state.project.sortBy,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        Actions: bindActionCreators(PROJECT_ACTIONS, dispatch)
    }
}

const projectsForm = {form: 'projects'};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(projectsForm)(Projects));
